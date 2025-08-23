import { createClient } from "@v1/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const smsSchema = z.object({
  to: z.string().min(1),
  body: z.string().min(1),
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
    const { to, body: messageBody } = smsSchema.parse(body);

    // Get Twilio configuration
    const { data: config } = await supabase
      .from("integration_configs")
      .select("config")
      .eq("user_id", user.id)
      .eq("provider", "twilio")
      .single();

    if (!config?.config) {
      return new NextResponse(
        JSON.stringify({ error: "Twilio integration not configured" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const twilioConfig = config.config as any;

    // In development, just log the SMS instead of actually sending
    if (process.env.NODE_ENV === "development") {
      console.log("📱 SMS would be sent:", {
        from: twilioConfig.phoneNumber || process.env.TWILIO_PHONE_NUMBER,
        to,
        body: messageBody,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        sid: `SM_dev_${Date.now()}`,
        status: "delivered",
        dev_mode: true,
      });
    }

    // For production, implement actual Twilio SDK call
    // const twilio = require('twilio');
    // const client = twilio(twilioConfig.accountSid, twilioConfig.authToken);
    // 
    // const message = await client.messages.create({
    //   body: messageBody,
    //   from: twilioConfig.phoneNumber,
    //   to: to,
    // });
    //
    // return NextResponse.json({
    //   success: true,
    //   sid: message.sid,
    //   status: message.status,
    // });

    return NextResponse.json({
      success: true,
      message: "SMS API endpoint created - implement Twilio SDK for production",
    });
  } catch (error) {
    console.error("SMS send error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to send SMS" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
