import { NextResponse } from "next/server";
import { createClient } from "@v1/supabase/server";
import { createIntegrationManager } from "@v1/supabase/lib/integrations";

/**
 * TEMPORARY: Sets up VAPI and Twilio configs for the authenticated user using provided credentials.
 * IMPORTANT: Remove this endpoint after development setup.
 */
export async function POST() {
  try {
    const supabase = createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Attempt to get user's organization string; fallback to user ID as organization key
    const { data: userRow } = await supabase
      .from("users")
      .select("organization")
      .eq("id", user.id)
      .single();

    const organization: string = (userRow as any)?.organization || user.id;

    const integrationManager = createIntegrationManager(user.id, supabase);

    // Provided credentials (DEV ONLY)
    const vapiApiKey = "4d8569e3-2b82-4a7d-b000-fdb79dcddb2c";
    const vapiAssistantId = "ed68dbc7-19bd-4bab-852a-17fa11e9aa97";

    const twilioAccountSid = "AC3b1d6c487a62adb87700610e597e76db";
    const twilioAuthToken = "b5f3c1e4d56281fb4de1f0c9480dd68e";
    const twilioPhoneNumber = "+19787081782";

    // Save VAPI configuration
    // Note: vapi_configs requires organization and phone_number; use Twilio phone or a placeholder if needed
    const vapiResult = await integrationManager.saveVapiConfig({
      apiKey: vapiApiKey,
      assistantId: vapiAssistantId,
      organization,
      phoneNumber: twilioPhoneNumber,
      webhookUrl: "",
      customPrompt: "",
    });

    if (!vapiResult.success) {
      return NextResponse.json(
        { error: vapiResult.error || "Failed to set up VAPI configuration" },
        { status: 500 },
      );
    }

    // Save Twilio configuration (encrypted at rest by IntegrationManager)
    const twilioResult = await integrationManager.saveTwilioConfig({
      accountSid: twilioAccountSid,
      authToken: twilioAuthToken,
      phoneNumber: twilioPhoneNumber,
      messagingServiceSid: undefined,
      webhookUrl: "",
      customMessage: "",
    });

    if (!twilioResult.success) {
      return NextResponse.json(
        { error: twilioResult.error || "Failed to set up Twilio configuration" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Integrations set up successfully",
      vapiConfigId: vapiResult.configId,
      twilioConfigId: twilioResult.configId,
    });
  } catch (error) {
    console.error("Setup integrations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


