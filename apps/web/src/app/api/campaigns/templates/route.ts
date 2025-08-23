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

    const { data: templates, error } = await supabase
      .from("campaign_templates")
      .select("*")
      .eq("user_id", user.data.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching campaign templates:", error);
      return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
    }

    return NextResponse.json({ templates: templates || [] });
  } catch (error) {
    console.error("Campaign templates GET error:", error);
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
    if (!body.name || !body.channel || !body.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data: template, error } = await supabase
      .from("campaign_templates")
      .insert({
        user_id: user.data.id,
        name: body.name,
        description: body.description,
        channel: body.channel,
        content: body.content,
        variables: body.variables || {},
        is_active: true
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error creating campaign template:", error);
      return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Campaign templates POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
