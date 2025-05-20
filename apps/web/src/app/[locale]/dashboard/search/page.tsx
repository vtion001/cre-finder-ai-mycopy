import { PropertySearchInterface } from "@/components/property-search-interface";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  getUser,
  getUserAssetTypes,
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
  const searchId = searchParams?.id;

  const cachedUser = await getUser();

  const user = cachedUser?.data;

  if (!user) {
    redirect("/login");
  }

  const { data: locations } = await getUserLocations();
  const { data: assetTypes } = await getUserAssetTypes();

  if (!assetTypes?.length || !locations?.length) {
    redirect("/onboarding");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} variant="inset" />
      <SidebarInset>
        <SiteHeader title="Property Search" />
        <div className="space-y-6 p-6 pb-16">
          <PropertySearchInterface
            assetTypes={assetTypes ?? []}
            savedLocations={locations ?? []}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
