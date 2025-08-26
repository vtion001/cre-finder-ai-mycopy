import { NextResponse } from "next/server";
import { z } from "zod";

// Local decrypt to avoid cross-package import issues
import crypto from "crypto";

const CRYPTO_ALGO = "aes-256-gcm";
const IV_LENGTH = 12;

function getEncryptionKey(): Buffer {
  const secret = process.env.INTEGRATIONS_ENCRYPTION_KEY;
  if (!secret) {
    throw new Error("INTEGRATIONS_ENCRYPTION_KEY is not set");
  }
  const buf = Buffer.from(secret, "utf8");
  return buf.length === 32 ? buf : crypto.createHash("sha256").update(buf).digest();
}

function decryptString(payload: string): string {
  const key = getEncryptionKey();
  const parts = payload.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted payload format");
  }
  const [ivB64, encB64, tagB64] = parts;
  const iv = Buffer.from(ivB64, "base64");
  const encrypted = Buffer.from(encB64, "base64");
  const authTag = Buffer.from(tagB64, "base64");
  const decipher = crypto.createDecipheriv(CRYPTO_ALGO, key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}

const requestSchema = z.object({
  property: z.object({
    id: z.number(),
    address: z.string(),
    owner: z.string(),
    contactInfo: z.string(),
    phone: z.string(),
    type: z.string(),
    sqFt: z.string(),
    assessedValue: z.string(),
  }),
});

function normalizeUsPhone(phone: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

async function sendVapiCallUsingSupabase(organizationId: string | null, userId: string | null, targetPhone: string, payload: any) {
  try {
    const { createClient } = await import("@v1/supabase/server");
    const supabase = createClient();
    // Try by organization first, then fallback to user_id
    let { data, error } = await supabase
      .from('vapi_configs')
      .select('api_key, assistant_id, webhook_url, custom_prompt')
      .eq('organization', organizationId || '')
      .eq('is_active', true)
      .single();

    if (error || !data) {
      const res2 = await supabase
        .from('vapi_configs')
        .select('api_key, assistant_id, webhook_url, custom_prompt')
        .eq('user_id', userId || '')
        .eq('is_active', true)
        .single();
      data = res2.data as any;
      error = res2.error as any;
    }

    if (error || !data) {
      return { success: false, message: "VAPI not configured" };
    }

    const res = await fetch("https://api.vapi.ai/call", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${data.api_key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assistantId: data.assistant_id,
        customer: { number: targetPhone },
        assistantOverrides: {
          variableValues: {
            propertyAddress: payload.address,
            ownerName: payload.owner,
            propertyType: payload.type,
            assessedValue: payload.assessedValue,
          },
          ...(data.custom_prompt ? { firstMessage: data.custom_prompt } : {}),
        },
        webhook: data.webhook_url,
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { success: false, message: json?.message ?? "VAPI call failed" };
    return { success: true, message: `VAPI call initiated to ${targetPhone}` };
  } catch (err: any) {
    return { success: false, message: err?.message ?? "VAPI error" };
  }
}

async function sendTwilioSmsFromSupabase(userId: string | null, targetPhone: string, payload: any) {
  try {
    const { createClient } = await import("@v1/supabase/server");
    const supabase = createClient();
    const { data, error } = await supabase
      .from('twilio_configs')
      .select('account_sid, auth_token, phone_number')
      .eq('user_id', userId || '')
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return { success: false, message: "Twilio not configured" };
    }

    const accountSid: string = data.account_sid as unknown as string;
    const authTokenDecrypted: string = decryptString(String(data.auth_token));
    const fromNumber: string = data.phone_number as unknown as string;

    const body = `Hi ${payload.owner},\n\nWe have information about ${payload.address} (${payload.type}, ${payload.sqFt} sq ft, assessed value ${payload.assessedValue}). Reply for more details. - CRE Finder`;

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authTokenDecrypted}`).toString("base64")}`,
        },
        body: new URLSearchParams({ To: targetPhone, From: fromNumber, Body: body }),
      },
    );
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { success: false, message: json?.message ?? "SMS send failed" };
    return { success: true, message: `SMS sent to ${targetPhone}` };
  } catch (err: any) {
    return { success: false, message: err?.message ?? "Twilio error" };
  }
}

export async function POST(req: Request) {
  // Determine organization for the current user to fetch VAPI config
  let organizationId: string | null = null;
  let userId: string | null = null;
  try {
    const { createClient } = await import("@v1/supabase/server");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      userId = user.id;
      const { data: userRow } = await supabase
        .from('users')
        .select('organization')
        .eq('id', user.id)
        .single();
      organizationId = (userRow as any)?.organization ?? null;
    }
  } catch {}
  const json = await req.json().catch(() => null);
  const parsed = requestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 },
    );
  }
  const property = parsed.data.property;
  const normalized = normalizeUsPhone(property.phone);
  if (!normalized) {
    return NextResponse.json(
      {
        vapi: { success: false, message: "Invalid phone number" },
        twilio: { success: false, message: "Invalid phone number" },
        overallSuccess: false,
      },
      { status: 200 },
    );
  }

  const [vapi, twilio] = await Promise.allSettled([
    sendVapiCallUsingSupabase(organizationId, userId, normalized, property),
    sendTwilioSmsFromSupabase(userId, normalized, property),
  ]);

  const vapiResult =
    vapi.status === "fulfilled" ? vapi.value : { success: false, message: vapi.reason?.message ?? "VAPI failed" };
  const twilioResult =
    twilio.status === "fulfilled" ? twilio.value : { success: false, message: twilio.reason?.message ?? "Twilio failed" };

  const overallSuccess = Boolean(vapiResult.success || twilioResult.success);

  return NextResponse.json({
    vapi: vapiResult,
    twilio: twilioResult,
    overallSuccess,
  });
}
