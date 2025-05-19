"use client";

import { saveUserAssetTypesAction } from "@/actions/save-user-asset-types-action";
import type { Tables } from "@v1/supabase/types";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import { Checkbox } from "@v1/ui/checkbox";
import { Label } from "@v1/ui/label";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";

interface AssetTypeSelectionProps {
  assetTypes: Tables<"asset_types">[];
  selectedAssetTypes: Tables<"asset_types">[];
  maxSelections: number;
  revalidatePath?: string;
}

export function AssetTypeSelection({
  assetTypes,
  selectedAssetTypes,
  maxSelections,
  revalidatePath = "/onboarding/complete",
}: AssetTypeSelectionProps) {
  const [selectedAssetTypeIds, setSelectedAssetTypeIds] = useState<string[]>(
    selectedAssetTypes.map((type) => type.id),
  );

  const { executeAsync: saveUserAssetTypes } = useAction(
    saveUserAssetTypesAction,
  );

  const handleAssetTypeChange = async (
    assetTypeId: string,
    checked: boolean,
  ) => {
    let newSelectedAssetTypeIds: string[];

    if (checked) {
      // Add the asset type if it's not already selected
      if (!selectedAssetTypeIds.includes(assetTypeId)) {
        newSelectedAssetTypeIds = [...selectedAssetTypeIds, assetTypeId];
      } else {
        return; // No change needed
      }
    } else {
      // Remove the asset type
      newSelectedAssetTypeIds = selectedAssetTypeIds.filter(
        (id) => id !== assetTypeId,
      );
    }

    // Update local state
    setSelectedAssetTypeIds(newSelectedAssetTypeIds);

    // Save to the database
    await saveUserAssetTypes({
      assetTypeIds: newSelectedAssetTypeIds,
      revalidatePath,
    });
  };

  return (
    <div>
      <div className="mb-2">
        <Label>Asset Types</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Select up to {maxSelections} asset types
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
        {assetTypes.map((type) => {
          const isSelected = selectedAssetTypeIds.includes(type.id);
          const isDisabled =
            !isSelected && selectedAssetTypeIds.length >= maxSelections;

          return (
            <div key={type.id} className="flex items-start space-x-2">
              <Checkbox
                id={`asset-type-${type.id}`}
                checked={isSelected}
                disabled={isDisabled}
                onCheckedChange={(checked) =>
                  handleAssetTypeChange(type.id, checked === true)
                }
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor={`asset-type-${type.id}`}
                  className={isDisabled ? "text-muted-foreground" : ""}
                >
                  {type.name}
                </Label>
                {type.description && (
                  <p className="text-xs text-muted-foreground">
                    {type.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
