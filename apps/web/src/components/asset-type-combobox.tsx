"use client";

import type { Tables } from "@v1/supabase/types";
import { Button } from "@v1/ui/button";
import { cn } from "@v1/ui/cn";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@v1/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@v1/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

type AssetType = Tables<"asset_types">;

interface AssetTypeComboboxProps {
  value?: string | null | undefined;
  onValueChange: (assetTypeSlug: string) => void;
  assetTypes: AssetType[];
  placeholder?: string;
  className?: string;
}

export function AssetTypeCombobox({
  value,
  onValueChange,
  assetTypes,
  placeholder = "Select property type...",
  className,
}: AssetTypeComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedAssetType = assetTypes.find((type) => type.slug === value);

  const handleSelect = (assetTypeSlug: string) => {
    onValueChange(assetTypeSlug);
    setOpen(false);
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
          <span>
            {selectedAssetType ? selectedAssetType.name : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search property types..." />
          <CommandList>
            <CommandEmpty>No property type found.</CommandEmpty>
            <CommandGroup>
              {assetTypes.map((assetType) => (
                <CommandItem
                  key={assetType.slug}
                  value={assetType.name}
                  onSelect={() => handleSelect(assetType.slug!)}
                  className="flex items-center gap-2"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === assetType.slug ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{assetType.name}</span>
                    {assetType.description && (
                      <span className="text-xs text-muted-foreground">
                        {assetType.description}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
