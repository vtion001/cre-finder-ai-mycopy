import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SearchHistoryTable } from "@/components/tables/search-history-table";
import { getSearchHistory, getUser } from "@v1/supabase/cached-queries";
import { SidebarInset, SidebarProvider } from "@v1/ui/sidebar";
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

  const { data: history } = await getSearchHistory({
    page: 1,
    pageSize: 10,
  });

  return (
    <SidebarProvider>
      <AppSidebar user={user} variant="inset" />
      <SidebarInset>
        <SiteHeader title="Search History" />
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 pb-16">
          {/* @ts-expect-error  */}
          <SearchHistoryTable searchLogs={history || []} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
