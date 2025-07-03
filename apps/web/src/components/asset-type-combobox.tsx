"use client";

import { getUseCodeName } from "@/lib/use-codes";
import type { Tables } from "@v1/supabase/types";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import { Checkbox } from "@v1/ui/checkbox";
import { cn } from "@v1/ui/cn";
import { Popover, PopoverContent, PopoverTrigger } from "@v1/ui/popover";
import { ScrollArea } from "@v1/ui/scroll-area";
import { ChevronDown, ChevronRight, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

type AssetType = Tables<"asset_types">;

interface AssetTypeComboboxProps {
  value?: string | null | undefined;
  selectedUseCodes?: number[];
  onValueChange: (
    assetTypeSlug?: string | null,
    selectedUseCodes?: number[],
  ) => void;
  assetTypes: AssetType[];
  placeholder?: string;
  className?: string;
}

export function AssetTypeCombobox({
  value,
  selectedUseCodes = [],
  onValueChange,
  assetTypes,
  placeholder = "Select property type...",
  className,
}: AssetTypeComboboxProps) {
  const [open, setOpen] = useState(false);
  const [expandedAssetType, setExpandedAssetType] = useState<string | null>(
    null,
  );

  const selectedAssetType = assetTypes.find((type) => type.slug === value);

  const handleAssetTypeSelect = (assetTypeSlug: string, codes: number[]) => {
    if (value !== assetTypeSlug || selectedUseCodes.length === 0) {
      onValueChange(assetTypeSlug, codes);
    } else {
      onValueChange(null, []);
    }
  };

  const handleUseCodeSelect = (assetTypeSlug: string, useCode: number) => {
    if (assetTypeSlug !== value) {
      onValueChange(assetTypeSlug, [useCode]);
      return;
    }

    const newCodes = selectedUseCodes.includes(useCode)
      ? selectedUseCodes.filter((code) => code !== useCode)
      : [...selectedUseCodes, useCode];

    onValueChange(newCodes.length > 0 ? assetTypeSlug : null, newCodes);
  };

  const toggleAssetTypeExpansion = (assetTypeSlug: string) => {
    if (expandedAssetType === assetTypeSlug) {
      setExpandedAssetType(null);
    } else {
      setExpandedAssetType(assetTypeSlug);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-left font-normal",
            !selectedAssetType && "text-muted-foreground",
            className,
          )}
        >
          <div className="flex items-center gap-1">
            <span>
              {selectedAssetType ? selectedAssetType.name : placeholder}
            </span>
            {selectedUseCodes.length > 0 && (
              <Badge variant="secondary">
                {selectedUseCodes.length ===
                selectedAssetType?.use_codes?.length
                  ? "All"
                  : `${selectedUseCodes.length}/${selectedAssetType?.use_codes?.length}`}
              </Badge>
            )}
          </div>

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <ScrollArea className="h-[420px]">
          <div className="p-2">
            {assetTypes.map((assetType) => {
              const isExpanded = expandedAssetType === assetType.slug;

              const isSelected = value === assetType.slug;

              // Calculate checkbox state: checked, unchecked, or indeterminate
              const getCheckboxState = () => {
                if (!isSelected) return false;

                const totalUseCodes = assetType.use_codes?.length || 0;
                const selectedCount = selectedUseCodes.length;

                if (selectedCount === 0) return false;
                if (selectedCount === totalUseCodes) return true;
                return "indeterminate" as const;
              };

              const checkboxState = getCheckboxState();

              return (
                <div key={assetType.slug} className="mb-1">
                  <div className="flex items-center px-2 gap-2 rounded-md hover:bg-accent">
                    <Checkbox
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAssetTypeSelect(
                          assetType.slug!,
                          assetType.use_codes || [],
                        );
                      }}
                      checked={checkboxState}
                      className="h-4 w-4"
                    />
                    <button
                      type="button"
                      className="flex-1 flex items-center gap-2  py-2 text-left w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAssetTypeExpansion(assetType.slug!);
                      }}
                    >
                      <div className="flex flex-col flex-1">
                        <span className="text-sm font-medium">
                          {assetType.name}
                        </span>
                      </div>

                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {isExpanded &&
                    assetType.use_codes &&
                    assetType.use_codes.length > 0 && (
                      <div className="ml-6 mt-1 space-y-1 border-l border-border pl-4">
                        {assetType.use_codes.map((useCode) => {
                          const isCodeSelected =
                            selectedUseCodes.includes(useCode);
                          const codeDescription = getUseCodeName(useCode);

                          return (
                            <button
                              key={useCode}
                              type="button"
                              className="flex items-center gap-2 py-1 px-2 rounded-sm hover:bg-accent w-full text-left"
                              onClick={() =>
                                handleUseCodeSelect(assetType.slug!, useCode)
                              }
                            >
                              <Checkbox
                                checked={isCodeSelected}
                                className="flex-shrink-0"
                              />

                              <span className="text-sm">{codeDescription}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
