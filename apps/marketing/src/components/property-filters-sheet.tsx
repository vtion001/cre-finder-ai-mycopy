"use client";

import { FilterActions } from "@/components/filter-actions";
import { InlineDateFilter } from "@/components/inline-date-filter";
import { InlineRangeFilter } from "@/components/inline-range-filter";
import { Button } from "@v1/ui/button";
import { Checkbox } from "@v1/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@v1/ui/form";
import { Label } from "@v1/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@v1/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@v1/ui/sheet";
import { ChevronDownIcon, FilterIcon } from "lucide-react";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

interface PropertyFiltersSheetProps {
  onReset: () => void;
  className?: string;
}

export function PropertyFiltersSheet({
  onReset,
  className,
}: PropertyFiltersSheetProps) {
  const [open, setOpen] = useState(false);
  const { control } = useFormContext();

  // Watch all filter values for reactive updates
  const watchedValues = useWatch({
    control,
    name: [
      "building_size_min",
      "building_size_max",
      "lot_size_min",
      "lot_size_max",
      "last_sale_year",
      "last_sale_month",
      "year_min",
      "year_max",
      "loan_paid_off_percent_min",
      "loan_paid_off_percent_max",
      "number_of_units",
      "mortgage_free_and_clear",
      "tax_delinquent_year_min",
      "tax_delinquent_year_max",
      "asset_type_slug",
    ],
  });

  const [
    building_size_min,
    building_size_max,
    lot_size_min,
    lot_size_max,
    last_sale_year,
    last_sale_month,
    year_min,
    year_max,
    loan_paid_off_percent_min,
    loan_paid_off_percent_max,
    number_of_units,
    mortgage_free_and_clear,
    tax_delinquent_year_min,
    tax_delinquent_year_max,
    asset_type_slug,
  ] = watchedValues;

  // Check if any filters are active
  const hasActiveFilters = () => {
    return !!(
      building_size_min ||
      building_size_max ||
      lot_size_min ||
      lot_size_max ||
      last_sale_year ||
      last_sale_month ||
      year_min ||
      year_max ||
      loan_paid_off_percent_min ||
      loan_paid_off_percent_max ||
      number_of_units ||
      mortgage_free_and_clear ||
      tax_delinquent_year_min ||
      tax_delinquent_year_max
    );
  };

  // Get active filters count for display
  const getActiveFiltersCount = () => {
    let count = 0;
    if (building_size_min || building_size_max) count++;
    if (lot_size_min || lot_size_max) count++;
    if (last_sale_year && last_sale_month) count++;
    if (year_min || year_max) count++;
    if (loan_paid_off_percent_min || loan_paid_off_percent_max) count++;
    if (number_of_units) count++;
    if (mortgage_free_and_clear) count++;
    if (tax_delinquent_year_min || tax_delinquent_year_max) count++;
    return count;
  };

  // Helper function to check if current asset type is multi-family
  const isMultiFamilyAssetType = () => {
    return asset_type_slug === "multi-family";
  };

  return (
    <div className={className}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            type="button"
            className={`h-12 px-4 gap-2 ${
              hasActiveFilters()
                ? "border-primary text-primary bg-primary/5"
                : ""
            }`}
          >
            <FilterIcon className="h-4 w-4" />
            <span>
              {hasActiveFilters() ? (
                <span className="bg-primary rounded-full text-primary-foreground text-xs font-medium px-1.5">
                  {getActiveFiltersCount()}
                </span>
              ) : (
                ""
              )}
            </span>
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Search Filters</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-4">
            <InlineRangeFilter
              control={control}
              minFieldName="building_size_min"
              maxFieldName="building_size_max"
              label="Building Size (sq ft)"
              minPlaceholder="Min"
              maxPlaceholder="Max"
            />

            <InlineRangeFilter
              control={control}
              minFieldName="lot_size_min"
              maxFieldName="lot_size_max"
              label="Lot Size (sq ft)"
              minPlaceholder="Min"
              maxPlaceholder="Max"
            />

            <InlineDateFilter
              control={control}
              yearFieldName="last_sale_year"
              monthFieldName="last_sale_month"
              label="Last Sale Date"
            />

            <InlineRangeFilter
              control={control}
              minFieldName="year_min"
              maxFieldName="year_max"
              label="Year Built"
              minValue={1800}
              maxValue={new Date().getFullYear()}
              minPlaceholder="Min Year"
              maxPlaceholder="Max Year"
            />

            <InlineRangeFilter
              control={control}
              minFieldName="loan_paid_off_percent_min"
              maxFieldName="loan_paid_off_percent_max"
              label="Loan Paid Off %"
              minValue={0}
              maxValue={100}
              minPlaceholder="Min %"
              maxPlaceholder="Max %"
            />

            <InlineRangeFilter
              control={control}
              minFieldName="tax_delinquent_year_min"
              maxFieldName="tax_delinquent_year_max"
              label="Tax Delinquent Year"
              minValue={1900}
              maxValue={new Date().getFullYear()}
              minPlaceholder="Min Year"
              maxPlaceholder="Max Year"
            />

            {isMultiFamilyAssetType() && (
              <FormField
                control={control}
                name="number_of_units"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Units</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value || ""}
                        onValueChange={(value) =>
                          field.onChange(value === "" ? undefined : value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit count" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2-4">2-4 Units</SelectItem>
                          <SelectItem value="5+">5+ Units</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={control}
              name="mortgage_free_and_clear"
              render={({ field }) => (
                <FormItem className="py-4 px-2 flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <Label className="text-sm font-medium">
                      Mortgage Free & Clear
                    </Label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <SheetFooter className="mt-12">
            <FilterActions onReset={onReset} onApply={() => setOpen(false)} />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
