"use client";

import { parsers } from "@/lib/nuqs/property-search-params";
import type { GetPropertySearchParams } from "@v1/property-data/types";
import type { Tables } from "@v1/supabase/types";
import { Label } from "@v1/ui/label";
import { Switch } from "@v1/ui/switch";
import { useQueryStates } from "nuqs";
import { AddLocationsButton } from "./add-locations-button";
import { LicenseFiltersInfo } from "./license-filters-info";
import { LicensesCombobox } from "./licenses-combobox";

interface PropertySearchFiltersProps {
  licenses: Tables<"user_licenses">[];
  assetType: string;
  assetTypeName: string;
  searchParams: GetPropertySearchParams | null;
}

export function PropertySearchFilters({
  licenses,
  assetType,
  assetTypeName,
  searchParams,
}: PropertySearchFiltersProps) {
  const [state, setState] = useQueryStates(parsers, { shallow: false });

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex-1">
        <div className="flex max-w-4xl flex-col sm:flex-row gap-4 items-end ">
          <div className="w-full sm:max-w-md">
            <LicensesCombobox
              value={state.locations}
              onValueChange={(value) =>
                setState({
                  locations: value,
                })
              }
              licenses={licenses}
              className="h-12 text-base"
            />
          </div>
          <AddLocationsButton
            assetType={assetType}
            assetTypeName={assetTypeName}
            existingLicenses={licenses}
          />
          <LicenseFiltersInfo searchParams={searchParams} />
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
