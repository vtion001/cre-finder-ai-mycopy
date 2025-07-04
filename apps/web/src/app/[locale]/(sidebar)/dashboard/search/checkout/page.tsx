import { LicenseWarning } from "@/components/license-warning";
import { SearchLoading } from "@/components/search-loading";
import { SiteHeader } from "@/components/site-header";
import {
  getAssetTypeLicenses,
  getUser,
  getUserLicensesByAssetType,
} from "@v1/supabase/cached-queries";
import { searchParamsCache } from "@v1/utils/nuqs/property-search-params";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
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

  const { locations, asset_type } = searchParamsCache.parse(searchParams);

  if (!asset_type || !locations?.length) {
    return notFound();
  }

  const { data: userLicenses } = await getUserLicensesByAssetType();

  return (
    <>
      <SiteHeader
        className="md:hidden"
        title="Preview Search"
        user={cachedUser.data}
        licenses={userLicenses || []}
        showMobileDrawer={true}
      />
      <div className="p-3 sm:p-4 lg:p-6 pb-12 sm:pb-16 space-y-4 sm:space-y-6">
        <div className="relative overflow-hidden">
          <LicenseWarning />
          <SearchLoading isEmpty />
        </div>
      </div>
    </>
  );
}
