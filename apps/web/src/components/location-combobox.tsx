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
import { BuildingIcon, Check, ChevronsUpDown, MapPinIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import type { z } from "zod";

type Location = z.infer<typeof locationSchema>;

interface LocationComboboxProps {
  value?: Location;
  onValueChange: (location: Location | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function LocationCombobox({
  value,
  onValueChange,
  placeholder = "Search for a city or county...",
  className,
}: LocationComboboxProps) {
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
    onValueChange(location);
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
            !value && "text-muted-foreground",
            className,
          )}
        >
          {value ? (
            <div className="flex items-center gap-2">
              {value.type === "city" ? (
                <BuildingIcon className="h-4 w-4 text-primary" />
              ) : (
                <MapPinIcon className="h-4 w-4 text-accent-foreground" />
              )}
              <span>{value.display_name}</span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] max-h-[300px] p-0"
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
                              value?.internal_id === location.internal_id
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
                    <div className="flex items-center  gap-2 px-2 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground">
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
                              value?.internal_id === location.internal_id
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
