"use client";

import { propertySearchSchema } from "@/actions/schema";
import { AssetTypeCombobox } from "@/components/asset-type-combobox";
import { FilterActions } from "@/components/filters/filter-actions";
import { InlineDateFilter } from "@/components/filters/inline-date-filter";
import { InlineRangeFilter } from "@/components/filters/inline-range-filter";
import { MultiLocationCombobox } from "@/components/multi-location-combobox";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Tables } from "@v1/supabase/types";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@v1/ui/form";
import { Label } from "@v1/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@v1/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@v1/ui/select";
import { ChevronDownIcon, FilterIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type PreviewSearchFormValues = z.infer<typeof propertySearchSchema>;

interface PreviewSearchFormProps {
  assetTypes: Tables<"asset_types">[];
  onSubmit: (values: PreviewSearchFormValues) => void;
  className?: string;
  initialValues?: PreviewSearchFormValues;
  hideFilters?: boolean;
}

export function PreviewSearchForm({
  assetTypes,
  onSubmit,
  className,
  initialValues,
  hideFilters = false,
}: PreviewSearchFormProps) {
  // Define the base default values for reset functionality
  const baseDefaultValues = {
    building_size_min: undefined,
    building_size_max: undefined,
    lot_size_min: undefined,
    lot_size_max: undefined,
    last_sale_year: undefined,
    last_sale_month: undefined,
    year_min: undefined,
    year_max: undefined,
    loan_paid_off_percent_min: undefined,
    loan_paid_off_percent_max: undefined,
    number_of_units: undefined,
  };

  const form = useForm<PreviewSearchFormValues>({
    resolver: zodResolver(propertySearchSchema),
    defaultValues: baseDefaultValues,
  });

  // Set initial values if provided, but don't make them the default values for reset
  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  const handleSubmit = (values: PreviewSearchFormValues) => {
    onSubmit(values);
  };

  const clearFilters = () => {
    // Reset only the filter fields to their base default values (undefined)
    // while preserving the main search fields (locations, asset_type_slug)
    const currentValues = form.getValues();
    form.reset({
      ...currentValues,
      ...baseDefaultValues,
    });
  };

  // Helper function to check if current asset type is multi-family
  const isMultiFamilyAssetType = () => {
    const currentAssetTypeSlug = form.watch("asset_type_slug");
    return currentAssetTypeSlug === "multi-family";
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    const values = form.getValues();
    return !!(
      values.building_size_min ||
      values.building_size_max ||
      values.lot_size_min ||
      values.lot_size_max ||
      values.last_sale_year ||
      values.last_sale_month ||
      values.year_min ||
      values.year_max ||
      values.loan_paid_off_percent_min ||
      values.loan_paid_off_percent_max ||
      values.number_of_units
    );
  };

  // Get active filters count for display
  const getActiveFiltersCount = () => {
    const values = form.getValues();
    let count = 0;
    if (values.building_size_min || values.building_size_max) count++;
    if (values.lot_size_min || values.lot_size_max) count++;
    if (values.last_sale_year && values.last_sale_month) count++;
    if (values.year_min || values.year_max) count++;
    if (values.loan_paid_off_percent_min || values.loan_paid_off_percent_max)
      count++;
    if (values.number_of_units) count++;
    return count;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={className}>
        {/* Main Search Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          {/* Asset Type Selection */}
          <div className="w-full sm:w-64">
            <FormField
              control={form.control}
              name="asset_type_slug"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AssetTypeCombobox
                      value={field.value}
                      onValueChange={field.onChange}
                      assetTypes={assetTypes}
                      placeholder="Select Property Type"
                      className="h-12 text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Location Search */}
          <div className="flex-1 w-full">
            <FormField
              control={form.control}
              name="locations"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiLocationCombobox
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Search cities or counties..."
                      className="h-12 text-base "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* More Filters Dropdown */}
          {!hideFilters && (
            <div>
              <Popover>
                <PopoverTrigger asChild>
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
                </PopoverTrigger>
                <PopoverContent className="w-96" align="end">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {/* Building Size Filter */}
                      <InlineRangeFilter
                        control={form.control}
                        minFieldName="building_size_min"
                        maxFieldName="building_size_max"
                        label="Building Size (sq ft)"
                        minPlaceholder="Min"
                        maxPlaceholder="Max"
                      />

                      {/* Lot Size Filter */}
                      <InlineRangeFilter
                        control={form.control}
                        minFieldName="lot_size_min"
                        maxFieldName="lot_size_max"
                        label="Lot Size (sq ft)"
                        minPlaceholder="Min"
                        maxPlaceholder="Max"
                      />

                      {/* Last Sale Filter */}
                      <InlineDateFilter
                        control={form.control}
                        yearFieldName="last_sale_year"
                        monthFieldName="last_sale_month"
                        label="Last Sale Date"
                      />

                      {/* Year Built Filter */}
                      <InlineRangeFilter
                        control={form.control}
                        minFieldName="year_min"
                        maxFieldName="year_max"
                        label="Year Built"
                        minValue={1800}
                        maxValue={new Date().getFullYear()}
                        minPlaceholder="Min Year"
                        maxPlaceholder="Max Year"
                      />

                      {/* Loan Paid Off Percentage Filter */}
                      <InlineRangeFilter
                        control={form.control}
                        minFieldName="loan_paid_off_percent_min"
                        maxFieldName="loan_paid_off_percent_max"
                        label="Loan Paid Off %"
                        minValue={0}
                        maxValue={100}
                        minPlaceholder="Min %"
                        maxPlaceholder="Max %"
                      />

                      {/* Number of Units Filter - Only for Multi-Family */}
                      {isMultiFamilyAssetType() && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Number of Units
                          </Label>
                          <FormField
                            control={form.control}
                            name="number_of_units"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Select
                                    value={field.value || ""}
                                    onValueChange={(value) =>
                                      field.onChange(
                                        value === "" ? undefined : value,
                                      )
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select unit count" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="2-4">
                                        2-4 Units
                                      </SelectItem>
                                      <SelectItem value="5+">
                                        5+ Units
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>

                    {/* Filter Actions */}
                    <div className="pt-4 border-t">
                      <FilterActions onReset={clearFilters} showApply={false} />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Search Button */}
          <Button
            type="submit"
            size="lg"
            disabled={!form.formState.isValid}
            className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-max"
          >
            Search
          </Button>
        </div>
      </form>
    </Form>
  );
}
