"use client";

import { getUserCreditUsage } from "@v1/supabase/cached-queries";
import { Database, Tables } from "@v1/supabase/types";
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
  data: {
    consumedCredits: number;
    maxAllowedCredits: number;
    remainingCredits: number;
  };
}) {
  const { consumedCredits, maxAllowedCredits, remainingCredits } = data || {
    consumedCredits: 0,
    maxAllowedCredits: 0,
    remainingCredits: 0,
  };

  const usagePercentage =
    maxAllowedCredits > 0
      ? Math.min(Math.round((consumedCredits / maxAllowedCredits) * 100), 100)
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
              {consumedCredits} of {maxAllowedCredits} credits used
            </span>
            <span className="text-sm font-medium">{usagePercentage}%</span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {remainingCredits} credits remaining
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
