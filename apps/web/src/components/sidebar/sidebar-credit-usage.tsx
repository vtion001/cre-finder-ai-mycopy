import { Progress } from "@v1/ui/progress";
import { Suspense } from "react";
import {
  CreditUsageCollapsed,
  CreditUsageServer,
} from "./sidebar-credit-usage.server";

function CreditUsageLoading() {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm">
        <span className="text-sidebar-foreground/70">Loading...</span>
      </div>
      <Progress value={0} className="h-2 bg-primary/80" />
    </div>
  );
}

function CreditUsageCollapsedLoading() {
  return (
    <div className="flex justify-center">
      <div className="w-8 h-8 rounded-md bg-sidebar-accent/20 animate-pulse" />
    </div>
  );
}

export function SidebarCreditUsage() {
  return (
    <>
      {/* Expanded state */}
      <div className="group-data-[collapsible=icon]:hidden">
        <Suspense fallback={<CreditUsageLoading />}>
          <CreditUsageServer />
        </Suspense>
      </div>

      {/* Collapsed state */}
      <div className="hidden group-data-[collapsible=icon]:block">
        <Suspense fallback={<CreditUsageCollapsedLoading />}>
          <CreditUsageCollapsed />
        </Suspense>
      </div>
    </>
  );
}
