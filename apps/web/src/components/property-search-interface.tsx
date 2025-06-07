"use client";

import { PropertyFiltersForm } from "@/components/property-filters-form";
import { Card } from "@v1/ui/card";
import { Label } from "@v1/ui/label";
import { ScrollArea, ScrollBar } from "@v1/ui/scroll-area";
import { Switch } from "@v1/ui/switch";
import { BuildingIcon, SearchIcon } from "lucide-react";
import { useState } from "react";

interface PropertySearchInterfaceProps {
  location: string;
  asset_types: string[];
}

export function PropertySearchInterface({
  location,
  asset_types,
}: PropertySearchInterfaceProps) {
  const [showMap, setShowMap] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SearchIcon className="h-4 w-4" />
            <span>
              Searching for{" "}
              <span className="font-medium">{asset_types.join(", ")}</span> in{" "}
              <span className="font-medium">{location}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="show-map" className="text-sm font-medium">
              Map
            </Label>
            <Switch
              id="show-map"
              checked={showMap}
              onCheckedChange={setShowMap}
            />
          </div>
        </div>
      </div>

      <PropertyFiltersForm />

      <div
        className={`grid gap-6 ${showMap ? "lg:grid-cols-[1fr,480px]" : "grid-cols-1"}`}
      >
        <div className="min-w-0">
          <ScrollArea
            hideScrollbar
            className="h-[calc(100vh-7rem)] w-full rounded-md border overflow-y-hidden"
          >
            {/* Placeholder for search results table */}
            <Card className="p-8 m-4">
              <div className="text-center text-muted-foreground">
                <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-medium mb-2">Search Results</h3>
                <p>Property search results will appear here</p>
                <div className="mt-4 text-sm">
                  <div className="space-y-1">
                    <div>
                      Location: <span className="font-medium">{location}</span>
                    </div>
                    <div>
                      Asset Types:{" "}
                      <span className="font-medium">
                        {asset_types.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {showMap && (
          <div className="lg:sticky lg:top-6 lg:h-fit">
            <Card className="h-[calc(100vh-7rem)] bg-muted/20">
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <BuildingIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <h3 className="text-lg font-medium mb-2">Property Map</h3>
                  <p>Search results will be displayed on the map</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
