"use client";

import { useState } from "react";
import { Button } from "@v1/ui/button";
import { Input } from "@v1/ui/input";
import { Label } from "@v1/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@v1/ui/card";

type Dict = Record<string, string>;

type FieldErrors = Record<string, string[]>;

async function saveConfig(provider: string, payload: Record<string, unknown>) {
  const res = await fetch(`/api/integrations/${provider}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ config: payload }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const details = data?.details?.fieldErrors as FieldErrors | undefined;
    const error = data?.error || (await res.text());
    throw { message: error, fieldErrors: details } as { message: string; fieldErrors?: FieldErrors };
  }
}

export function IntegrationsForm({
  initialTwilio,
  initialSendgrid,
  initialVapi,
  sections,
}: {
  initialTwilio: Dict;
  initialSendgrid: Dict;
  initialVapi: Dict;
  sections?: ("twilio" | "sendgrid" | "vapi")[];
}) {
  const [twilio, setTwilio] = useState<Dict>(initialTwilio || {});
  const [sendgrid, setSendgrid] = useState<Dict>(initialSendgrid || {});
  const [vapi, setVapi] = useState<Dict>(initialVapi || {});
  const [saving, setSaving] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ provider?: string; fields?: FieldErrors }>({});
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <div className="grid gap-6">
      {(!sections || sections.includes("twilio")) && (
        <Card>
          <CardHeader>
            <CardTitle>Twilio</CardTitle>
            <CardDescription>Save credentials for SMS, Voice, Verify, and Number Purchasing.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-1">
              <Label>Enable Features</Label>
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" checked={twilio.features_sms === "true"} onChange={(e) => setTwilio({ ...twilio, features_sms: String(e.target.checked) })} /> SMS</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={twilio.features_voice === "true"} onChange={(e) => setTwilio({ ...twilio, features_voice: String(e.target.checked) })} /> Voice</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={twilio.features_verify === "true"} onChange={(e) => setTwilio({ ...twilio, features_verify: String(e.target.checked) })} /> Verify</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={twilio.features_purchaseNumbers === "true"} onChange={(e) => setTwilio({ ...twilio, features_purchaseNumbers: String(e.target.checked) })} /> Purchase Numbers</label>
              </div>
            </div>
            {[
              ["accountSid", "Account SID"],
              ["authToken", "Auth Token"],
              ["apiKey", "API Key"],
              ["apiSecret", "API Secret"],
              ["phoneNumber", "Phone Number"],
              ["messagingServiceSid", "Messaging Service SID"],
              ["verifyServiceSid", "Verify Service SID"],
              ["twimlAppSid", "TWIML App SID"],
              ["voiceWebhookUrl", "Voice Webhook URL"],
              ["smsWebhookUrl", "SMS Webhook URL"],
              ["whatsappNumber", "WhatsApp Number"],
            ].map(([key, label]) => (
              <div key={key} className="grid gap-1">
                <Label>{label}</Label>
                <Input
                  value={(twilio as any)[key as string] || ""}
                  onChange={(e) => setTwilio({ ...twilio, [key as string]: e.target.value } as any)}
                />
                {(errors.fields as any)?.[key as string]?.length ? (
                  <div className="text-xs text-destructive">{(errors.fields as any)[key as string][0]}</div>
                ) : null}
              </div>
            ))}
            <div className="flex gap-2 items-center">
              <Button
                onClick={async () => {
                  try {
                    setErrors({});
                    setSuccess(null);
                    setSaving("twilio");
                    await saveConfig("twilio", {
                      ...twilio,
                      features: {
                        sms: twilio.features_sms === "true",
                        voice: twilio.features_voice === "true",
                        verify: twilio.features_verify === "true",
                        purchaseNumbers: twilio.features_purchaseNumbers === "true",
                      },
                    });
                    setSuccess("Twilio settings saved.");
                  } catch (e: any) {
                    setErrors({ provider: "twilio", fields: e?.fieldErrors });
                  } finally {
                    setSaving(null);
                  }
                }}
                disabled={saving === "twilio"}
              >
                {saving === "twilio" ? "Saving..." : "Save Twilio"}
              </Button>
              {success && success.includes("Twilio") && (
                <span className="text-sm text-green-600">{success}</span>
              )}
              {errors.provider === "twilio" && !errors.fields && (
                <span className="text-sm text-destructive">Failed to save Twilio configuration.</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {(!sections || sections.includes("sendgrid")) && (
        <Card>
          <CardHeader>
            <CardTitle>SendGrid</CardTitle>
            <CardDescription>Save API key and default sender.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              ["apiKey", "API Key"],
              ["fromEmail", "From Email"],
            ].map(([key, label]) => (
              <div key={key} className="grid gap-1">
                <Label>{label}</Label>
                <Input
                  value={(sendgrid as any)[key as string] || ""}
                  onChange={(e) => setSendgrid({ ...sendgrid, [key as string]: e.target.value } as any)}
                />
                {(errors.fields as any)?.[key as string]?.length ? (
                  <div className="text-xs text-destructive">{(errors.fields as any)[key as string][0]}</div>
                ) : null}
              </div>
            ))}
            <Button
              onClick={async () => {
                try {
                  setErrors({});
                  setSuccess(null);
                  setSaving("sendgrid");
                  await saveConfig("sendgrid", sendgrid);
                  setSuccess("SendGrid settings saved.");
                } catch (e: any) {
                  setErrors({ provider: "sendgrid", fields: e?.fieldErrors });
                } finally {
                  setSaving(null);
                }
              }}
              disabled={saving === "sendgrid"}
            >
              {saving === "sendgrid" ? "Saving..." : "Save SendGrid"}
            </Button>
            {success && success.includes("SendGrid") && (
              <span className="text-sm text-green-600">{success}</span>
            )}
          </CardContent>
        </Card>
      )}

      {(!sections || sections.includes("vapi")) && (
        <Card>
          <CardHeader>
            <CardTitle>Vapi</CardTitle>
            <CardDescription>Save API credentials and webhook secret.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              ["apiKey", "API Key"],
              ["webhookSecret", "Webhook Secret"],
              ["publicKey", "Public Key"],
              ["orgId", "Org ID"],
              ["assistantId", "Assistant ID"],
            ].map(([key, label]) => (
              <div key={key} className="grid gap-1">
                <Label>{label}</Label>
                <Input
                  value={(vapi as any)[key as string] || ""}
                  onChange={(e) => setVapi({ ...vapi, [key as string]: e.target.value } as any)}
                />
                {(errors.fields as any)?.[key as string]?.length ? (
                  <div className="text-xs text-destructive">{(errors.fields as any)[key as string][0]}</div>
                ) : null}
              </div>
            ))}
            <Button
              onClick={async () => {
                try {
                  setErrors({});
                  setSuccess(null);
                  setSaving("vapi");
                  await saveConfig("vapi", vapi);
                  setSuccess("Vapi settings saved.");
                } catch (e: any) {
                  setErrors({ provider: "vapi", fields: e?.fieldErrors });
                } finally {
                  setSaving(null);
                }
              }}
              disabled={saving === "vapi"}
            >
              {saving === "vapi" ? "Saving..." : "Save Vapi"}
            </Button>
            {success && success.includes("Vapi") && (
              <span className="text-sm text-green-600">{success}</span>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}


