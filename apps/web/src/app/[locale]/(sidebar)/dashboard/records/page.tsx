import { PropertyRecords } from "@/components/property-records";
import { SearchHistoryDialog } from "@/components/search-history-dialog";
import { SiteHeader } from "@/components/site-header";
import {
  getPropertyRecordsBySearchLog,
  getRecentSearchActivity,
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
      <div className="p-4 sm:p-6 pb-16">
        <PropertyRecords data={data || []} />
      </div>
    </>
  );
}
