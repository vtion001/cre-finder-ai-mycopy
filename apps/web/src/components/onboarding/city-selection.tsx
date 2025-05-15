"use client";

import { getPlacesAction } from "@/actions/get-places-action";
import { saveUserCitiesAction } from "@/actions/save-user-locations-action";
import type { assetTypeSchema, placeSuggestionSchema } from "@/actions/schema";
import type { Tables } from "@v1/supabase/types";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@v1/ui/command";
import { Label } from "@v1/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@v1/ui/select";
import { useDebounce } from "@v1/ui/use-debounce";
import { PlusIcon, XIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { z } from "zod";

type PlaceSuggestion = z.infer<typeof placeSuggestionSchema>;
type AssetType = z.infer<typeof assetTypeSchema>;

export function CitySelection({
  assetTypes,
}: { assetTypes: Tables<"asset_types">[] }) {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [selectedCities, setSelectedCities] = useState<PlaceSuggestion[]>([]);
  const [selectedAssetType, setSelectedAssetType] = useState<string>("");

  const {
    execute: fetchPlaces,
    isPending: isLoadingPlaces,
    result: { data: placeSuggestions },
  } = useAction(getPlacesAction);

  const { executeAsync: saveUserCities, isPending: isSaving } =
    useAction(saveUserCitiesAction);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery?.trim()) {
      fetchPlaces({ query: debouncedQuery, countryCode: "US" });
    }
  }, [debouncedQuery, fetchPlaces]);

  const handleSelectCity = (city: PlaceSuggestion) => {
    // Check if city is already selected
    if (!selectedCities.some((c) => c.place_id === city.place_id)) {
      setSelectedCities([...selectedCities, city]);
    }
    setQuery("");
    setOpen(false);
  };

  const handleRemoveCity = (cityId: string) => {
    setSelectedCities(
      selectedCities.filter((city) => city.place_id !== cityId),
    );
  };

  const handleContinue = async () => {
    if (!selectedAssetType || selectedCities.length === 0) return;

    // todo
    // const result = await saveUserCities({
    //   cities: selectedCities,
    //   assetTypeId: selectedAssetType,
    //   revalidatePath: "/onboarding/complete",
    // });

    // if (result?.data?.success) {
    router.push("/onboarding/complete");
    // }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Select Your Target Cities</h1>
        <p className="text-muted-foreground mt-2">
          Choose the cities where you want to search for properties
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="asset-type">Asset Type</Label>
          <Select
            value={selectedAssetType}
            onValueChange={setSelectedAssetType}
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

        <div>
          <Label htmlFor="city-search">Cities</Label>
          <div className="mt-1">
            <Command
              shouldFilter={false}
              className="overflow-visible relative [&_[cmdk-input-wrapper]]:rounded-md [&_[cmdk-input-wrapper]]:border"
            >
              <CommandInput
                id="city-search"
                value={query}
                onValueChange={setQuery}
                onBlur={() => setOpen(false)}
                onFocus={() => setOpen(true)}
                placeholder="Search for a city..."
              />

              {open && query.trim() !== "" && (
                <div className="relative animate-in fade-in-0 zoom-in-95 h-auto">
                  <CommandList>
                    <div className="absolute top-1.5 z-50 w-full">
                      <CommandGroup className="relative h-auto z-50 min-w-[8rem] overflow-hidden rounded-md border shadow-md bg-background">
                        {isLoadingPlaces ? (
                          <div className="flex items-center flex-col justify-center space-y-2 py-4">
                            Searching...
                          </div>
                        ) : (
                          placeSuggestions?.map((prediction) => (
                            <CommandItem
                              value={prediction.description}
                              onSelect={() => handleSelectCity(prediction)}
                              className="flex select-text flex-col cursor-pointer gap-0.5 h-max p-2 px-3 rounded-md aria-selected:bg-accent aria-selected:text-accent-foreground hover:bg-accent hover:text-accent-foreground items-start"
                              key={prediction.place_id}
                              onMouseDown={(e) => e.preventDefault()}
                            >
                              {prediction.description}
                            </CommandItem>
                          ))
                        )}

                        {!isLoadingPlaces && placeSuggestions?.length === 0 && (
                          <CommandEmpty className="h-12 py-4 flex items-center justify-center">
                            No cities found
                          </CommandEmpty>
                        )}
                      </CommandGroup>
                    </div>
                  </CommandList>
                </div>
              )}
            </Command>
          </div>
        </div>

        <div className="mt-4">
          <Label>Selected Cities</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedCities.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No cities selected yet
              </div>
            ) : (
              selectedCities.map((city) => (
                <Badge
                  key={city.place_id}
                  variant="secondary"
                  className="flex items-center gap-1 py-1.5"
                >
                  {city.description}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                    onClick={() => handleRemoveCity(city.place_id)}
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                </Badge>
              ))
            )}
            {query.trim() !== "" && open && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setOpen(true)}
              >
                <PlusIcon className="h-3 w-3" />
                Add City
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={
            !selectedAssetType || selectedCities.length === 0 || isSaving
          }
          className="px-6"
        >
          {isSaving ? "Saving..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}
