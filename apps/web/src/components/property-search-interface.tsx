"use client";

import { previewSearchAction } from "@/actions/property-search";
import type { searchFiltersSchema } from "@/actions/schema";
import { formatNumber } from "@/lib/format";
import type { Database, Tables } from "@v1/supabase/types";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import { cn } from "@v1/ui/cn";
import { Collapsible, CollapsibleTrigger } from "@v1/ui/collapsible";
import { useAction } from "next-safe-action/hooks";
import { useQueryState } from "nuqs";
import { useState } from "react";
import type { z } from "zod";
import { SearchFiltersForm } from "./forms/search-filters-form";
import { PreviewResults } from "./preview-results";

interface PropertySearchInterfaceProps {
  initialValues?: z.infer<typeof searchFiltersSchema>;
  assetTypes: Tables<"asset_types">[];
  savedLocations: Tables<"user_locations">[];
  creditData: Database["public"]["Functions"]["calculate_user_credit_usage"]["Returns"][0];
}

export function PropertySearchInterface({
  initialValues,
  assetTypes,
  savedLocations,
  creditData,
}: PropertySearchInterfaceProps) {
  const [id, setId] = useQueryState("id");

  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  const {
    execute: previewSearch,
    status,
    result: { data: searchResponse },
  } = useAction(previewSearchAction, {
    onSuccess: ({ data }) => {
      if (data?.searchLogId) setId(data.searchLogId);
    },
  });

  const handleSearch = (filters: z.infer<typeof searchFiltersSchema>) => {
    previewSearch({
      searchId: id || undefined,
      ...filters,
    });
  };

  return (
    <div className="flex flex-col space-y-6 p-4 sm:p-6">
      <Collapsible
        open={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
        className="w-full"
      >
        <div className="flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="p-0 flex items-center gap-2 hover:bg-transparent"
            >
              <h2 className="text-base sm:text-lg font-medium">
                Filters & search criteria
              </h2>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={cn(
                  "transform transition-transform",
                  isFiltersOpen ? "rotate-180" : "",
                )}
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </CollapsibleTrigger>
        </div>

        <div className="mb-4">
          <SearchFiltersForm
            intialValues={initialValues}
            assetTypes={assetTypes}
            savedLocations={savedLocations}
            onSubmit={handleSearch}
          />
        </div>
      </Collapsible>

      <div className="space-y-4">
        {status !== "idle" && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20">
              <span className="text-accent-foreground text-xs">✓</span>
            </div>
            <span>Reviewing sample properties</span>
          </div>
        )}

        {status === "executing" && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span>Starting search for properties</span>
          </div>
        )}

        {status === "hasSucceeded" && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20">
              <span className="text-accent-foreground text-xs">✓</span>
            </div>
            <span>Search completed</span>
          </div>
        )}

        {status === "hasErrored" && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-200">
              <span className="text-destructive-foreground text-xs">!</span>
            </div>
            <span>Search failed</span>
          </div>
        )}
      </div>

      {status === "hasSucceeded" && (
        <div className="space-y-2">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:gap-2 sm:space-y-0">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-accent-foreground"
                  >
                    <path
                      d="M3 7.8L12 3L21 7.8M3 7.8V16.2L12 21L21 16.2V7.8M3 7.8L12 12L21 7.8M12 12V21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2 className="text-base sm:text-lg font-medium">
                  Preview results
                </h2>
              </div>
              <Badge
                variant="outline"
                className="bg-accent/20 text-accent-foreground hover:bg-accent/20 border-accent/30 w-fit"
              >
                {formatNumber(searchResponse?.resultCount)} potential matches
              </Badge>
            </div>
          </div>

          {id && (
            <PreviewResults
              searchLogId={id}
              creditData={creditData}
              resultCount={searchResponse?.resultCount || 0}
            />
          )}
        </div>
      )}
    </div>
  );
}
