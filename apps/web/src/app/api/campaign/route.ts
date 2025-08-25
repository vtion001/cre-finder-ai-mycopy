import { NextResponse } from "next/server";

type Property = {
  id: number;
  address: string;
  owner: string;
  contactInfo: string;
  type: string;
  sqFt: string;
  assessedValue: string;
};

function extractPhoneNumber(contactInfo: string): string | null {
  const phoneRegex = /(\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/;
  const match = contactInfo?.match(phoneRegex);
  return match ? match[1] : null;
}

async function callVapi(property: Property) {
  const apiKey = process.env.VAPI_API_KEY;
  const assistantId = process.env.VAPI_ASSISTANT_ID;
  const webhookUrl = process.env.VAPI_WEBHOOK_URL;

  if (!apiKey || !assistantId) {
    return { success: false, message: "VAPI configuration is incomplete" };
  }

  const phoneNumber = extractPhoneNumber(property.contactInfo);
  if (!phoneNumber) {
    return { success: false, message: "No valid phone number in contact info" };
  }

  try {
    const res = await fetch("https://api.vapi.ai/call", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assistantId,
        customer: { number: phoneNumber },
        assistantOverrides: {
          variableValues: {
            propertyAddress: property.address,
            ownerName: property.owner,
            propertyType: property.type,
            assessedValue: property.assessedValue,
          },
        },
        webhook: webhookUrl,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: data?.message ?? "Failed to initiate VAPI call" };
    }
    return { success: true, message: `VAPI call initiated` };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "VAPI error" };
  }
}

async function sendTwilioSms(property: Property) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return { success: false, message: "Twilio configuration is incomplete" };
  }

  const toNumber = extractPhoneNumber(property.contactInfo);
  if (!toNumber) {
    return { success: false, message: "No valid phone number in contact info" };
  }

  const body = `Hi ${property.owner},\n\nWe have information about your property at ${property.address} (${property.type}, ${property.sqFt} sq ft, assessed value ${property.assessedValue}).\n\nReply for more details.\n\nBest regards,\nCRE Finder Team`;

  try {
    const basic = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basic}`,
      },
      body: new URLSearchParams({ To: toNumber, From: fromNumber, Body: body }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: data?.message ?? "Failed to send SMS" };
    }
    return { success: true, message: `SMS sent` };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Twilio error" };
  }
}

export async function POST(request: Request) {
  try {
    const { property } = (await request.json()) as { property: Property };
    if (!property?.address || !property?.owner || !property?.contactInfo) {
      return NextResponse.json({ error: "Invalid property payload" }, { status: 400 });
    }

    const [vapi, twilio] = await Promise.all([callVapi(property), sendTwilioSms(property)]);
    const overallSuccess = Boolean(vapi?.success || twilio?.success);

    return NextResponse.json({ vapi, twilio, overallSuccess });
  } catch (err) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}


