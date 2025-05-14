"use client";

import { getRealEstateLocationsAction } from "@/actions/get-real-estate-locations-action";
import type { realEstateLocationSchema } from "@/actions/schema";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import { Card } from "@v1/ui/card";
import { Input } from "@v1/ui/input";
import { Label } from "@v1/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@v1/ui/tabs";
import { useDebounce } from "@v1/ui/use-debounce";
import { BuildingIcon, MapPinIcon, XIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import type { z } from "zod";

type Location = z.infer<typeof realEstateLocationSchema>;

interface LocationSearchProps {
  onSelectLocation?: (location: Location) => void;
  selectedLocations?: Location[];
  onRemoveLocation?: (locationId: string) => void;
  maxSelections?: number;
}

export function LocationSearch({
  onSelectLocation,
  selectedLocations = [],
  onRemoveLocation,
  maxSelections = 5,
}: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"all" | "cities" | "counties">(
    "all",
  );
  const [isInputFocused, setIsInputFocused] = useState(false);

  const {
    execute: fetchLocations,
    isPending: isLoading,
    result: { data: locations = [] },
  } = useAction(getRealEstateLocationsAction);

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

  const handleSelectLocation = (location: Location) => {
    if (
      onSelectLocation &&
      !selectedLocations.some((loc) => loc.id === location.id)
    ) {
      if (selectedLocations.length < maxSelections) {
        onSelectLocation(location);
        setQuery("");
      }
    }
  };

  const filteredLocations = locations.filter(
    (location) =>
      !selectedLocations.some((selected) => selected.id === location.id),
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
                id="location-search"
                placeholder="Enter city or county name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
                disabled={hasReachedMaxSelections}
                className="w-full"
              />

              {hasReachedMaxSelections && (
                <div className="text-xs text-amber-600 mt-1">
                  Maximum of {maxSelections} locations reached
                </div>
              )}

              {isInputFocused &&
                query.trim() !== "" &&
                filteredLocations.length > 0 && (
                  <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-auto shadow-lg">
                    <div className="p-1">
                      {isLoading ? (
                        <div className="p-2 text-center text-sm text-muted-foreground">
                          Searching...
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {filteredLocations.map((location) => (
                            <Button
                              key={location.id}
                              variant="ghost"
                              className="w-full justify-start text-left h-auto py-2"
                              onClick={() => handleSelectLocation(location)}
                            >
                              <div className="flex items-center gap-2">
                                {location.type === "city" ? (
                                  <BuildingIcon className="h-4 w-4 text-blue-500" />
                                ) : (
                                  <MapPinIcon className="h-4 w-4 text-green-500" />
                                )}
                                <div>
                                  <div className="font-medium">
                                    {location.full_name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {location.type === "city"
                                      ? "City"
                                      : "County"}
                                  </div>
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                )}

              {isInputFocused &&
                query.trim() !== "" &&
                filteredLocations.length === 0 &&
                !isLoading && (
                  <Card className="absolute z-10 w-full mt-1 shadow-lg">
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No locations found. Try a different search term.
                    </div>
                  </Card>
                )}
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
                key={location.id}
                variant="secondary"
                className="flex items-center gap-1 py-1.5"
              >
                {location.type === "city" ? (
                  <BuildingIcon className="h-3 w-3 mr-1" />
                ) : (
                  <MapPinIcon className="h-3 w-3 mr-1" />
                )}
                {location.full_name}
                {onRemoveLocation && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                    onClick={() => onRemoveLocation(location.id)}
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                )}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
