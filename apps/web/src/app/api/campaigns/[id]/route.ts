import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@v1/supabase/server";
import { updateCampaignSchema } from "@v1/supabase/validations/campaigns";
import { getUser } from "@v1/supabase/cached-queries";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const user = await getUser();
    
    if (!user?.data) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Get campaign with details
    const { data: campaign, error } = await supabase
      .from("campaigns")
      .select(`
        *,
        campaign_templates(*),
        campaign_results(
          *,
          property_records(
            id,
            address,
            city,
            state,
            zip_code,
            property_type,
            square_feet,
            price
          )
        )
      `)
      .eq("id", id)
      .eq("user_id", user.data.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
      }
      console.error("Error fetching campaign:", error);
      return NextResponse.json({ error: "Failed to fetch campaign" }, { status: 500 });
    }

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error("Campaign GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const user = await getUser();
    
    if (!user?.data) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    
    // Validate input
    const validatedData = updateCampaignSchema.parse({ id, ...body });

    // Check if campaign exists and belongs to user
    const { data: existingCampaign, error: checkError } = await supabase
      .from("campaigns")
      .select("id, status")
      .eq("id", id)
      .eq("user_id", user.data.id)
      .single();

    if (checkError || !existingCampaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Don't allow updates to active/completed campaigns
    if (["active", "completed"].includes(existingCampaign.status)) {
      return NextResponse.json({ error: "Cannot update active or completed campaigns" }, { status: 400 });
    }

    // Update campaign
    const { data: campaign, error } = await supabase
      .from("campaigns")
      .update({
        name: validatedData.name,
        description: validatedData.description,
        channels: validatedData.channels,
        record_ids: validatedData.record_ids,
        template_id: validatedData.template_id,
        scheduled_at: validatedData.scheduled_at?.toISOString(),
        campaign_type: validatedData.campaign_type,
        priority: validatedData.priority,
        settings: validatedData.settings,
        total_records: validatedData.record_ids ? validatedData.record_ids.length : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating campaign:", error);
      return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 });
    }

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error("Campaign PUT error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const user = await getUser();
    
    if (!user?.data) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Check if campaign exists and belongs to user
    const { data: existingCampaign, error: checkError } = await supabase
      .from("campaigns")
      .select("id, status")
      .eq("id", id)
      .eq("user_id", user.data.id)
      .single();

    if (checkError || !existingCampaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Don't allow deletion of active campaigns
    if (existingCampaign.status === "active") {
      return NextResponse.json({ error: "Cannot delete active campaigns" }, { status: 400 });
    }

    // Delete campaign (cascade will handle campaign_results)
    const { error } = await supabase
      .from("campaigns")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting campaign:", error);
      return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
    }

    return NextResponse.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    console.error("Campaign DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
