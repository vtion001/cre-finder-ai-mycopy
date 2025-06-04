import { getSubscription } from "@v1/supabase/cached-queries";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@v1/ui/tooltip";
import { CrownIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

async function PlanInfoContent() {
  const subscription = await getSubscription();

  if (!subscription) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-sidebar-foreground">
              Free Plan
            </div>
            <div className="text-xs text-sidebar-foreground/70">
              Upgrade to get started
            </div>
          </div>
        </div>
        <Button asChild size="sm" className="w-full">
          <Link href="/dashboard/credits">Upgrade</Link>
        </Button>
      </div>
    );
  }

  const planName = subscription.prices?.products?.name || "Unknown Plan";
  const isTrialing = subscription.status === "trialing";

  // Calculate trial days remaining if in trial
  let trialInfo = null;
  if (isTrialing && subscription.trial_end) {
    const trialEnd = new Date(subscription.trial_end);
    const now = new Date();
    const daysRemaining = Math.ceil(
      (trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysRemaining > 0) {
      trialInfo = `Your trial ends in ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""}.`;
    } else {
      trialInfo = "Your trial has ended.";
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base text-primary font-bold tracking-tight">
              {planName} Plan
            </span>
            {isTrialing && (
              <Badge variant="secondary" className="text-xs">
                TRIAL
              </Badge>
            )}
          </div>
          {trialInfo && (
            <div className="text-xs text-sidebar-foreground/70 mt-1">
              {trialInfo}
            </div>
          )}
        </div>
      </div>
      {isTrialing && (
        <Button asChild size="sm" variant="outline" className="w-full">
          <Link href="/dashboard/credits">Contact us to upgrade</Link>
        </Button>
      )}
    </div>
  );
}

function PlanInfoLoading() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-sidebar-foreground">
            Loading...
          </div>
        </div>
      </div>
    </div>
  );
}

export function SidebarPlanInfo() {
  return (
    <div className="group-data-[collapsible=icon]:hidden">
      <Suspense fallback={<PlanInfoLoading />}>
        <PlanInfoContent />
      </Suspense>
    </div>
  );
}
