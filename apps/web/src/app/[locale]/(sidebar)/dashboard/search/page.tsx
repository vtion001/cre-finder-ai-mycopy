import { PreviewSearchInterface } from "@/components/preview-search-interface";
import { getAllLicenses, getAssetTypes } from "@v1/supabase/cached-queries";
import type { Metadata } from "next";
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
  const { data: assetTypes } = await getAssetTypes();
  const { data: licenses } = await getAllLicenses();

  const unusedAssetTypes = assetTypes?.filter((type) => {
    return !licenses?.some((license) => license.asset_type_slug === type.slug);
  });

  return (
    <div className="h-screen overflow-hidden p-4 pt-32 ">
      <PreviewSearchInterface assetTypes={unusedAssetTypes || []} />
    </div>
  );
}
