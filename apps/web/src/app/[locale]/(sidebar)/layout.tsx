import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  getUser,
  getUserLicensesByAssetType,
} from "@v1/supabase/cached-queries";
import { createClient } from "@v1/supabase/server";
import { SidebarInset, SidebarProvider } from "@v1/ui/sidebar";
import { CampaignDialog } from "@/components/campaign-dialog";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use real authentication instead of mock data
  const cachedUser = await getUser();
  if (!cachedUser?.data) {
    redirect("/login");
  }
  
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const { data: licenses } = await getUserLicensesByAssetType();

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar
        user={cachedUser?.data}
        licenses={licenses || []}
        variant="sidebar"
      />
      <SidebarInset>
        {children}
        {/* Global dialog portal */}
        <CampaignDialog />
      </SidebarInset>
    </SidebarProvider>
  );
}
