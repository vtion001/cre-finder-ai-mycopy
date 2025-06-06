import { getUser } from "@v1/supabase/cached-queries";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard - CRE Finder AI",
};

export default async function Dashboard() {
  const cachedUser = await getUser();

  if (!cachedUser?.data) {
    redirect("/login");
  }

  return redirect("/dashboard/search");
}
