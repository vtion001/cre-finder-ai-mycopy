import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@v1/supabase/server";
import { createCampaignSchema, campaignFilterSchema } from "@v1/supabase/validations/campaigns";
import { getUser } from "@v1/supabase/cached-queries";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const user = await getUser();
    
    if (!user?.data) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filters = {
      status: searchParams.get("status"),
      campaign_type: searchParams.get("campaign_type"),
      priority: searchParams.get("priority"),
      channel: searchParams.get("channel"),
      date_from: searchParams.get("date_from"),
      date_to: searchParams.get("date_to"),
      search: searchParams.get("search"),
    };

    // Validate filters
    const validatedFilters = campaignFilterSchema.parse(filters);

    // Build query
    let query = supabase
      .from("campaigns")
      .select(`
        *,
        campaign_templates(name, channel),
        campaign_results(count)
      `)
      .eq("user_id", user.data.id)
      .order("created_at", { ascending: false });

    // Apply filters
    if (validatedFilters.status) {
      query = query.eq("status", validatedFilters.status);
    }
    if (validatedFilters.campaign_type) {
      query = query.eq("campaign_type", validatedFilters.campaign_type);
    }
    if (validatedFilters.priority) {
      query = query.eq("priority", validatedFilters.priority);
    }
    if (validatedFilters.channel) {
      query = query.contains("channels", { [validatedFilters.channel]: { enabled: true } });
    }
    if (validatedFilters.date_from) {
      query = query.gte("created_at", validatedFilters.date_from);
    }
    if (validatedFilters.date_to) {
      query = query.lte("created_at", validatedFilters.date_to);
    }
    if (validatedFilters.search) {
      query = query.or(`name.ilike.%${validatedFilters.search}%,description.ilike.%${validatedFilters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching campaigns:", error);
      return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
    }

    return NextResponse.json({ campaigns: data || [] });
  } catch (error) {
    console.error("Campaigns GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const user = await getUser();
    
    if (!user?.data) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = createCampaignSchema.parse(body);

    // Create campaign
    const { data: campaign, error } = await supabase
      .from("campaigns")
      .insert({
        user_id: user.data.id,
        name: validatedData.name,
        description: validatedData.description,
        channels: validatedData.channels,
        record_ids: validatedData.record_ids,
        template_id: validatedData.template_id,
        scheduled_at: validatedData.scheduled_at?.toISOString(),
        campaign_type: validatedData.campaign_type,
        priority: validatedData.priority,
        settings: validatedData.settings,
        total_records: validatedData.record_ids.length,
        status: validatedData.scheduled_at ? "pending" : "active",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating campaign:", error);
      return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
    }

    // Create campaign results for each record
    const campaignResults = validatedData.record_ids.map(recordId => ({
      campaign_id: campaign.id,
      record_id: recordId,
      channel: Object.keys(validatedData.channels).find(key => 
        validatedData.channels[key as keyof typeof validatedData.channels]?.enabled
      ) as "voice" | "sms" | "email",
      status: "pending",
      retry_count: 0,
      max_retries: 3,
    }));

    if (campaignResults.length > 0) {
      const { error: resultsError } = await supabase
        .from("campaign_results")
        .insert(campaignResults);

      if (resultsError) {
        console.error("Error creating campaign results:", resultsError);
        // Campaign was created but results failed - this is not critical
      }
    }

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error("Campaigns POST error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
