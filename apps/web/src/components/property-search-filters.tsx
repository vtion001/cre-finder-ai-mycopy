"use client";

import { parseLocationCode } from "@/lib/format";
import { parsers } from "@/lib/nuqs/property-search-params";
import type { Tables } from "@v1/supabase/types";
import { Label } from "@v1/ui/label";
import { Switch } from "@v1/ui/switch";
import { useQueryStates } from "nuqs";
import { AssetTypeCombobox } from "./asset-type-combobox";
import { MultiLocationCombobox } from "./multi-location-combobox";

interface PropertySearchFiltersProps {
  assetTypes: Tables<"asset_types">[];
}

export function PropertySearchFilters({
  assetTypes,
}: PropertySearchFiltersProps) {
  const [state, setState] = useQueryStates(parsers, { shallow: false });

  const formattedLocations = state.locations.map((internal_id) => {
    const { state, city, county } = parseLocationCode(internal_id);

    return {
      title: county || city!,
      type: county ? "county" : ("city" as "city" | "county"),
      internal_id,
      state_code: state,
      display_name: `${city || county}, ${state}`,
    };
  });

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex-1">
        <div className="flex max-w-4xl flex-col sm:flex-row gap-4 items-end ">
          <div className="w-full sm:w-64">
            <AssetTypeCombobox
              value={state.asset_type}
              onValueChange={(value) => setState({ asset_type: value })}
              assetTypes={assetTypes}
              placeholder="Select Property Type"
              className="h-12 text-base"
            />
          </div>
          <div className="flex-1">
            <MultiLocationCombobox
              value={formattedLocations}
              onValueChange={(value) =>
                setState({ locations: value.map((loc) => loc.internal_id) })
              }
              placeholder="Search cities or counties..."
              className="h-12 text-base"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Label htmlFor="show-map" className="text-sm font-medium">
            Map
          </Label>
          <Switch
            id="show-map"
            checked={state.map}
            onCheckedChange={(value) => setState({ map: value })}
          />
        </div>
      </div>
    </div>
  );
}
