"use client";

import type { Tables } from "@v1/supabase/types";
import { Badge } from "@v1/ui/badge";
import { Label } from "@v1/ui/label";
import { useState } from "react";

interface AssetTypeSelectorProps {
  assetTypes: Tables<"asset_types">[];
  selectedAssetTypeIndex: number;
  onAssetTypeChange: (index: number) => void;
  variant?: "default" | "compact";
}

export function AssetTypeSelector({
  assetTypes,
  selectedAssetTypeIndex,
  onAssetTypeChange,
  variant = "default",
}: AssetTypeSelectorProps) {
  if (assetTypes.length === 0) {
    return (
      <div className="text-center p-4 bg-muted/50 rounded-md border border-dashed">
        <p className="text-muted-foreground">
          No asset types available. Please configure your asset types in
          settings.
        </p>
      </div>
    );
  }

  if (assetTypes.length === 1) {
    return null;
  }

  return (
    <div className={variant === "compact" ? "mb-4" : "space-y-4"}>
      {variant === "default" && (
        <div className="flex justify-between items-center">
          <Label className="text-base">Asset Type</Label>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {assetTypes.map((type, index) => (
          <Badge
            key={type.id}
            variant={index === selectedAssetTypeIndex ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onAssetTypeChange(index)}
          >
            {type.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
