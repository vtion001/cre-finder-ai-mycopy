import { createClient } from "@v1/supabase/server";
import { NextResponse } from "next/server";

// Twilio webhook for SMS status updates
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const messageStatus = formData.get("MessageStatus") as string;
    const messageSid = formData.get("MessageSid") as string;
    const from = formData.get("From") as string;
    const to = formData.get("To") as string;
    const body = formData.get("Body") as string;

    console.log("📱 Twilio SMS webhook received:", {
      messageStatus,
      messageSid,
      from,
      to,
      body,
      timestamp: new Date().toISOString(),
    });

    // In development, just log the webhook
    if (process.env.NODE_ENV === "development") {
      return new NextResponse("OK", { status: 200 });
    }

    // For production, you might want to:
    // 1. Verify the webhook signature
    // 2. Update campaign status in database
    // 3. Send notifications to user

    const supabase = createClient();
    
    // Update campaign status if needed
    // const { error } = await supabase
    //   .from("campaign_messages")
    //   .update({
    //     status: messageStatus,
    //     updated_at: new Date().toISOString(),
    //   })
    //   .eq("external_id", messageSid);

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Twilio SMS webhook error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
