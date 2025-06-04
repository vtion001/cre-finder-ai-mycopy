import { PropertyRecords } from "@/components/property-records";
import { QueryInput } from "@/components/query-input";
import { RecordsSummary } from "@/components/records-summary";
import { SearchHistoryDialog } from "@/components/search-history-dialog";
import { SiteHeader } from "@/components/site-header";
import {
  getPropertyRecordsBySearchLog,
  getRecentSearchActivity,
  getUser,
} from "@v1/supabase/cached-queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Property Records - CRE Finder AI",
  description: "View your search history and manage exported property records",
};

export default async function RecordsPage() {
  const { data } = await getPropertyRecordsBySearchLog();
  const { data: recentActivity } = await getRecentSearchActivity();

  return (
    <>
      <SiteHeader title="Property Records">
        {/* @ts-expect-error  */}
        <SearchHistoryDialog searchLogs={recentActivity || []} />
      </SiteHeader>
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 pb-16">
        <div className="space-y-4">
          <RecordsSummary data={data || []} />

          <QueryInput placeholder="Search by location, asset type, address, or owner..." />

          <PropertyRecords data={data || []} />
        </div>
      </div>
    </>
  );
}
