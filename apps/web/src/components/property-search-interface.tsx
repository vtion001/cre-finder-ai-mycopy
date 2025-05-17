"use client";

import { getPropertySearchAction } from "@/actions/get-property-search-action";
import { formatNumber } from "@/lib/format";
import type { Tables } from "@v1/supabase/types";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import { cn } from "@v1/ui/cn";
import { Collapsible, CollapsibleTrigger } from "@v1/ui/collapsible";
import { format } from "date-fns";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { PropertyFiltersForm } from "./forms/property-filters-form";
import { SearchResults } from "./search-results";

// Define the filter type
interface PropertyFilter {
  locations: Tables<"user_locations">[];
  buildingSizeMin?: number;
  buildingSizeMax?: number;
  lotSizeMin?: number;
  lotSizeMax?: number;
  lastSaleDate?: Date;
  yearBuiltMin?: number;
  yearBuiltMax?: number;
}

interface PropertySearchInterfaceProps {
  assetType: Tables<"asset_types">;
  savedLocations: Tables<"user_locations">[];
}

export function PropertySearchInterface({
  assetType,
  savedLocations,
}: PropertySearchInterfaceProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  const {
    execute: searchProperties,
    isPending: isLoading,
    status,
    result: { data: searchResponse },
  } = useAction(getPropertySearchAction);

  const handleSearch = (filters: PropertyFilter) => {
    const apiParams = {
      size: 8, // Limit to 8 results as requested
      building_size_min: filters.buildingSizeMin,
      building_size_max: filters.buildingSizeMax,
      lot_size_min: filters.lotSizeMin,
      lot_size_max: filters.lotSizeMax,
      last_sale_date: filters.lastSaleDate
        ? format(filters.lastSaleDate, "yyyy-MM-dd")
        : undefined,
      year_min: filters.yearBuiltMin,
      year_max: filters.yearBuiltMax,
    };

    // Call the server action
    searchProperties(apiParams);
  };

  return (
    <div className="flex flex-col space-y-6 p-6 bg-muted/50">
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
              <h2 className="text-lg font-medium">Filters & search criteria</h2>
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

        <PropertyFiltersForm
          assetType={assetType}
          savedLocations={savedLocations}
          onApplyFilters={handleSearch}
        />
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

      {/* Preview Results */}
      {status === "hasSucceeded" && (
        <div className="space-y-2">
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
            <h2 className="text-lg font-medium">Preview results</h2>
            <Badge
              variant="outline"
              className="bg-accent/20 text-accent-foreground hover:bg-accent/20 border-accent/30"
            >
              {formatNumber(searchResponse?.resultCount)} potential matches
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            Review the first {formatNumber(searchResponse?.recordCount)}{" "}
            properties based on your criteria.
          </p>

          <div className="bg-card rounded-md shadow-sm border">
            <SearchResults
              results={searchResponse?.data ?? []}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}
