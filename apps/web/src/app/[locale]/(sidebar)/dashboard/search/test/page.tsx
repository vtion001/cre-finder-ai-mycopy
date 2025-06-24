import { PreviewSearchInterface } from "@/components/preview-search-interface";
import { SiteHeader } from "@/components/site-header";
import { TestSearchInterface } from "@/components/test-search-interface";
import {
  getAllLicenses,
  getAssetTypes,
  getUser,
  getUserLicensesByAssetType,
} from "@v1/supabase/cached-queries";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
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
  const cachedUser = await getUser();

  if (!cachedUser?.data) {
    redirect("/login");
  }

  const { data: assetTypes } = await getAssetTypes();
  const { data: licenses } = await getAllLicenses();
  const { data: userLicenses } = await getUserLicensesByAssetType();

  const unusedAssetTypes = assetTypes?.filter((type) => {
    return !licenses?.some((license) => license.asset_type_slug === type.slug);
  });

  return (
    <>
      <div className="text-xs bg-amber-200 text-black">
        This is a test page.
      </div>
      <SiteHeader
        className="md:hidden"
        title="New Search"
        user={cachedUser.data}
        licenses={userLicenses || []}
        showMobileDrawer={true}
      />
      <div className="min-h-[calc(100vh-3.5rem)] p-4 pt-8">
        <TestSearchInterface assetTypes={unusedAssetTypes || []} />
      </div>
    </>
  );
}
