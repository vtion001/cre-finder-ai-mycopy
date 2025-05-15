"use client";

import { saveAssetTypeAction } from "@/actions/save-asset-type-action";

import { saveUserLocationsAction } from "@/actions/save-user-locations-action";
import type { locationSchema } from "@/actions/schema";
import { LocationSearch } from "@/components/location-search";
import type { Tables } from "@v1/supabase/types";
import { Label } from "@v1/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@v1/ui/select";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import type { z } from "zod";

type Location = z.infer<typeof locationSchema>;

type AssetType = Tables<"asset_types">;

export function LocationSelection({
  plan,
  assetTypes,
  selectedAssetType,
  selectedLocations,
}: {
  plan: Tables<"subscription_plans">;
  assetTypes: AssetType[];
  selectedAssetType?: string | null;
  selectedLocations?: Location[];
}) {
  const { executeAsync: saveAssetType } = useAction(saveAssetTypeAction);

  const { executeAsync: saveUserLocations } = useAction(
    saveUserLocationsAction,
  );

  const handleSelectLocation = async (location: Location) => {
    // todo: handle multiple locations
    await saveUserLocations({
      locations: [location],
      revalidatePath: "/onboarding/complete",
    });
  };

  const handleRemoveLocation = async (locationId: string) => {
    const newLocations = selectedLocations?.filter(
      (loc) => loc.internal_id !== locationId,
    );

    await saveUserLocations({
      locations: newLocations ?? [],
      revalidatePath: "/onboarding/complete",
    });
  };

  const handleSelectAssetType = async (assetTypeId: string) => {
    await saveAssetType({
      assetTypeId,
      revalidatePath: "/onboarding/complete",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Select Your Target Locations</h1>
        <p className="text-muted-foreground mt-2">
          Choose the cities or counties where you want to search for properties
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="asset-type">Asset Type</Label>
          <Select
            value={selectedAssetType ?? undefined}
            onValueChange={handleSelectAssetType}
          >
            <SelectTrigger id="asset-type" className="w-full mt-1">
              <SelectValue placeholder="Select an asset type" />
            </SelectTrigger>
            <SelectContent>
              {assetTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <LocationSearch
          onSelectLocation={handleSelectLocation}
          selectedLocations={selectedLocations}
          onRemoveLocation={handleRemoveLocation}
          maxSelections={plan.county_access === "Single county" ? 1 : 5}
        />
      </div>
    </div>
  );
}
