import { FavoriteSearches } from "@/components/search-history/favorite-searches";
import { SearchHistoryTable } from "@/components/search-history/search-history-table";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { getUser } from "@v1/supabase/cached-queries";
import { getFavoriteSearches, getSearchHistory } from "@v1/supabase/queries";
import { createClient } from "@v1/supabase/server";
import { SidebarInset, SidebarProvider } from "@v1/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@v1/ui/tabs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Search History - CRE Finder AI",
  description: "View and manage your property search history",
};

export default async function SearchHistoryPage() {
  const cachedUser = await getUser();

  const user = cachedUser?.data;

  if (!user) {
    redirect("/login");
  }

  const supabase = createClient();

  const { data: favorites } = await getFavoriteSearches(supabase, user.id);
  const { data: history } = await getSearchHistory(supabase, {
    userId: user.id,
    page: 1,
    pageSize: 10,
  });

  return (
    <SidebarProvider>
      <AppSidebar user={user} variant="inset" />
      <SidebarInset>
        <SiteHeader title="Search History" />
        <div className="space-y-6 p-6 pb-16">
          <div className="space-y-6">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="history">Search History</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="mt-6">
                <SearchHistoryTable searchLogs={history || []} />
              </TabsContent>

              <TabsContent value="favorites" className="mt-6">
                <FavoriteSearches favoriteSearches={favorites || []} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
