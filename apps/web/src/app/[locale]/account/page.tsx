import { AccountSettings } from "@/components/account-settings";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { getUser } from "@v1/supabase/cached-queries";
import { Separator } from "@v1/ui/separator";
import { SidebarInset, SidebarProvider } from "@v1/ui/sidebar";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Account Settings - CRE Finder AI",
  description: "Manage your account settings and preferences.",
};

export default async function Account() {
  const cachedUser = await getUser();

  if (!cachedUser?.data) {
    redirect("/login");
  }

  const user = cachedUser.data;

  const hasCompletedOnboarding =
    user.subscription_plan_id && user.selected_asset_type_id;

  if (!hasCompletedOnboarding) {
    redirect("/onboarding");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} variant="inset" />
      <SidebarInset>
        <SiteHeader title="Account Settings" />
        <div className="space-y-6 p-6 pb-16">
          <div>
            <p className="text-muted-foreground">
              Manage your account settings and set your email preferences.
            </p>
          </div>
          <Separator />
          <AccountSettings user={user} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
