import { LicenseWarning } from "@/components/license-warning";
import { SearchLoading } from "@/components/search-loading";
import { SiteHeader } from "@/components/site-header";
import { searchParamsCache } from "@/lib/nuqs/property-search-params";
import {
  getAssetTypeLicenses,
  getUser,
  getUserLicensesByAssetType,
} from "@v1/supabase/cached-queries";
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

  const { meta } = await getAssetTypeLicenses(asset_type);
  const { data: userLicenses } = await getUserLicensesByAssetType();

  const licensedLocations = meta?.locations;

  const ids = licensedLocations?.map((loc) => loc.location_internal_id) || [];
  const unlicensedLocations = locations.filter((loc) => !ids.includes(loc));

  return (
    <>
      <SiteHeader
        title="License Checkout"
        user={cachedUser.data}
        licenses={userLicenses || []}
        showMobileDrawer={true}
      />
      <div className="p-3 sm:p-4 lg:p-6 pb-12 sm:pb-16 space-y-4 sm:space-y-6">
        {/* Only show warning if there are unlicensed locations */}
        {unlicensedLocations.length > 0 ? (
          <div className="relative overflow-hidden">
            <LicenseWarning unlicensed={unlicensedLocations} />
            <SearchLoading isEmpty />
          </div>
        ) : null}
      </div>
    </>
  );
}
