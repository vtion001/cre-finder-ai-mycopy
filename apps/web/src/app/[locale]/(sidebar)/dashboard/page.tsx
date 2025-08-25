import { getUser } from "@v1/supabase/cached-queries";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard - CRE Finder AI",
};

export default async function Dashboard() {
  // DEVELOPMENT BYPASS: Set this to true to bypass authentication during development
  const DEV_BYPASS_AUTH = process.env.NODE_ENV === "development" && process.env.DEV_BYPASS_AUTH === "true";
  
  if (!DEV_BYPASS_AUTH) {
    const cachedUser = await getUser();
    if (!cachedUser?.data) {
      redirect("/login");
    }
  }

  return redirect("/dashboard/search");
}
