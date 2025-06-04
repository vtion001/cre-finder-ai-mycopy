import { getUserCreditUsage } from "@v1/supabase/cached-queries";
import { Separator } from "@v1/ui/separator";
import { SidebarTrigger } from "@v1/ui/sidebar";
import type { ReactNode } from "react";
import { CreditIndicator } from "./credit-indicator";

export async function SiteHeader({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  const credits = await getUserCreditUsage();

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-14 shrink-0 items-center border-b transition-[width,height] ease-linear ">
      <div className="flex w-full items-center gap-1 px-3 sm:px-6 ml-6 lg:gap-2 ">
        <h1 className="text-sm sm:text-base font-medium truncate">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          {children}
          <CreditIndicator credits={credits.data} />
        </div>
      </div>
    </header>
  );
}
