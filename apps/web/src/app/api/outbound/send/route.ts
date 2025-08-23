import { createClient } from "@v1/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const campaignSchema = z.object({
  ids: z.array(z.string()),
  channels: z.object({
    sms: z.boolean(),
    voicemail: z.boolean(),
    phone: z.boolean(),
    email: z.boolean(),
    postcard: z.boolean(),
    handwritten: z.boolean(),
  }),
});

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { ids, channels } = campaignSchema.parse(body);

    // Get property records for the campaign
    const { data: records, error } = await supabase
      .from("property_records")
      .select("*")
      .in("id", ids);

    if (error) {
      throw new Error(`Failed to get property records: ${error.message}`);
    }

    // Get user's integration configurations
    const integrationPromises = ["vapi", "twilio", "sendgrid"].map(async (provider) => {
      const { data } = await supabase
        .from("integration_configs")
        .select("config")
        .eq("user_id", user.id)
        .eq("provider", provider)
        .single();
      return { provider, config: data?.config };
    });

    const integrations = await Promise.all(integrationPromises);
    const integrationsMap = Object.fromEntries(
      integrations.map(({ provider, config }) => [provider, config])
    );

    // Create campaign record
    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .insert({
        user_id: user.id,
        name: `Campaign ${new Date().toLocaleDateString()}`,
        channels: channels as any,
        record_ids: ids,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (campaignError) {
      console.error("Failed to create campaign:", campaignError);
      // Continue without campaign tracking if table doesn't exist
    }

    // Process each channel
    const results = {
      sms: { sent: 0, failed: 0 },
      voicemail: { sent: 0, failed: 0 },
      phone: { sent: 0, failed: 0 },
      email: { sent: 0, failed: 0 },
      postcard: { sent: 0, failed: 0 },
      handwritten: { sent: 0, failed: 0 },
    };

    for (const record of records) {
      // SMS via Twilio
      if (channels.sms && integrationsMap.twilio) {
        try {
          const response = await fetch(`${request.url.replace('/outbound/send', '/twilio/sms')}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: "555-0000", // TODO: Get actual phone number from property record
              body: `Hello! We're interested in your property at ${record.address}. Let's connect!`,
            }),
          });

          if (response.ok) {
            results.sms.sent++;
          } else {
            results.sms.failed++;
          }
        } catch (error) {
          console.error("SMS send failed:", error);
          results.sms.failed++;
        }
      }

      // Voice calls via VAPI
      if ((channels.voicemail || channels.phone) && integrationsMap.vapi) {
        try {
          const response = await fetch(`${request.url.replace('/outbound/send', '/vapi/call')}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phoneNumber: "555-0000", // TODO: Get actual phone number from property record
              type: channels.phone ? "call" : "voicemail",
              message: `Hi, we're interested in your property at ${record.address}. Please call us back!`,
            }),
          });

          if (response.ok) {
            if (channels.phone) results.phone.sent++;
            if (channels.voicemail) results.voicemail.sent++;
          } else {
            if (channels.phone) results.phone.failed++;
            if (channels.voicemail) results.voicemail.failed++;
          }
        } catch (error) {
          console.error("Voice call failed:", error);
          if (channels.phone) results.phone.failed++;
          if (channels.voicemail) results.voicemail.failed++;
        }
      }

      // Email via SendGrid
      if (channels.email && integrationsMap.sendgrid) {
        try {
          const response = await fetch(`${request.url.replace('/outbound/send', '/sendgrid/email')}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: "test@example.com", // TODO: Get actual email from property record
              subject: `Interest in your property at ${record.address}`,
              text: `Hello! We're interested in your property at ${record.address}. Please reach out to discuss further.`,
            }),
          });

          if (response.ok) {
            results.email.sent++;
          } else {
            results.email.failed++;
          }
        } catch (error) {
          console.error("Email send failed:", error);
          results.email.failed++;
        }
      }
    }

    // Update campaign status if created
    if (campaign) {
      await supabase
        .from("campaigns")
        .update({
          status: "completed",
          results: results as any,
          completed_at: new Date().toISOString(),
        })
        .eq("id", campaign.id);
    }

    return NextResponse.json({
      success: true,
      campaignId: campaign?.id,
      results,
      recordsProcessed: records.length,
    });
  } catch (error) {
    console.error("Campaign send error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to send campaign" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
