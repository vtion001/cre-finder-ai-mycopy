"use client";

import type { Database } from "@v1/supabase/types";
import { Card, CardContent, CardDescription, CardHeader } from "@v1/ui/card";
import { Separator } from "@v1/ui/separator";
import { BuildingIcon, CreditCardIcon, TrendingUpIcon } from "lucide-react";
import { CreditWarning } from "./credit-warning";
import { ExportButton } from "./export-button";

interface PreviewResultsProps {
  isLoading?: boolean;
  searchLogId: string;
  creditData: Database["public"]["Functions"]["calculate_user_credit_usage"]["Returns"][0];
  resultCount: number;
}

export function PreviewResults({
  searchLogId,
  creditData,
  resultCount,
}: PreviewResultsProps) {
  const hasInsufficientCredits = creditData.remaining_credits < resultCount;

  return (
    <div className="bg-card rounded-md p-3 sm:p-4 space-y-4 sm:space-y-6 shadow-sm border">
      {/* Metric Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-3 sm:p-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-sm text-muted-foreground">
              Potential properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BuildingIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold">
                  {resultCount.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Properties found
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-sm text-muted-foreground">
              Cost
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/60">
                <CreditCardIcon className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold">
                  {resultCount} credits
                </div>
                <div className="text-sm text-muted-foreground">Export cost</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardDescription className="text-sm text-muted-foreground">
              Balance Overage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${hasInsufficientCredits ? "bg-destructive/10" : "bg-primary/10"}`}
              >
                <TrendingUpIcon
                  className={`h-5 w-5 ${hasInsufficientCredits ? "text-destructive" : "text-primary"}`}
                />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold">
                  {hasInsufficientCredits
                    ? `${resultCount - creditData.remaining_credits} credits`
                    : "0 credits"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {hasInsufficientCredits
                    ? "Credits needed"
                    : "Sufficient balance"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />
      <div className="p-4">
        {hasInsufficientCredits ? (
          <CreditWarning resultCount={resultCount} creditData={creditData} />
        ) : (
          <ExportButton searchLogId={searchLogId} resultCount={resultCount} />
        )}
      </div>
    </div>
  );
}
