import { PreviewSearchInterface } from "@/components/preview-search-interface";
import { SiteHeader } from "@/components/site-header";
import {
  getAllLicenses,
  getAssetTypes,
  getUser,
  getUserLicensesByAssetType,
} from "@v1/supabase/cached-queries";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs";

export const metadata = {
  title: "Search - CRE Finder AI",
  description: "Find commercial real estate search",
};

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // DEVELOPMENT BYPASS: Set this to true to bypass authentication during development
  const DEV_BYPASS_AUTH = process.env.NODE_ENV === "development" && process.env.DEV_BYPASS_AUTH === "true";
  
  let cachedUser: any = null;
  let assetTypes: any[] = [];
  let licenses: any[] = [];
  let userLicenses: any[] = [];
  
  if (DEV_BYPASS_AUTH) {
    // Mock data for development - completely bypass all authentication
    console.log("Development mode: bypassing authentication");
    cachedUser = {
      data: {
        id: "dev-user-123",
        email: "dev@example.com",
        full_name: "Development User",
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    };
    
    assetTypes = [
      { slug: "residential", name: "Residential", description: "Residential properties" },
      { slug: "commercial", name: "Commercial", description: "Commercial properties" },
      { slug: "industrial", name: "Industrial", description: "Industrial properties" }
    ];
    
    licenses = [
      { asset_type_slug: "residential" },
      { asset_type_slug: "commercial" }
    ];
    
    userLicenses = [
      { asset_type_slug: "residential" },
      { asset_type_slug: "commercial" }
    ];
  } else {
    // Production mode - use real authentication
    cachedUser = await getUser();
    if (!cachedUser?.data) {
      redirect("/login");
    }
    
    const { data: assetTypesData } = await getAssetTypes();
    const { data: licensesData } = await getAllLicenses();
    const { data: userLicensesData } = await getUserLicensesByAssetType();
    
    assetTypes = assetTypesData || [];
    licenses = licensesData || [];
    userLicenses = userLicensesData || [];
  }

  const unusedAssetTypes = assetTypes?.filter((type) => {
    return !licenses?.some((license) => license.asset_type_slug === type.slug);
  });

  return (
    <>
      <SiteHeader
        className="md:hidden"
        title="New Search"
        user={cachedUser.data}
        licenses={userLicenses || []}
        showMobileDrawer={true}
      />
      <div className="h-[calc(100vh-3.5rem)] overflow-hidden p-4 pt-8">
        <PreviewSearchInterface assetTypes={unusedAssetTypes || []} />
      </div>
    </>
  );
}
