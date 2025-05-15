import type { realEstateLocationSchema } from "@/actions/schema";
import { PropertySearchInterface } from "@/components/property-search-interface";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { getUser } from "@v1/supabase/cached-queries";
import { createClient } from "@v1/supabase/client";
import { SidebarInset, SidebarProvider } from "@v1/ui/sidebar";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { z } from "zod";

export const metadata: Metadata = {
  title: "Search - CRE Finder AI",
  description: "Search for properties with AI",
};

type Location = z.infer<typeof realEstateLocationSchema>;

export default async function Search() {
  const cachedUser = await getUser();

  if (!cachedUser?.data) {
    redirect("/login");
  }

  const user = cachedUser.data;

  // Fetch user's saved locations
  const supabase = createClient();
  const { data: userCitiesData, error } = await supabase
    .from("user_cities")
    .select("*")
    .eq("user_id", user.id)
    .order("city_name");

  if (error) {
    console.error("Error fetching user locations:", error);
  }

  const mockLocations = [
    {
      id: "ChIJOwg_06VPwokRYv534QaPC8g",
      name: "New York",
      state_code: "NY",
      type: "city",
      full_name: "New York, NY",
    },
    {
      id: "ChIJE9on3F3HwoAR9AhGJW_fL-I",
      name: "Los Angeles",
      state_code: "CA",
      type: "city",
      full_name: "Los Angeles, CA",
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar user={user} variant="inset" />
      <SidebarInset>
        <SiteHeader title="Property Search" />
        <div className="space-y-6 p-6 pb-16">
          <PropertySearchInterface savedLocations={mockLocations} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
