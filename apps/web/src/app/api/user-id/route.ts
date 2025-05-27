import { getUser } from "@v1/supabase/cached-queries";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getUser();

    if (!user?.data) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ userId: user.data.id });
  } catch (error) {
    console.error("Error getting user ID:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
