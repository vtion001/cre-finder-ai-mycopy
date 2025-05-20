import { CreditUsageDisplay } from "@/components/credit-usage/credit-usage-display";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { getUser, getUserCreditUsage } from "@v1/supabase/cached-queries";
import { getUserCreditUsageQuery } from "@v1/supabase/queries";
import { createClient } from "@v1/supabase/server";
import { Separator } from "@v1/ui/separator";
import { SidebarInset, SidebarProvider } from "@v1/ui/sidebar";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Credit Usage - CRE Finder AI",
  description: "View your search credit usage and limits.",
};

export default async function CreditsPage() {
  const user = await getUser();

  if (!user?.data) {
    redirect("/login");
  }

  const supabase = createClient();

  const { data } = await getUserCreditUsageQuery(supabase, user.data.id);

  return (
    <SidebarProvider>
      <AppSidebar user={user.data} variant="inset" />
      <SidebarInset>
        <SiteHeader title="Property Search" />
        <div className="space-y-6 p-6 pb-16">
          <div className="mx-auto flex w-full flex-col space-y-6">
            <div className="flex flex-col space-y-1">
              <p className="text-muted-foreground">
                View your search credit usage and limits for the current billing
                period.
              </p>
            </div>
            <Separator />
            <div className="grid gap-6">
              <CreditUsageDisplay data={data} />
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">About Credits</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Credits are consumed when you complete a property search. Each
                  completed search uses one credit. Your credit limit is based
                  on your subscription plan and resets at the beginning of each
                  billing period.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
