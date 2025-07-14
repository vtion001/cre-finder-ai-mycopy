"use client";

import { AssetTypeCombobox } from "@/components/asset-type-combobox";
import { PropertyFiltersSheet } from "@/components/filters/property-filters-sheet";
import { MultiLocationCombobox } from "@/components/multi-location-combobox";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Tables } from "@v1/supabase/types";
import { propertySearchSchema } from "@v1/trpc/schema";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@v1/ui/form";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type PreviewSearchFormValues = z.infer<typeof propertySearchSchema>;

interface PreviewSearchFormProps {
  assetTypes: Tables<"asset_types">[];
  onSubmit: (values: PreviewSearchFormValues) => void;
  onReset?: () => void;
  className?: string;
  initialValues?: PreviewSearchFormValues;
  hideFilters?: boolean;
}

export function PreviewSearchForm({
  assetTypes,
  onSubmit,
  onReset,
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
    mortgage_free_and_clear: undefined,
    tax_delinquent_year_min: undefined,
    tax_delinquent_year_max: undefined,
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

    if (onReset) {
      onReset();
    }
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
                      selectedUseCodes={form.watch("use_codes")}
                      onValueChange={(assetTypeSlug, useCodes) => {
                        field.onChange(assetTypeSlug);
                        form.setValue("use_codes", useCodes);
                      }}
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

          {/* More Filters Sheet */}
          {!hideFilters && <PropertyFiltersSheet onReset={clearFilters} />}

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
