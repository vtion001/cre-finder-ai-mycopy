"use client";

import type { locationSchema } from "@/actions/schema";
import type { Tables } from "@v1/supabase/types";
import { Badge } from "@v1/ui/badge";
import { Card } from "@v1/ui/card";
import { Checkbox } from "@v1/ui/checkbox";
import { Label } from "@v1/ui/label";
import { Skeleton } from "@v1/ui/skeleton";
import { BuildingIcon, MapPinIcon } from "lucide-react";
import { useState } from "react";
import type { z } from "zod";

type Location = Tables<"user_locations">;

interface SavedLocationsSelectorProps {
  savedLocations: Location[];
  onSelectLocations: (locations: Location[]) => void;
  selectedLocations?: Location[];
  maxSelections?: number;
}

export function SavedLocationsSelector({
  savedLocations,
  onSelectLocations,
  selectedLocations = [],
  maxSelections = 3,
}: SavedLocationsSelectorProps) {
  const [selected, setSelected] = useState<Location[]>(selectedLocations);

  const handleToggleLocation = (location: Location) => {
    let newSelected: Location[];

    if (selected.some((loc) => loc.id === location.id)) {
      // Remove location if already selected
      newSelected = selected.filter((loc) => loc.id !== location.id);
    } else {
      // Add location if not at max selections
      if (selected.length < maxSelections) {
        newSelected = [...selected, location];
      } else {
        return; // Don't add if at max selections
      }
    }

    setSelected(newSelected);
    onSelectLocations(newSelected);
  };

  const isSelected = (locationId: string) => {
    return selected.some((loc) => loc.id === locationId);
  };

  if (savedLocations.length === 0) {
    return (
      <div className="text-center p-6 bg-muted/50 rounded-md border border-dashed">
        <p className="text-muted-foreground">
          You don't have any saved locations. Please add locations in your
          profile settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base">Your Locations</Label>
        <span className="text-xs text-muted-foreground">
          {selected.length}/{maxSelections} selected
        </span>
      </div>

      <div className="grid gap-2">
        {savedLocations.map((location) => (
          <Card
            key={location.id}
            className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => handleToggleLocation(location)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={isSelected(location.id)}
                  onCheckedChange={() => handleToggleLocation(location)}
                  id={`location-${location.id}`}
                />
                <div className="flex items-center gap-2">
                  {location.type === "city" ? (
                    <BuildingIcon className="h-4 w-4 text-primary" />
                  ) : (
                    <MapPinIcon className="h-4 w-4 text-accent-foreground" />
                  )}
                  <Label
                    htmlFor={`location-${location.id}`}
                    className="font-normal cursor-pointer"
                  >
                    {location.display_name}
                  </Label>
                </div>
              </div>
              <Badge variant="outline" className="text-xs capitalize">
                {location.type}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function SavedLocationsSelectorSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="grid gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );
}
