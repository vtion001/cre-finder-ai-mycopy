"use client";

import type { Tables } from "@v1/supabase/types";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import { cn } from "@v1/ui/cn";
import { Collapsible, CollapsibleTrigger } from "@v1/ui/collapsible";
import { useState } from "react";
import { PropertyFiltersForm } from "./forms/property-filters-form";
import { SearchResults } from "./search-results";

// Define the filter type
interface PropertyFilter {
  buildingSizeMin?: number;
  buildingSizeMax?: number;
  lotSizeMin?: number;
  lotSizeMax?: number;
  lastSaleDate?: Date;
  yearBuiltMin?: number;
  yearBuiltMax?: number;
}

interface PropertySearchInterfaceProps {
  savedLocations: Tables<"user_locations">[];
}

export function PropertySearchInterface({
  savedLocations,
}: PropertySearchInterfaceProps) {
  const [searchStatus, setSearchStatus] = useState<
    "idle" | "searching" | "completed"
  >("idle");
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  const handleSearch = (filters: PropertyFilter) => {
    setSearchStatus("searching");

    // Simulate API call with a delay
    setTimeout(() => {
      setSearchStatus("completed");
    }, 1500);
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
          savedLocations={savedLocations}
          onApplyFilters={handleSearch}
        />
      </Collapsible>

      <div className="space-y-4">
        {searchStatus !== "idle" && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20">
              <span className="text-accent-foreground text-xs">✓</span>
            </div>
            <span>Reviewing sample properties</span>
          </div>
        )}

        {searchStatus === "searching" && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span>Starting search for properties</span>
          </div>
        )}

        {searchStatus === "completed" && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20">
              <span className="text-accent-foreground text-xs">✓</span>
            </div>
            <span>Starting search for properties</span>
          </div>
        )}
      </div>

      {/* Preview Results */}
      {searchStatus === "completed" && (
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
              8 potential matches
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            Review the first 7 properties based on your criteria.
          </p>

          <div className="bg-card rounded-md shadow-sm border">
            <SearchResults />
          </div>
        </div>
      )}
    </div>
  );
}
