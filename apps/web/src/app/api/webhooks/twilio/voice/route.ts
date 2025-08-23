import { createClient } from "@v1/supabase/server";
import { NextResponse } from "next/server";

// Twilio webhook for voice call status updates
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const callStatus = formData.get("CallStatus") as string;
    const callSid = formData.get("CallSid") as string;
    const from = formData.get("From") as string;
    const to = formData.get("To") as string;
    const duration = formData.get("CallDuration") as string;

    console.log("📞 Twilio Voice webhook received:", {
      callStatus,
      callSid,
      from,
      to,
      duration,
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
    //   .from("campaign_calls")
    //   .update({
    //     status: callStatus,
    //     duration: parseInt(duration) || 0,
    //     updated_at: new Date().toISOString(),
    //   })
    //   .eq("external_id", callSid);

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Twilio Voice webhook error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
