import { PropertyMap } from "@/components/property-map";
import { PropertySearchFilters } from "@/components/property-search-filters";
import { searchParamsCache } from "@/lib/nuqs/property-search-params";
import type { GetPropertySearchParams } from "@v1/property-data/types";
import {
  getAssetType,
  getAssetTypeLicenses,
  getPropertyRecords,
} from "@v1/supabase/cached-queries";
import { createClient } from "@v1/supabase/server";
import { ScrollArea, ScrollBar } from "@v1/ui/scroll-area";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
  const { asset_type, locations, map } = searchParamsCache.parse(searchParams);

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

  const { data: records } = await getPropertyRecords(assetLicense.id);

  return (
    <div className="p-4 sm:p-6 pb-16 space-y-6 h-screen overflow-hidden">
      <PropertySearchFilters
        licenses={licenses || []}
        assetType={asset_type}
        assetTypeName={assetLicense.asset_types.name}
        searchParams={
          assetLicense.search_params as unknown as GetPropertySearchParams
        }
      />

      <div
        className={`overflow-hidden grid gap-6 ${map ? "lg:grid-cols-[1fr,480px]" : "grid-cols-1"}`}
      >
        <div className="min-w-0">
          <ScrollArea
            hideScrollbar
            className="h-[calc(100vh-7rem)] w-full rounded-md border overflow-y-hidden"
          >
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {map && (
          <div className="lg:sticky lg:top-6 lg:h-fit">
            <PropertyMap records={[]} className="h-[calc(100vh-7rem)]" />
          </div>
        )}
      </div>
    </div>
  );
}
