"use client";

import { PropertyFiltersSheet } from "@/components/filters/property-filters-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchFiltersSchema } from "@v1/trpc/schema";
import { Button } from "@v1/ui/button";
import { Form, FormControl, FormField, FormItem } from "@v1/ui/form";
import { Input } from "@v1/ui/input";
import { Label } from "@v1/ui/label";
import { parsers } from "@v1/utils/nuqs/property-search-params";
import { SearchIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useForm } from "react-hook-form";
import { z } from "zod";

type PropertyRecordsFilterFormValues = z.infer<typeof searchFiltersSchema> & {
  q?: string;
};

interface PropertyRecordsFilterFormProps {
  className?: string;
}

export function PropertyRecordsFilterForm({
  className,
}: PropertyRecordsFilterFormProps) {
  const [state, setState] = useQueryStates(parsers, { shallow: false });

  // Define the base default values for reset functionality
  const baseDefaultValues = {
    q: undefined,
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

  const form = useForm<PropertyRecordsFilterFormValues>({
    resolver: zodResolver(
      searchFiltersSchema.and(
        z.object({
          q: z.string().optional(),
        }),
      ),
    ),
    defaultValues: {
      q: state.q || "",
      ...baseDefaultValues,
      ...state.params,
    },
  });

  const handleSubmit = (values: PropertyRecordsFilterFormValues) => {
    const { q, ...params } = values;

    // Filter out undefined values
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined),
    );

    setState({
      q: q || null,
      params: Object.keys(filteredParams).length > 0 ? filteredParams : null,
      page: 1, // Reset to first page when filtering
    });
  };

  const clearFilters = () => {
    form.reset({
      q: "",
      ...baseDefaultValues,
    });

    setState({
      q: null,
      params: null,
      page: 1,
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit(handleSubmit)();
  };

  return (
    <div className={className}>
      <Form {...form}>
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          {/* Search Bar and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <Label htmlFor="search" className="text-sm font-medium">
                Search Properties
              </Label>
              <div className="relative mt-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <FormField
                  control={form.control}
                  name="q"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          id="search"
                          placeholder="Search by address..."
                          className="pl-10 h-12"
                          value={field.value || ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* More Filters Sheet */}
            <PropertyFiltersSheet onReset={clearFilters} />

            {/* Search Button */}
            <Button
              type="submit"
              size="lg"
              className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
            >
              Apply Filters
            </Button>
          </div>

          {/* Active Filters Display */}
          {(state.q || state.params) && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">
                Active filters:
              </span>

              {state.q && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                  Search: "{state.q}"
                </div>
              )}

              {state.params?.building_size_min && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                  Building Size: ≥
                  {state.params.building_size_min.toLocaleString()} sqft
                </div>
              )}

              {state.params?.building_size_max && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                  Building Size: ≤
                  {state.params.building_size_max.toLocaleString()} sqft
                </div>
              )}

              {state.params?.lot_size_min && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md">
                  Lot Size: ≥{state.params.lot_size_min.toLocaleString()} sqft
                </div>
              )}

              {state.params?.lot_size_max && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md">
                  Lot Size: ≤{state.params.lot_size_max.toLocaleString()} sqft
                </div>
              )}

              {state.params?.year_min && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-md">
                  Year Built: ≥{state.params.year_min}
                </div>
              )}

              {state.params?.year_max && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-md">
                  Year Built: ≤{state.params.year_max}
                </div>
              )}

              {state.params?.tax_delinquent_year_min && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 text-xs rounded-md">
                  Tax Delinquent: ≥{state.params.tax_delinquent_year_min}
                </div>
              )}

              {state.params?.tax_delinquent_year_max && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 text-xs rounded-md">
                  Tax Delinquent: ≤{state.params.tax_delinquent_year_max}
                </div>
              )}

              {state.params?.mortgage_free_and_clear && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-md">
                  Mortgage Free & Clear
                </div>
              )}

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear all
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
