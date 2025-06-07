"use client";

import { getRealEstateLocationsAction } from "@/actions/get-real-estate-locations-action";
import type { locationSchema } from "@/actions/schema";
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
import { useDebounce } from "@v1/ui/use-debounce";
import {
  BuildingIcon,
  Check,
  ChevronsUpDown,
  MapPinIcon,
  X,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import type { z } from "zod";

type Location = z.infer<typeof locationSchema>;

interface MultiLocationComboboxProps {
  value?: Location[];
  onValueChange: (locations: Location[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiLocationCombobox({
  value = [],
  onValueChange,
  placeholder = "Search for cities or counties...",
  className,
}: MultiLocationComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const {
    execute: fetchLocations,
    isPending: isLoading,
    result: { data: locations = [] },
  } = useAction(getRealEstateLocationsAction);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      fetchLocations({
        query: debouncedQuery,
        searchTypes: ["C", "N"], // Both cities and counties
      });
    }
  }, [debouncedQuery, fetchLocations]);

  const handleSelect = (location: Location) => {
    const isSelected = value.some(
      (loc) => loc.internal_id === location.internal_id,
    );
    const newValue = isSelected
      ? value.filter((loc) => loc.internal_id !== location.internal_id)
      : [...value, location];
    onValueChange(newValue);
  };

  const isSelected = (location: Location) =>
    value.some((loc) => loc.internal_id === location.internal_id);

  const removeLocation = (locationToRemove: Location, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newValue = value.filter(
      (loc) => loc.internal_id !== locationToRemove.internal_id,
    );
    onValueChange(newValue);
  };

  const clearAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onValueChange([]);
  };

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
                {value.map((location) => (
                  <div
                    key={location.internal_id}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs"
                  >
                    <span className="max-w-[120px] truncate">
                      {location.display_name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => removeLocation(location, e)}
                      className="hover:bg-secondary-foreground/20 rounded-sm p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {/* {value.length > 1 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-xs text-muted-foreground hover:text-foreground px-1"
                  >
                    Clear all
                  </button>
                )} */}
              </>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width]  p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type to search locations..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {isLoading && <CommandEmpty>Searching locations...</CommandEmpty>}
            {!isLoading && query && locations.length === 0 && (
              <CommandEmpty>No locations found.</CommandEmpty>
            )}
            {!isLoading && !query && (
              <CommandEmpty>Start typing to search for locations.</CommandEmpty>
            )}
            {/* {value.length > 0 && (
              <CommandGroup>
                <div className="bg-secondary text-secondary-foreground flex items-center gap-2 px-2 py-1.5 text-xs font-medium">
                  Selected Locations ({value.length})
                </div>
                {value.map((location) => (
                  <CommandItem
                    key={`selected-${location.internal_id}`}
                    onSelect={() => handleSelect(location)}
                    className="flex items-center gap-2 bg-accent/50"
                  >
                    <Check className="mr-2 h-4 w-4 opacity-100" />
                    {location.type === "city" ? (
                      <BuildingIcon className="h-4 w-4 text-primary" />
                    ) : (
                      <MapPinIcon className="h-4 w-4 text-accent-foreground" />
                    )}
                    <span>{location.display_name}</span>
                  </CommandItem>
                ))}
                <CommandItem
                  onSelect={() => onValueChange([])}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear all selections
                </CommandItem>
              </CommandGroup>
            )} */}
            {locations.length > 0 && (
              <>
                {/* Cities Group */}
                {locations.filter((loc) => loc.type === "city").length > 0 && (
                  <CommandGroup>
                    <div className="bg-secondary text-secondary-foreground flex items-center gap-2 px-2 py-1.5 text-xs font-medium ">
                      <BuildingIcon className="h-3 w-3" />
                      Cities
                    </div>
                    {locations
                      .filter((loc) => loc.type === "city")
                      .map((location) => (
                        <CommandItem
                          key={location.internal_id}
                          value={location.internal_id}
                          onSelect={() => handleSelect(location)}
                          className="flex items-center gap-2"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              isSelected(location)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          <span>{location.display_name}</span>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}

                {/* Counties Group */}
                {locations.filter((loc) => loc.type === "county").length >
                  0 && (
                  <CommandGroup>
                    <div className="bg-secondary text-secondary-foreground flex items-center gap-2 px-2 py-1.5 text-xs font-medium ">
                      <MapPinIcon className="h-3 w-3" />
                      Counties
                    </div>
                    {locations
                      .filter((loc) => loc.type === "county")
                      .map((location) => (
                        <CommandItem
                          key={location.internal_id}
                          value={location.internal_id}
                          onSelect={() => handleSelect(location)}
                          className="flex items-center gap-2"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              isSelected(location)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          <span>{location.display_name}</span>
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
