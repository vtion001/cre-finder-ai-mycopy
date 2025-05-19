"use client";

import { getRealEstateLocationsAction } from "@/actions/get-real-estate-locations-action";
import { saveUserLocationsAction } from "@/actions/save-user-locations-action";
import type { locationSchema } from "@/actions/schema";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import { Card } from "@v1/ui/card";
import { cn } from "@v1/ui/cn";
import { Input } from "@v1/ui/input";
import { Label } from "@v1/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@v1/ui/tabs";
import { useDebounce } from "@v1/ui/use-debounce";
import { BuildingIcon, MapPinIcon, XIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import type { z } from "zod";

type Location = z.infer<typeof locationSchema>;

interface LocationSearchProps {
  selectedLocations: Location[];
  maxSelections?: number;
  revalidatePath?: string;
}

export function LocationSearch({
  selectedLocations,
  maxSelections = 1,
  revalidatePath = "/onboarding/complete",
}: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"all" | "cities" | "counties">(
    "all",
  );

  const {
    execute: fetchLocations,
    isPending: isLoading,
    result: { data: locations = [] },
  } = useAction(getRealEstateLocationsAction);

  const { executeAsync: saveUserLocations } = useAction(
    saveUserLocationsAction,
  );

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      const searchTypes =
        searchType === "all"
          ? ["C", "N"]
          : searchType === "cities"
            ? ["C"]
            : ["N"];

      fetchLocations({
        query: debouncedQuery,
        searchTypes,
      });
    }
  }, [debouncedQuery, fetchLocations, searchType]);

  const handleSelectLocation = async (location: Location) => {
    if (
      !selectedLocations.some((loc) => loc.internal_id === location.internal_id)
    ) {
      if (selectedLocations.length < maxSelections) {
        // Add the new location to the existing locations
        await saveUserLocations({
          locations: [...selectedLocations, location],
          revalidatePath,
        });
      }
    }
  };

  const handleRemoveLocation = async (locationId: string) => {
    // Filter out the location to remove
    const newLocations = selectedLocations.filter(
      (loc) => loc.internal_id !== locationId,
    );

    // Save the updated locations
    await saveUserLocations({
      locations: newLocations,
      revalidatePath,
    });
  };

  const filteredLocations = locations.filter(
    (location) =>
      !selectedLocations.some(
        (selected) => selected.internal_id === location.internal_id,
      ),
  );

  const hasReachedMaxSelections = selectedLocations.length >= maxSelections;

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="location-search">Search for Cities or Counties</Label>
        <div className="mt-1.5">
          <Tabs
            defaultValue="all"
            value={searchType}
            onValueChange={(value) =>
              setSearchType(value as "all" | "cities" | "counties")
            }
          >
            <TabsList className="mb-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="cities">Cities</TabsTrigger>
              <TabsTrigger value="counties">Counties</TabsTrigger>
            </TabsList>

            <div className="relative">
              <Input
                title="location-search"
                placeholder="Enter city or county name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={hasReachedMaxSelections}
                className="w-full"
              />

              {hasReachedMaxSelections && (
                <div className="text-xs text-warning mt-1">
                  Maximum of {maxSelections} locations reached
                </div>
              )}

              {/* Fixed-height results container that's always visible */}
              <Card className="w-full mt-3 border shadow-sm">
                <div className="h-64 overflow-hidden">
                  {isLoading ? (
                    <div className="p-4 text-center text-sm text-muted-foreground h-full flex items-center justify-center">
                      Searching...
                    </div>
                  ) : query.trim() === "" ? (
                    <div className="p-4 text-center text-sm text-muted-foreground h-full flex items-center justify-center">
                      Enter a search term to find locations
                    </div>
                  ) : filteredLocations.length > 0 ? (
                    <div
                      className={cn(
                        "overflow-y-auto h-full",
                        hasReachedMaxSelections
                          ? "opacity-60 pointer-events-none"
                          : "",
                      )}
                    >
                      <table className="w-full">
                        <tbody className="divide-y">
                          {filteredLocations.map((location) => {
                            return (
                              <tr
                                key={location.internal_id}
                                className="hover:bg-muted/50 cursor-pointer"
                                onClick={() => handleSelectLocation(location)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    handleSelectLocation(location);
                                  }
                                }}
                                tabIndex={0}
                                role="button"
                                aria-label={`Select ${location.display_name}`}
                              >
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    {location.type === "city" ? (
                                      <BuildingIcon className="h-4 w-4 text-primary flex-shrink-0" />
                                    ) : (
                                      <MapPinIcon className="h-4 w-4 text-accent-foreground flex-shrink-0" />
                                    )}
                                    <div>
                                      <div className="font-medium">
                                        {location.display_name}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {location.type === "city"
                                          ? "City"
                                          : "County"}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground h-full flex items-center justify-center">
                      No locations found. Try a different search term.
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </Tabs>
        </div>
      </div>

      {selectedLocations.length > 0 && (
        <div>
          <Label>Selected Locations</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedLocations.map((location) => (
              <Badge
                key={location.internal_id}
                variant="secondary"
                className="flex items-center gap-1 py-1.5"
              >
                {location.type === "city" ? (
                  <BuildingIcon className="h-3 w-3 mr-1 text-primary" />
                ) : (
                  <MapPinIcon className="h-3 w-3 mr-1 text-accent-foreground" />
                )}
                {location.display_name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  onClick={() => handleRemoveLocation(location.internal_id)}
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
