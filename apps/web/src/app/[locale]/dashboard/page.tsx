import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  getUser,
  getUserAssetTypes,
  getUserLocations,
} from "@v1/supabase/cached-queries";
import { SidebarInset, SidebarProvider } from "@v1/ui/sidebar";
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

  const user = cachedUser.data;

  const [{ data: assetTypes }, { data: locations }] = await Promise.all([
    getUserAssetTypes(),
    getUserLocations(),
  ]);

  const hasCompletedOnboarding = assetTypes?.length && locations?.length;

  if (!hasCompletedOnboarding) {
    redirect("/onboarding");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} variant="inset" />
      <SidebarInset>
        <SiteHeader title="Dashboard" />
        <div className="space-y-6 p-6 pb-16">{/* TODO */}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
