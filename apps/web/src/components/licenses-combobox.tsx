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
import {
  BuildingIcon,
  Check,
  ChevronsUpDown,
  MapPinIcon,
  X,
} from "lucide-react";
import { useState } from "react";

interface LicensesComboboxProps {
  value?: string[];
  onValueChange: (internalIds: string[]) => void;
  licenses: Tables<"location_licenses">[];
  placeholder?: string;
  className?: string;
}

export function LicensesCombobox({
  value = [],
  onValueChange,
  licenses,
  placeholder = "Search for cities or counties...",
  className,
}: LicensesComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSelect = (license: Tables<"location_licenses">) => {
    const isSelected = value.includes(license.location_internal_id!);
    const newValue = isSelected
      ? value.filter((id) => id !== license.location_internal_id)
      : [...value, license.location_internal_id];
    onValueChange(newValue as string[]);
  };

  const isSelected = (license: Tables<"location_licenses">) =>
    value.includes(license.location_internal_id!);

  const removeLicense = (
    licenseToRemove: Tables<"location_licenses">,
    e: React.MouseEvent,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const newValue = value.filter(
      (id) => id !== licenseToRemove.location_internal_id,
    );
    onValueChange(newValue);
  };

  // Get selected licenses for display
  const selectedLicenses = licenses.filter((license) =>
    value.includes(license.location_internal_id || ""),
  );

  // Filter licenses based on search query
  const filteredLicenses = licenses.filter((license) =>
    license.location_formatted?.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-left font-normal min-h-[2.5rem]",
            value.length === 0 && "text-muted-foreground",
            value.length > 0 && "h-auto py-2",
            className,
          )}
        >
          <div className="flex flex-wrap gap-1 flex-1 min-w-0">
            {value.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <>
                {selectedLicenses.map((license) => (
                  <div
                    key={license.location_internal_id}
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-secondary text-secondary-foreground",
                    )}
                  >
                    <span className="max-w-[120px] truncate">
                      {license.location_formatted}
                    </span>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={(e) => removeLicense(license, e)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          removeLicense(
                            license,
                            e as unknown as React.MouseEvent<HTMLDivElement>,
                          );
                        }
                      }}
                      className="hover:bg-secondary-foreground/20 rounded-sm p-0.5 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type to search locations..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {filteredLicenses.length === 0 && query && (
              <CommandEmpty>No locations found.</CommandEmpty>
            )}
            {filteredLicenses.length === 0 && !query && (
              <CommandEmpty>Start typing to search for locations.</CommandEmpty>
            )}

            {filteredLicenses.length > 0 && (
              <>
                {/* Cities Group */}
                {filteredLicenses.filter(
                  (license) => license.location_type === "city",
                ).length > 0 && (
                  <CommandGroup>
                    <div className="bg-secondary text-secondary-foreground flex items-center gap-2 px-2 py-1.5 text-xs font-medium">
                      <BuildingIcon className="h-3 w-3" />
                      Cities
                    </div>
                    {filteredLicenses
                      .filter((license) => license.location_type === "city")
                      .map((license) => (
                        <CommandItem
                          key={license.location_internal_id}
                          value={license.location_internal_id || undefined}
                          onSelect={() => handleSelect(license)}
                          className={cn("flex items-center gap-2")}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              isSelected(license) ? "opacity-100" : "opacity-0",
                            )}
                          />
                          <span>{license.location_formatted}</span>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}

                {/* Counties Group */}
                {filteredLicenses.filter(
                  (license) => license.location_type === "county",
                ).length > 0 && (
                  <CommandGroup>
                    <div className="bg-secondary text-secondary-foreground flex items-center gap-2 px-2 py-1.5 text-xs font-medium">
                      <MapPinIcon className="h-3 w-3" />
                      Counties
                    </div>
                    {filteredLicenses
                      .filter((license) => license.location_type === "county")
                      .map((license) => (
                        <CommandItem
                          key={license.location_internal_id}
                          value={license.location_internal_id || undefined}
                          onSelect={() => handleSelect(license)}
                          className={cn("flex items-center gap-2")}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              isSelected(license) ? "opacity-100" : "opacity-0",
                            )}
                          />
                          <span>{license.location_formatted}</span>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
