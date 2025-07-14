import { getPropertyRecords } from "@v1/supabase/cached-queries";
import { ScrollArea, ScrollBar } from "@v1/ui/scroll-area";
import { searchParamsCache } from "@v1/utils/nuqs/property-search-params";
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
    params: filters,
  } = searchParamsCache.all();

  const hasFilters = locations.length === 0;

  // Convert 1-based page to 0-based for Supabase range
  const from = (page - 1) * per_page;
  const to = from + per_page - 1;

  const dataPromise = getPropertyRecords({
    assetLicenseId,
    locationCodes,
    from,
    to,
    sort,
    searchQuery: query,
    filters: filters || undefined,
  });

  const loadingKey = JSON.stringify({
    locations,
    page,
    per_page,
    sort,
    query,
    filters,
  });

  return (
    <div className="flex flex-col h-full">
      <Suspense fallback={<Loading />} key={loadingKey}>
        <DataTable
          dataPromise={dataPromise}
          hasFilters={hasFilters}
          assetTypeName={assetTypeName}
          assetLicenseId={assetLicenseId}
          locations={locationCodes}
        />
      </Suspense>
    </div>
  );
}
