import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54323";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "anon-key";

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { count, error } = await supabase
      .from("vapi_configs")
      .select("*", { count: "exact", head: true });

    if (error) {
      throw new Error(`Supabase connection failed: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      details: {
        supabase: "Connected",
        vapiConfigsCount: count ?? 0,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}


