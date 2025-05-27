import { getUserCreditUsage } from "@v1/supabase/cached-queries";
import { Separator } from "@v1/ui/separator";
import { SidebarTrigger } from "@v1/ui/sidebar";
import { CreditIndicator } from "./credit-indicator";

export async function SiteHeader({ title }: { title: string }) {
  const credits = await getUserCreditUsage();

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto">
          <CreditIndicator credits={credits.data} />
        </div>
      </div>
    </header>
  );
}
