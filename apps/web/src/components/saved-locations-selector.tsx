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
  options: Location[];
  onValueChange: (locations: Location[]) => void;
  value?: Location[];
  maxSelections?: number;
}

export function SavedLocationsSelector({
  options,
  onValueChange,
  value = [],
  maxSelections = 3,
}: SavedLocationsSelectorProps) {
  const handleToggleLocation = (location: Location, e?: React.MouseEvent) => {
    // If this is triggered from a checkbox click, we want to stop here
    // as the card click will handle the state change
    if (e?.target instanceof HTMLInputElement) {
      return;
    }

    let newSelected: Location[];

    if (value.some((loc) => loc.id === location.id)) {
      newSelected = value.filter((loc) => loc.id !== location.id);
    } else {
      if (value.length < maxSelections) {
        newSelected = [...value, location];
      } else {
        return;
      }
    }

    onValueChange(newSelected);
  };

  const isSelected = (locationId: string) => {
    return value.some((loc) => loc.id === locationId);
  };

  if (options.length === 0) {
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
          {value.length}/{maxSelections} selected
        </span>
      </div>

      <div className="grid gap-2">
        {options.map((location) => (
          <Card
            key={location.id}
            className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={(e) => handleToggleLocation(location, e)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  role="presentation"
                >
                  <Checkbox
                    checked={isSelected(location.id)}
                    id={`location-${location.id}`}
                  />
                </div>
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
