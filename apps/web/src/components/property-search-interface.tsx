"use client";

import { PropertyFiltersForm } from "@/components/property-filters-form";
import { parseLocationCode } from "@/lib/format";
import { Card } from "@v1/ui/card";
import { Label } from "@v1/ui/label";
import { ScrollArea, ScrollBar } from "@v1/ui/scroll-area";
import { Separator } from "@v1/ui/separator";
import { Switch } from "@v1/ui/switch";
import { BuildingIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PropertyMap } from "./property-map";

interface PropertySearchInterfaceProps {
  locationCode: string;
  assetTypeNames: string[];
}

export function PropertySearchInterface({
  locationCode,
  assetTypeNames,
}: PropertySearchInterfaceProps) {
  const [showMap, setShowMap] = useState(true);

  const location = parseLocationCode(locationCode);

  const formattedLocation = `${location.city || location.county}, ${location.state}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SearchIcon className="h-4 w-4" />
            <span>
              Searching for{" "}
              <span className="font-medium">{assetTypeNames.join(", ")}</span>{" "}
              in <span className="font-medium">{formattedLocation}</span>
            </span>
            <Separator orientation="vertical" className="h-4" />
            <Link
              href="/dashboard/search"
              className="text-sm font-medium underline hover:opacity-60"
            >
              Change
            </Link>
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
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {showMap && (
          <div className="lg:sticky lg:top-6 lg:h-fit">
            <PropertyMap records={[]} className="h-[calc(100vh-7rem)]" />
          </div>
        )}
      </div>
    </div>
  );
}
