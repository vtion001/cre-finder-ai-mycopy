"use client";

import type { Database } from "@v1/supabase/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@v1/ui/card";
import { Progress } from "@v1/ui/progress";

export function CreditUsageDisplay({
  data,
}: {
  data: Database["public"]["Functions"]["calculate_user_credit_usage"]["Returns"][0];
}) {
  const usagePercentage =
    data.total_available_credits > 0
      ? Math.min(
          Math.round(
            (data.consumed_credits / data.total_available_credits) * 100,
          ),
          100,
        )
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Usage</CardTitle>
        <CardDescription>
          Your search credit usage for the current billing period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {data.consumed_credits} of {data.total_available_credits} credits
              used
            </span>
            <span className="text-sm font-medium">{usagePercentage}%</span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {data.remaining_credits} credits remaining
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
