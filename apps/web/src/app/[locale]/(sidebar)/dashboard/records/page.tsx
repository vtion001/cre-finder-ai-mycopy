import { ErrorBoundary } from "@/components/error-boundary";
import { PropertyMapServer } from "@/components/property-map.server";
import { PropertySearchFilters } from "@/components/property-search-filters";
import { SiteHeader } from "@/components/site-header";
import { Table } from "@/components/tables/records";
import { searchParamsCache } from "@/lib/nuqs/property-search-params";
import type { GetPropertySearchParams } from "@v1/property-data/types";
import {
  getAssetTypeLicenses,
  getUser,
  getUserLicensesByAssetType,
} from "@v1/supabase/cached-queries";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { SearchParams } from "nuqs";

export const metadata: Metadata = {
  title: "Records - CRE Finder AI",
  description: "Find commercial real estate properties with AI-powered search",
};

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const cachedUser = await getUser();

  if (!cachedUser?.data) {
    redirect("/login");
  }

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

  const { data, meta } = await getAssetTypeLicenses(asset_type);
  const { data: userLicenses } = await getUserLicensesByAssetType();

  if (!data || !meta.assetType || !meta.locations) {
    return notFound();
  }

  const availableLocations = meta.locations.map(
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
    <>
      <SiteHeader
        className="md:hidden"
        title={`${meta.assetType.name} Records`}
        user={cachedUser.data}
        licenses={userLicenses || []}
        showMobileDrawer={true}
      />
      <div className="p-4 space-y-6">
        <ErrorBoundary>
          <PropertySearchFilters
            licenses={meta.locations || []}
            assetType={asset_type}
            assetTypeName={meta.assetType.name}
            searchParams={
              data.search_params as unknown as GetPropertySearchParams
            }
          />
        </ErrorBoundary>

        <div
          className={`grid gap-6 ${map ? "lg:grid-cols-[1fr,480px]" : "grid-cols-1"}`}
        >
          <div className="h-[calc(100vh-10.5rem)] w-full overflow-hidden">
            <Table
              assetTypeName={meta.assetType.name}
              assetLicenseId={data.id}
              locationCodes={locations || []}
              sort={sort}
              page={page}
              per_page={per_page}
              query={query}
            />
          </div>

          <PropertyMapServer
            assetLicenseId={data.id}
            locationCodes={locations || []}
          />
        </div>
      </div>
    </>
  );
}
