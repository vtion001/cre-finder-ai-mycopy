import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { getUser } from "@v1/supabase/cached-queries";
import { SidebarInset, SidebarProvider } from "@v1/ui/sidebar";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cachedUser = await getUser();

  if (!cachedUser?.data) {
    redirect("/login");
  }
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar user={cachedUser?.data} variant="sidebar" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
