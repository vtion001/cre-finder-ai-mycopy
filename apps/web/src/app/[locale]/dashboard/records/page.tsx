import { PropertyRecords } from "@/components/property-records";
import { QueryInput } from "@/components/query-input";
import { RecordsSummary } from "@/components/records-summary";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  getPropertyRecordsBySearchLog,
  getUser,
} from "@v1/supabase/cached-queries";
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

  const { data } = await getPropertyRecordsBySearchLog();

  return (
    <SidebarProvider>
      <AppSidebar user={user} variant="inset" />
      <SidebarInset>
        <SiteHeader title="Property Records" />
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 pb-16">
          <div className="space-y-4">
            <RecordsSummary data={data || []} />

            <QueryInput placeholder="Search by location, asset type, address, or owner..." />

            <PropertyRecords data={data || []} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
