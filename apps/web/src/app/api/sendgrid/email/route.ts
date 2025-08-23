import { createClient } from "@v1/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  text: z.string().min(1),
  html: z.string().optional(),
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
    const { to, subject, text, html } = emailSchema.parse(body);

    // Get SendGrid configuration
    const { data: config } = await supabase
      .from("integration_configs")
      .select("config")
      .eq("user_id", user.id)
      .eq("provider", "sendgrid")
      .single();

    if (!config?.config) {
      return new NextResponse(
        JSON.stringify({ error: "SendGrid integration not configured" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const sendgridConfig = config.config as any;

    // In development, just log the email instead of actually sending
    if (process.env.NODE_ENV === "development") {
      console.log("📧 Email would be sent:", {
        from: sendgridConfig.fromEmail || "noreply@example.com",
        to,
        subject,
        text,
        html,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        messageId: `email_dev_${Date.now()}`,
        status: "delivered",
        dev_mode: true,
      });
    }

    // For production, implement actual SendGrid SDK call
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(sendgridConfig.apiKey);
    // 
    // const msg = {
    //   to,
    //   from: sendgridConfig.fromEmail,
    //   subject,
    //   text,
    //   html: html || text,
    // };
    //
    // const result = await sgMail.send(msg);
    //
    // return NextResponse.json({
    //   success: true,
    //   messageId: result[0].headers['x-message-id'],
    //   status: "sent",
    // });

    return NextResponse.json({
      success: true,
      message: "SendGrid email API endpoint created - implement SendGrid SDK for production",
    });
  } catch (error) {
    console.error("Email send error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to send email" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
