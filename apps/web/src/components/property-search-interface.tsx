"use client";

import type { realEstateLocationSchema } from "@/actions/schema";
import { SavedLocationsSelector } from "@/components/saved-locations-selector";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import { cn } from "@v1/ui/cn";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@v1/ui/collapsible";
import { BuildingIcon, MapPinIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import type { z } from "zod";
import { SearchResults } from "./search-results";

type Location = z.infer<typeof realEstateLocationSchema>;

interface PropertySearchInterfaceProps {
  savedLocations: Location[];
}

export function PropertySearchInterface({
  savedLocations,
}: PropertySearchInterfaceProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchStatus, setSearchStatus] = useState<
    "idle" | "searching" | "completed"
  >("idle");
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Handle selection of multiple locations from the saved locations selector
  const handleSelectLocations = (locations: Location[]) => {
    setSelectedLocations(locations);

    // Update active filter count based on other filters (if any)
    // This is a placeholder for future filter functionality
    setActiveFilterCount(0);
  };

  const handleSearch = async () => {
    setSearchStatus("searching");

    // Simulate API call with a delay
    setTimeout(() => {
      setSearchStatus("completed");
    }, 1500);
  };

  return (
    <div className="flex flex-col space-y-6 p-6 bg-gray-50">
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

        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <span>Properties in</span>
          {selectedLocations.length > 0 && (
            <div className="flex flex-wrap gap-1 ml-2">
              {selectedLocations.map((location) => (
                <Badge
                  key={location.id}
                  variant="outline"
                  className="bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200 flex items-center gap-1"
                >
                  {location.type === "city" ? (
                    <BuildingIcon className="h-3 w-3" />
                  ) : (
                    <MapPinIcon className="h-3 w-3" />
                  )}
                  {location.full_name}
                </Badge>
              ))}
              {activeFilterCount > 0 && (
                <Badge
                  variant="outline"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200"
                >
                  +{activeFilterCount} filters
                </Badge>
              )}
            </div>
          )}
        </div>

        <CollapsibleContent className="mt-4">
          <div className="bg-white rounded-md p-4 shadow-sm border">
            <SavedLocationsSelector
              savedLocations={savedLocations}
              onSelectLocations={handleSelectLocations}
              selectedLocations={selectedLocations}
              maxSelections={3}
            />

            <div className="mt-4 flex justify-end">
              <Button
                variant="default"
                className="flex items-center gap-2"
                disabled={selectedLocations.length === 0}
                onClick={handleSearch}
              >
                <SearchIcon className="h-4 w-4 mr-1" />
                Search Properties
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      {/* Search Status */}
      <div className="space-y-4">
        {searchStatus !== "idle" && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100">
              <span className="text-orange-600 text-xs">✓</span>
            </div>
            <span>Reviewing sample properties</span>
          </div>
        )}

        {searchStatus === "searching" && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
            <span>Starting search for properties</span>
          </div>
        )}

        {searchStatus === "completed" && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100">
              <span className="text-orange-600 text-xs">✓</span>
            </div>
            <span>Starting search for properties</span>
          </div>
        )}
      </div>

      {/* Preview Results */}
      {searchStatus === "completed" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-orange-600"
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
              className="bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200"
            >
              8 potential matches
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            Review the first 7 properties based on your criteria.
          </p>

          <div className="bg-white rounded-md shadow-sm border">
            <SearchResults />
          </div>
        </div>
      )}
    </div>
  );
}
