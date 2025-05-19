"use client";

import type { Tables } from "@v1/supabase/types";
import { Badge } from "@v1/ui/badge";
import { Label } from "@v1/ui/label";
import { useState } from "react";

interface AssetTypeSelectorProps {
  options: Tables<"asset_types">[];
  value: string;
  onValueChange: (id: string) => void;
  variant?: "default" | "compact";
}

export function AssetTypeSelector({
  options,
  value,
  onValueChange,
  variant = "default",
}: AssetTypeSelectorProps) {
  if (options.length === 0) {
    return (
      <div className="text-center p-4 bg-muted/50 rounded-md border border-dashed">
        <p className="text-muted-foreground">
          No asset types available. Please configure your asset types in
          settings.
        </p>
      </div>
    );
  }

  if (options.length === 1) {
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
        {options.map((type, index) => (
          <Badge
            key={type.id}
            variant={type.id === value ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onValueChange(type.id)}
          >
            {type.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
