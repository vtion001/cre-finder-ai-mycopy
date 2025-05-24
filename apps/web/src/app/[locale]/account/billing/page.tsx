import { CustomerPortalForm } from "@/components/customer-portal";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/site-header";

import { getSubscription, getUser } from "@v1/supabase/cached-queries";
import { SidebarInset, SidebarProvider } from "@v1/ui/sidebar";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Billing | Orben",
};

export default async function Page() {
  const user = await getUser();

  if (!user?.data) {
    redirect("/login");
  }

  const subscription = await getSubscription();

  return (
    <SidebarProvider>
      <AppSidebar user={user.data} variant="inset" />
      <SidebarInset>
        <SiteHeader title="Account Settings" />
        <div className="space-y-6 p-6 pb-16">
          <CustomerPortalForm subscription={subscription} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
