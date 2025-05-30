import { PropertySearchInterface } from "@/components/property-search-interface";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  getSearchLog,
  getUser,
  getUserAssetTypes,
  getUserCreditUsage,
  getUserLocations,
} from "@v1/supabase/cached-queries";
import { SidebarInset, SidebarProvider } from "@v1/ui/sidebar";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Search - CRE Finder AI",
  description: "Search for properties with AI",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const searchId = searchParams?.id?.toString();

  const cachedUser = await getUser();

  const user = cachedUser?.data;

  if (!user) {
    redirect("/login");
  }

  const { data: log } = searchId
    ? await getSearchLog(searchId)
    : { data: null };

  const formValues = log
    ? {
        location_id: log.location_id,
        asset_type_id: log.asset_type_id,
        ...(log.search_parameters as unknown as object),
      }
    : undefined;

  const { data: locations } = await getUserLocations();
  const { data: assetTypes } = await getUserAssetTypes();
  const { data: creditData } = await getUserCreditUsage();

  if (!assetTypes?.length || !locations?.length) {
    redirect("/onboarding");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} variant="inset" />
      <SidebarInset>
        <SiteHeader title="Property Search" />
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 pb-16">
          <PropertySearchInterface
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            initialValues={formValues as any}
            assetTypes={assetTypes ?? []}
            savedLocations={locations ?? []}
            creditData={creditData}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
