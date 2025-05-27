"use client";

import { useState } from "react";

import type { PropertySearchResult } from "@/lib/realestateapi";
import type { Database } from "@v1/supabase/types";
import { Card, CardContent, CardDescription, CardHeader } from "@v1/ui/card";
import { Separator } from "@v1/ui/separator";
import { Skeleton } from "@v1/ui/skeleton";
import { BuildingIcon, CreditCardIcon, TrendingUpIcon } from "lucide-react";
import { CreditWarning } from "./credit-warning";
import { ExportButton } from "./export-button";
import { TopUpDialog } from "./top-up-dialog";

interface SearchResultsProps {
  isLoading?: boolean;
  results: PropertySearchResult[];
  searchLogId?: string;
  creditData: Database["public"]["Functions"]["calculate_user_credit_usage"]["Returns"][0];
  resultCount: number;
}

export function SearchResults({
  results,
  isLoading,
  searchLogId,
  creditData,
  resultCount,
}: SearchResultsProps) {
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  // Check if user has enough credits for export
  const hasInsufficientCredits = creditData.remaining_credits < resultCount;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="space-y-2">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-md p-4 space-y-6 shadow-sm border">
      {/* Metric Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
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
                <div className="text-2xl font-bold">
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
                <div className="text-2xl font-bold">{resultCount} credits</div>
                <div className="text-sm text-muted-foreground">Export cost</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
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
                <div className="text-2xl font-bold">
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
          <ExportButton
            results={results}
            searchLogId={searchLogId}
            resultCount={resultCount}
          />
        )}
      </div>

      <TopUpDialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen} />
    </div>
  );
}
