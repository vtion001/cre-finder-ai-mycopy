import { searchParamsCache } from "@/lib/nuqs/property-search-params";
import { getPropertyRecords } from "@v1/supabase/cached-queries";
import { ScrollArea, ScrollBar } from "@v1/ui/scroll-area";
import { Suspense } from "react";
import { DataTable } from "./data-table";
import { DataTablePagination } from "./data-table-pagination";

import { DownloadButton } from "@/components/download-button";
import { EmptyState, NoResults } from "./empty-states";
import { Loading } from "./loading";

type Props = {
  page: number;
  per_page: number;
  sort?: [string, "asc" | "desc"];
  query?: string | null;
  assetLicenseId: string;
  assetTypeName: string;
  locationCodes: string[];
};

export async function Table({
  assetLicenseId,
  assetTypeName,
  locationCodes,
  sort,
}: Props) {
  const {
    q: query,
    page,
    per_page,
    asset_type,
    locations,
    map,
  } = searchParamsCache.all();

  const hasFilters = locations.length > 1;

  // Convert 1-based page to 0-based for Supabase range
  const from = (page - 1) * per_page;
  const to = from + per_page - 1;

  const { data, meta } = await getPropertyRecords({
    assetLicenseId,
    locationCodes,
    from,
    to,
    sort,
    searchQuery: query,
  });

  if (!data?.length) {
    return hasFilters ? <NoResults /> : <EmptyState />;
  }

  const loadingKey = JSON.stringify({
    locations,
    page,
    per_page,
    sort,
    query,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        <ScrollArea hideScrollbar className="h-full rounded-md border">
          <Suspense fallback={<Loading />} key={loadingKey}>
            <DataTable data={data} />
          </Suspense>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="flex-shrink-0 flex flex-row items-center w-full">
        <DownloadButton assetTypeName={assetTypeName} data={data} />
        <DataTablePagination
          totalCount={meta.count || 0}
          currentPage={page}
          pageSize={per_page}
        />
      </div>
    </div>
  );
}
