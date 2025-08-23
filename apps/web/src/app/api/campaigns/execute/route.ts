import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@v1/supabase/server";
import { campaignExecutionSchema } from "@v1/supabase/validations/campaigns";
import { getUser } from "@v1/supabase/cached-queries";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const user = await getUser();
    
    if (!user?.data) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = campaignExecutionSchema.parse(body);

    // Check if campaign exists and belongs to user
    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", validatedData.campaign_id)
      .eq("user_id", user.data.id)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Check if campaign is in a valid state for execution
    if (!["pending", "paused"].includes(campaign.status)) {
      return NextResponse.json({ error: "Campaign cannot be executed in current state" }, { status: 400 });
    }

    // Update campaign status to active
    const { error: updateError } = await supabase
      .from("campaigns")
      .update({ 
        status: "active",
        updated_at: new Date().toISOString()
      })
      .eq("id", validatedData.campaign_id);

    if (updateError) {
      console.error("Error updating campaign status:", updateError);
      return NextResponse.json({ error: "Failed to update campaign status" }, { status: 500 });
    }

    // Get campaign results that need to be processed
    const { data: campaignResults, error: resultsError } = await supabase
      .from("campaign_results")
      .select("*")
      .eq("campaign_id", validatedData.campaign_id)
      .eq("status", "pending");

    if (resultsError) {
      console.error("Error fetching campaign results:", resultsError);
      return NextResponse.json({ error: "Failed to fetch campaign results" }, { status: 500 });
    }

    // Process each channel
    const executionPromises = [];

    // Voice campaigns
    if (validatedData.channels.voice?.enabled && campaignResults) {
      const voiceResults = campaignResults.filter(result => result.channel === "voice");
      if (voiceResults.length > 0) {
        executionPromises.push(
          executeVoiceCampaign(voiceResults, validatedData.channels.voice!, campaign)
        );
      }
    }

    // SMS campaigns
    if (validatedData.channels.sms?.enabled && campaignResults) {
      const smsResults = campaignResults.filter(result => result.channel === "sms");
      if (smsResults.length > 0) {
        executionPromises.push(
          executeSMSCampaign(smsResults, validatedData.channels.sms!, campaign)
        );
      }
    }

    // Email campaigns
    if (validatedData.channels.email?.enabled && campaignResults) {
      const emailResults = campaignResults.filter(result => result.channel === "email");
      if (emailResults.length > 0) {
        executionPromises.push(
          executeEmailCampaign(emailResults, validatedData.channels.email!, campaign)
        );
      }
    }

    // Execute all campaigns in parallel
    try {
      await Promise.all(executionPromises);
    } catch (executionError) {
      console.error("Campaign execution error:", executionError);
      // Don't fail the request if execution fails - it will be retried
    }

    return NextResponse.json({ 
      message: "Campaign execution started",
      campaign_id: validatedData.campaign_id,
      total_records: campaignResults?.length || 0
    });

  } catch (error) {
    console.error("Campaign execution error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Voice campaign execution
async function executeVoiceCampaign(results: any[], settings: any, campaign: any) {
  // This will be implemented with VAPI integration
  console.log(`Executing voice campaign for ${results.length} records`);
  
  // Update results status to "sent"
  const supabase = createClient();
  const resultIds = results.map(r => r.id);
  
  await supabase
    .from("campaign_results")
    .update({ 
      status: "sent",
      sent_at: new Date().toISOString()
    })
    .in("id", resultIds);
}

// SMS campaign execution
async function executeSMSCampaign(results: any[], settings: any, campaign: any) {
  // This will be implemented with Twilio integration
  console.log(`Executing SMS campaign for ${results.length} records`);
  
  // Update results status to "sent"
  const supabase = createClient();
  const resultIds = results.map(r => r.id);
  
  await supabase
    .from("campaign_results")
    .update({ 
      status: "sent",
      sent_at: new Date().toISOString()
    })
    .in("id", resultIds);
}

// Email campaign execution
async function executeEmailCampaign(results: any[], settings: any, campaign: any) {
  // This will be implemented with SendGrid integration
  console.log(`Executing email campaign for ${results.length} records`);
  
  // Update results status to "sent"
  const supabase = createClient();
  const resultIds = results.map(r => r.id);
  
  await supabase
    .from("campaign_results")
    .update({ 
      status: "sent",
      sent_at: new Date().toISOString()
    })
    .in("id", resultIds);
}
