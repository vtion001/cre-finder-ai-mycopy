"use client";

import { IconInfoCircleFilled } from "@tabler/icons-react";
import type { GetPropertySearchParams } from "@v1/property-data/types";
import { Button } from "@v1/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@v1/ui/popover";
import { formatSearchParams } from "@v1/utils/format";
import { ChevronDownIcon, FilterIcon } from "lucide-react";

interface LicenseFiltersInfoProps {
  searchParams: GetPropertySearchParams | null;
  className?: string;
}

export function LicenseFiltersInfo({
  searchParams,
  className,
}: LicenseFiltersInfoProps) {
  // Don't render if no search params
  if (!searchParams) {
    return null;
  }

  const hasFilters = !!(
    searchParams.building_size_min ||
    searchParams.building_size_max ||
    searchParams.lot_size_min ||
    searchParams.lot_size_max ||
    searchParams.last_sale_date ||
    searchParams.year_min ||
    searchParams.year_max ||
    searchParams.loan_paid_off_percent_min ||
    searchParams.loan_paid_off_percent_max ||
    searchParams.number_of_units ||
    searchParams.mortgage_free_and_clear ||
    searchParams.tax_delinquent_year_min ||
    searchParams.tax_delinquent_year_max
  );

  // Don't render if no filters are set
  if (!hasFilters) {
    return null;
  }

  const formattedFilters = formatSearchParams(searchParams);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          type="button"
          className="h-12 px-4 gap-2 border-muted-foreground/20 text-muted-foreground hover:text-foreground"
        >
          <IconInfoCircleFilled className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Active Search Filters</h4>
            <p className="text-xs text-muted-foreground mb-3">
              These filters are applied to all property searches for this asset
              type.
            </p>
          </div>

          <div className="p-3 rounded-md bg-muted/50 border border-border/50">
            <ul className="text-sm text-foreground">
              {formattedFilters?.map((filter) => (
                <li key={filter} className="mb-2">
                  {filter}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-xs text-muted-foreground">
            Filters were set when the license was first created and cannot be
            modified.
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
