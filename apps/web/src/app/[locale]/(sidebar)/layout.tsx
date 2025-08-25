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
  // DEVELOPMENT BYPASS: Set this to true to bypass authentication during development
  const DEV_BYPASS_AUTH = process.env.NODE_ENV === "development" && process.env.DEV_BYPASS_AUTH === "true";
  
  let cachedUser: any = null;
  let licenses: any[] = [];
  
  if (!DEV_BYPASS_AUTH) {
    // Use real authentication instead of mock data
    cachedUser = await getUser();
    if (!cachedUser?.data) {
      redirect("/login");
    }
    
    const { data: licensesData } = await getUserLicensesByAssetType();
    licenses = licensesData || [];
  } else {
    // Mock user data for development
    cachedUser = {
      data: {
        id: "dev-user-123",
        email: "dev@example.com",
        full_name: "Development User",
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    };
    
    // Mock licenses for development
    licenses = [
      {
        id: "dev-license-1",
        asset_type_slug: "residential",
        user_id: "dev-user-123",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "dev-license-2",
        asset_type_slug: "commercial",
        user_id: "dev-user-123",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }
  
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar
        user={cachedUser?.data}
        licenses={licenses}
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
