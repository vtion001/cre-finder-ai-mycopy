import { LicenseWarning } from "@/components/license-warning";
import { PreviewSearchInterface } from "@/components/preview-search-interface";
import { PropertySearchFilters } from "@/components/property-search-filters";
import { SearchLoading } from "@/components/search-loading";
import { searchParamsCache } from "@/lib/nuqs/property-search-params";
import { getAssetTypes } from "@v1/supabase/cached-queries";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search - CRE Finder AI",
  description: "Find commercial real estate properties with AI-powered search",
};

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { data: assetTypes } = await getAssetTypes();

  if (!assetTypes) {
    return <div>Loading...</div>;
  }

  const { locations, asset_type } = searchParamsCache.parse(searchParams);

  if (asset_type && locations.length > 0) {
    return (
      <div className="p-4 sm:p-6 pb-16 space-y-6">
        <PropertySearchFilters assetTypes={assetTypes} />

        <div className="relative overflow-hidden ">
          <LicenseWarning />
          <SearchLoading isEmpty />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pt-16">
      <PreviewSearchInterface assetTypes={assetTypes} combos={[]} />
    </div>
  );
}
