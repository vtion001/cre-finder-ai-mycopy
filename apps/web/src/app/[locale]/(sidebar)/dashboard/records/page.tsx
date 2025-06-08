import { PropertySearchFilters } from "@/components/property-search-filters";
import { searchParamsCache } from "@/lib/nuqs/property-search-params";
import { getAssetTypeLicenses } from "@v1/supabase/cached-queries";
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
  const { asset_type } = searchParamsCache.parse(searchParams);

  if (!asset_type) {
    return notFound();
  }

  const { data: licenses } = await getAssetTypeLicenses(asset_type);

  return (
    <div className="p-4 sm:p-6 pb-16 space-y-6">
      <PropertySearchFilters licenses={licenses || []} />
    </div>
  );
}
