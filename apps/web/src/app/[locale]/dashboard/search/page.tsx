import { AccountSettings } from "@/components/account-settings";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { getUser } from "@v1/supabase/cached-queries";
import { Separator } from "@v1/ui/separator";
import { SidebarInset, SidebarProvider } from "@v1/ui/sidebar";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Search - CRE Finder AI",
  description: "Search for properties with AI",
};

export default async function Search() {
  const cachedUser = await getUser();

  if (!cachedUser?.data) {
    redirect("/login");
  }

  const user = cachedUser.data;

  return (
    <SidebarProvider>
      <AppSidebar user={user} variant="inset" />
      <SidebarInset>
        <SiteHeader title="Property Search" />
        <div className="space-y-6 p-6 pb-16"></div>
      </SidebarInset>
    </SidebarProvider>
  );
}
