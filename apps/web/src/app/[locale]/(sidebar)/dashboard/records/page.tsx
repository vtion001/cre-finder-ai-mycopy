import { ErrorBoundary } from "@/components/error-boundary";
import { PropertyMapServer } from "@/components/property-map.server";
import { PropertySearchFilters } from "@/components/property-search-filters";
import { Table } from "@/components/tables/records";
import { Loading } from "@/components/tables/records/loading";
import { searchParamsCache } from "@/lib/nuqs/property-search-params";
import type { GetPropertySearchParams } from "@v1/property-data/types";
import { getAssetTypeLicenses } from "@v1/supabase/cached-queries";
import { createClient } from "@v1/supabase/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Records - CRE Finder AI",
  description: "Find commercial real estate properties with AI-powered search",
};

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const {
    q: query,
    page,
    per_page,
    asset_type,
    locations,
    map,
  } = searchParamsCache.parse(searchParams);

  if (!asset_type) {
    return notFound();
  }

  const { data: licenses } = await getAssetTypeLicenses(asset_type);

  const supabase = createClient();

  const { data: assetLicense } = await supabase
    .from("asset_licenses")
    .select("*, asset_types!inner(*)")
    .eq("asset_type_slug", asset_type)
    .eq("is_active", true)
    .single();

  if (!licenses.length || !assetLicense) {
    return notFound();
  }

  const availableLocations = licenses.map(
    (license) => license.location_internal_id,
  );

  const validLocations = locations?.every((loc) =>
    availableLocations.includes(loc),
  );

  if (!validLocations) {
    return notFound();
  }

  const sort = searchParams?.sort?.toString().split(":") as [
    string,
    "desc" | "asc",
  ];

  return (
    <div className="p-4 space-y-6 ">
      <ErrorBoundary>
        <PropertySearchFilters
          licenses={licenses || []}
          assetType={asset_type}
          assetTypeName={assetLicense.asset_types.name}
          searchParams={
            assetLicense.search_params as unknown as GetPropertySearchParams
          }
        />
      </ErrorBoundary>

      <div
        className={`grid gap-6 ${map ? "lg:grid-cols-[1fr,480px]" : "grid-cols-1"}`}
      >
        <div className="h-[calc(100vh-7rem)] w-full overflow-hidden">
          <Table
            assetTypeName={assetLicense.asset_types.name}
            assetLicenseId={assetLicense.id}
            locationCodes={locations || []}
            sort={sort}
            page={page}
            per_page={per_page}
            query={query}
          />
        </div>

        <PropertyMapServer
          assetLicenseId={assetLicense.id}
          locationCodes={locations || []}
        />
      </div>
    </div>
  );
}
