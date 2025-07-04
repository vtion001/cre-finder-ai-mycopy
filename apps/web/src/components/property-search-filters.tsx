"use client";

import { IconMap2 } from "@tabler/icons-react";
import type { GetPropertySearchParams } from "@v1/property-data/types";
import type { Tables } from "@v1/supabase/types";
import { Button } from "@v1/ui/button";
import { cn } from "@v1/ui/cn";
import { Label } from "@v1/ui/label";
import { Switch } from "@v1/ui/switch";
import { parsers } from "@v1/utils/nuqs/property-search-params";
import { useQueryStates } from "nuqs";
import { AddLocationsButton } from "./add-locations-button";
import { LicenseFiltersInfo } from "./license-filters-info";
import { LicensesCombobox } from "./licenses-combobox";

interface PropertySearchFiltersProps {
  licenses: Tables<"location_licenses">[];
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
      <div className="flex-1 w-full">
        <div className="flex  flex-col sm:flex-row gap-4 items-end ">
          <div className="w-full sm:max-w-md">
            <LicensesCombobox
              placeholder="Select active locations..."
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

          <div className="flex items-center justify-end gap-3 w-full">
            <AddLocationsButton
              assetType={assetType}
              assetTypeName={assetTypeName}
              existingLicenses={licenses}
            />

            <LicenseFiltersInfo searchParams={searchParams} />
            <Button
              onClick={() => setState({ map: !state.map })}
              className={cn(
                "h-12 px-4 gap-2 border-muted-foreground/20 text-muted-foreground hover:text-foreground",
                state.map && "border-primary text-primary bg-primary/5",
              )}
              variant="outline"
            >
              <IconMap2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
