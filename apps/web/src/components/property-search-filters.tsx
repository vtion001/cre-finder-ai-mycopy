"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconMap2 } from "@tabler/icons-react";
import type { GetPropertySearchParams } from "@v1/property-data/types";
import type { Tables } from "@v1/supabase/types";
import { propertySearchSchema, searchFiltersSchema } from "@v1/trpc/schema";
import { Button } from "@v1/ui/button";
import { cn } from "@v1/ui/cn";
import { Form } from "@v1/ui/form";
import { Label } from "@v1/ui/label";
import { Switch } from "@v1/ui/switch";
import { parsers } from "@v1/utils/nuqs/property-search-params";
import { useQueryStates } from "nuqs";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { AddLocationsButton } from "./add-locations-button";
import { PropertyFiltersSheet } from "./filters/property-filters-sheet";
import { LicenseFiltersInfo } from "./license-filters-info";
import { LicensesCombobox } from "./licenses-combobox";

type FormValues = z.infer<typeof searchFiltersSchema>;

interface PropertySearchFiltersProps {
  licenses: Tables<"location_licenses">[];
  assetType: string;
  assetTypeName: string;
  searchParams: GetPropertySearchParams | undefined;
}

export function PropertySearchFilters({
  licenses,
  assetType,
  assetTypeName,
  searchParams,
}: PropertySearchFiltersProps) {
  const [state, setState] = useQueryStates(parsers, { shallow: false });

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

  const form = useForm<FormValues>({
    resolver: zodResolver(searchFiltersSchema),
    // @ts-ignore
    defaultValues: baseDefaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    setState(
      {
        ...state,
        params: values,
      },
      { shallow: false },
    );
  };

  const clearFilters = () => {
    form.reset(baseDefaultValues);
  };

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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit, (error) =>
                  console.log(error),
                )}
              >
                <PropertyFiltersSheet
                  onReset={clearFilters}
                  onApply={() =>
                    form.handleSubmit(handleSubmit, (error) =>
                      console.log(error),
                    )()
                  }
                />
              </form>
            </Form>

            <AddLocationsButton
              assetType={assetType}
              assetTypeName={assetTypeName}
              existingLicenses={licenses}
            />

            <LicenseFiltersInfo searchParams={searchParams ?? null} />
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
