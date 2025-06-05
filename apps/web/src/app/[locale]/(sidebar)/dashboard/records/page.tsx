import { PropertyRecords } from "@/components/property-records";
import { getPropertyRecordsBySearchLog } from "@v1/supabase/cached-queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Property Records - CRE Finder AI",
  description: "View your search history and manage exported property records",
};

export default async function RecordsPage() {
  const { data } = await getPropertyRecordsBySearchLog();

  return (
    <>
      <div className="p-4 sm:p-6 pb-16">
        <PropertyRecords data={data || []} />
      </div>
    </>
  );
}
