import { createClient } from "@v1/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const callSchema = z.object({
  phoneNumber: z.string().min(1),
  type: z.enum(["call", "voicemail"]),
  message: z.string().min(1),
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
    const { phoneNumber, type, message } = callSchema.parse(body);

    // Get VAPI configuration
    const { data: config } = await supabase
      .from("integration_configs")
      .select("config")
      .eq("user_id", user.id)
      .eq("provider", "vapi")
      .single();

    if (!config?.config) {
      return new NextResponse(
        JSON.stringify({ error: "VAPI integration not configured" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const vapiConfig = config.config as any;

    // Get user's VAPI assistant configuration
    const { data: assistant } = await supabase
      .from("vapi_assistants")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single();

    // In development, just log the call instead of actually making it
    if (process.env.NODE_ENV === "development") {
      console.log("📞 VAPI call would be made:", {
        phoneNumber,
        type,
        message,
        assistantId: assistant?.vapi_assistant_id || vapiConfig.assistantId,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        callId: `call_dev_${Date.now()}`,
        status: type === "voicemail" ? "voicemail_left" : "completed",
        dev_mode: true,
      });
    }

    // For production, implement actual VAPI SDK call
    // const { Vapi } = require('@vapi-ai/server-sdk');
    // const vapi = new Vapi(vapiConfig.apiKey);
    //
    // const call = await vapi.calls.create({
    //   phoneNumber,
    //   assistantId: assistant?.vapi_assistant_id || vapiConfig.assistantId,
    //   type,
    //   systemMessage: message,
    // });
    //
    // return NextResponse.json({
    //   success: true,
    //   callId: call.id,
    //   status: call.status,
    // });

    return NextResponse.json({
      success: true,
      message: "VAPI call API endpoint created - implement VAPI SDK for production",
    });
  } catch (error) {
    console.error("VAPI call error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to make VAPI call" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
