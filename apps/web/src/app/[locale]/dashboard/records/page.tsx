import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { PropertyRecordsTable } from "@/components/tables/property-records-table";
import { getUser } from "@v1/supabase/cached-queries";
import { getPropertyRecordsQuery } from "@v1/supabase/queries";
import { createClient } from "@v1/supabase/server";
import { SidebarInset, SidebarProvider } from "@v1/ui/sidebar";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Record Managament - CRE Finder AI",
  description: "View and manage your property records",
};

export default async function RecordsPage() {
  const cachedUser = await getUser();

  const user = cachedUser?.data;

  if (!user) {
    redirect("/login");
  }

  const supabase = createClient();

  const { data: records } = await getPropertyRecordsQuery(supabase, user.id);

  return (
    <SidebarProvider>
      <AppSidebar user={user} variant="inset" />
      <SidebarInset>
        <SiteHeader title="Property Records" />
        <div className="space-y-6 p-6 pb-16">
          <PropertyRecordsTable records={records || []} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
