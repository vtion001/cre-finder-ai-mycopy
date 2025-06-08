import { LicenseWarning } from "@/components/license-warning";
import { PreviewSearchInterface } from "@/components/preview-search-interface";
import { SearchLoading } from "@/components/search-loading";
import { searchParamsCache } from "@/lib/nuqs/property-search-params";
import {
  getAssetTypes,
  getUserLicenses,
  getUserLicensesByAssetType,
} from "@v1/supabase/cached-queries";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { SearchParams } from "nuqs";

export const metadata: Metadata = {
  title: "Search - CRE Finder AI",
  description: "Find commercial real estate properties with AI-powered search",
};

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { locations, asset_type } = searchParamsCache.parse(searchParams);

  if (!asset_type || !locations?.length) {
    return notFound();
  }

  const { data: licensedLocations } = await getUserLicenses(asset_type);

  const ids = licensedLocations?.map((loc) => loc.location_internal_id) || [];
  const unlicensedLocations = locations.filter((loc) => !ids.includes(loc));

  return (
    <div className="p-4 sm:p-6 pb-16 space-y-6">
      {/* Only show warning if there are unlicensed locations */}
      {unlicensedLocations.length > 0 ? (
        <div className="relative overflow-hidden ">
          <LicenseWarning unlicensed={unlicensedLocations} />
          <SearchLoading isEmpty />
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            All selected locations are licensed. Search functionality would
            continue here.
          </p>
        </div>
      )}
    </div>
  );
}
