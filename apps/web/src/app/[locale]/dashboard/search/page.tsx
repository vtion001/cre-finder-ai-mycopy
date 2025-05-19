import { PropertySearchInterface } from "@/components/property-search-interface";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { getUser } from "@v1/supabase/cached-queries";
import { getUserAssetTypesQuery } from "@v1/supabase/queries";
import { createClient } from "@v1/supabase/server";
import { SidebarInset, SidebarProvider } from "@v1/ui/sidebar";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Search - CRE Finder AI",
  description: "Search for properties with AI",
};

export default async function Search() {
  const cachedUser = await getUser();

  const user = cachedUser?.data;

  if (!user) {
    redirect("/login");
  }

  // Fetch user's saved locations
  const supabase = createClient();

  const { data: selectedLocations } = await supabase
    .from("user_locations")
    .select("*")
    .eq("user_id", user.id);

  // Fetch user's selected asset types
  const { data: selectedAssetTypes } = await getUserAssetTypesQuery(
    supabase,
    user.id,
  );

  if (
    !selectedAssetTypes ||
    selectedAssetTypes.length === 0 ||
    !selectedLocations?.length
  ) {
    redirect("/onboarding");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} variant="inset" />
      <SidebarInset>
        <SiteHeader title="Property Search" />
        <div className="space-y-6 p-6 pb-16">
          <PropertySearchInterface
            assetTypes={selectedAssetTypes ?? []}
            savedLocations={selectedLocations ?? []}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
