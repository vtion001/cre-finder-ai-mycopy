import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@v1/supabase/server";
import { getUser } from "@v1/supabase/cached-queries";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const user = await getUser();
    
    if (!user?.data) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("campaign_id");
    const status = searchParams.get("status");
    const channel = searchParams.get("channel");

    let query = supabase
      .from("campaign_results")
      .select(`
        *,
        campaigns(name, description),
        property_records(address, city, state, zip_code)
      `)
      .eq("user_id", user.data.id);

    if (campaignId) {
      query = query.eq("campaign_id", campaignId);
    }
    if (status) {
      query = query.eq("status", status);
    }
    if (channel) {
      query = query.eq("channel", channel);
    }

    query = query.order("created_at", { ascending: false });

    const { data: results, error } = await query;

    if (error) {
      console.error("Error fetching campaign results:", error);
      return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
    }

    return NextResponse.json({ results: results || [] });
  } catch (error) {
    console.error("Campaign results GET error:", error);
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
    
    // Basic validation
    if (!body.campaign_id || !body.record_id || !body.channel) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data: result, error } = await supabase
      .from("campaign_results")
      .insert({
        user_id: user.data.id,
        campaign_id: body.campaign_id,
        record_id: body.record_id,
        channel: body.channel,
        status: "pending",
        sent_at: null,
        delivered_at: null,
        responded_at: null,
        metadata: body.metadata || {}
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error creating campaign result:", error);
      return NextResponse.json({ error: "Failed to create result" }, { status: 500 });
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Campaign results POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
