import { getUserCreditUsage } from "@v1/supabase/cached-queries";
import { Progress } from "@v1/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@v1/ui/tooltip";
import { SearchIcon } from "lucide-react";
import Link from "next/link";

export async function CreditUsageServer() {
  const { data } = await getUserCreditUsage();

  if (!data) {
    return null;
  }

  const usagePercentage =
    data.total_available > 0
      ? Math.min(
          Math.round((data.total_consumed / data.total_available) * 100),
          100,
        )
      : 0;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm">
        <span className="text-sidebar-foreground/70">
          {data.total_consumed} / {data.total_available} Searches
        </span>
      </div>
      <Progress value={usagePercentage} className="h-2 bg-primary/10" />
    </div>
  );
}

export async function CreditUsageCollapsed() {
  const { data } = await getUserCreditUsage();

  if (!data) {
    return null;
  }

  const usagePercentage =
    data.total_available > 0
      ? Math.min(
          Math.round((data.total_consumed / data.total_available) * 100),
          100,
        )
      : 0;

  return (
    <Link href="/dashboard/credits">
      <div className="space-y-1 hover:bg-muted p-0.5 rounded-lg">
        <div className="text-xs text-gray-600 text-center">
          {data.total_consumed} / {data.total_available}
        </div>
        <Progress value={usagePercentage} className="h-1" />
        <div className="text-xs text-gray-500 text-center">credits used</div>
      </div>
    </Link>
  );
}
