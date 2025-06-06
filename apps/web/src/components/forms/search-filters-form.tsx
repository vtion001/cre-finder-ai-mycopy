"use client";

import { searchFiltersSchema } from "@/actions/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconFilterX, IconSearch } from "@tabler/icons-react";
import type { Tables } from "@v1/supabase/types";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import { cn } from "@v1/ui/cn";
import { CollapsibleContent } from "@v1/ui/collapsible";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@v1/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@v1/ui/select";
import { BuildingIcon, MapPinIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { AssetTypeSelector } from "../asset-type-selector";
import { RangeSliderField } from "./range-slider-field";

type FilterFormValues = z.infer<typeof searchFiltersSchema>;

interface SearchFiltersFormProps {
  intialValues?: FilterFormValues;
  assetTypes: Tables<"asset_types">[];
  onSubmit: (filters: FilterFormValues) => void;
}

export function SearchFiltersForm({
  intialValues,
  assetTypes,
  onSubmit,
}: SearchFiltersFormProps) {
  const form = useForm<FilterFormValues>({
    mode: "onChange",
    resolver: zodResolver(searchFiltersSchema),
    values: intialValues,
    defaultValues: {
      last_sale_month: intialValues?.last_sale_month,
      last_sale_year: intialValues?.last_sale_year,
      asset_type_id: intialValues?.asset_type_id ?? assetTypes[0]?.id,
    },
  });

  function handleSubmit(data: FilterFormValues) {
    onSubmit({
      ...data,
    });
  }

  const assetTypeId = form.watch("asset_type_id");


  const assetType = assetTypes.find((type) => type.id === assetTypeId);

  const activeFilterCount = Object.keys(form.getValues()).reduce((acc, key) => {
    if (key === "location_id" || key === "asset_type_id") return acc;
    if (form.getValues(key as keyof FilterFormValues)) return acc + 1;
    return acc;
  }, 0);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="asset_type_id"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <AssetTypeSelector
                  options={assetTypes}
                  onValueChange={field.onChange}
                  value={field.value}
                  variant="compact"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <span>{assetType?.name} properties in</span>

          <div className="flex flex-wrap gap-1 ml-2">
          
            {activeFilterCount > 0 && (
              <Badge
                variant="outline"
                className="bg-primary/20 text-primary hover:bg-primary/20 border-primary/30"
              >
                +{activeFilterCount} filters
              </Badge>
            )}
          </div>
        </div>

        <CollapsibleContent className="mt-4">
          <div className="bg-card rounded-md p-3 sm:p-4 space-y-4 sm:space-y-6 shadow-sm border">
        

            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
              {/* Building Size */}
              <RangeSliderField
                control={form.control}
                minName="building_size_min"
                maxName="building_size_max"
                label="Building Size (sq ft)"
                min={0}
                max={50000}
                step={100}
                minPlaceholder="Min sq ft"
                maxPlaceholder="Max sq ft"
              />

              <RangeSliderField
                control={form.control}
                minName="lot_size_min"
                maxName="lot_size_max"
                label="Lot Size (sq ft)"
                min={0}
                max={100000}
                step={500}
                minPlaceholder="Min sq ft"
                maxPlaceholder="Max sq ft"
              />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Last Sale Date</h3>
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="last_sale_month"
                    render={({ field }) => {
                      const months = [
                        { value: 0, label: "January" },
                        { value: 1, label: "February" },
                        { value: 2, label: "March" },
                        { value: 3, label: "April" },
                        { value: 4, label: "May" },
                        { value: 5, label: "June" },
                        { value: 6, label: "July" },
                        { value: 7, label: "August" },
                        { value: 8, label: "September" },
                        { value: 9, label: "October" },
                        { value: 10, label: "November" },
                        { value: 11, label: "December" },
                      ];

                      return (
                        <FormItem>
                          <FormControl>
                            <Select
                              defaultValue={
                                field.value !== undefined
                                  ? field.value.toString()
                                  : ""
                              }
                              onValueChange={(value) =>
                                field.onChange(
                                  value ? Number.parseInt(value) : undefined,
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Month" />
                              </SelectTrigger>
                              <SelectContent>
                                {months.map((month) => (
                                  <SelectItem
                                    key={month.value}
                                    value={month.value.toString()}
                                  >
                                    {month.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="last_sale_year"
                    render={({ field }) => {
                      const currentYear = new Date().getFullYear();
                      const years = Array.from(
                        { length: currentYear - 1900 + 1 },
                        (_, i) => currentYear - i,
                      );

                      return (
                        <FormItem>
                          <FormControl>
                            <Select
                              value={field.value ? field.value.toString() : ""}
                              onValueChange={(value) =>
                                field.onChange(
                                  value ? Number.parseInt(value) : undefined,
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Year" />
                              </SelectTrigger>
                              <SelectContent>
                                {years.map((year) => (
                                  <SelectItem
                                    key={year}
                                    value={year.toString()}
                                  >
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </div>

              <RangeSliderField
                control={form.control}
                minName="year_min"
                maxName="year_max"
                label="Year Built"
                min={1900}
                max={new Date().getFullYear()}
                step={1}
                minPlaceholder="Min year"
                maxPlaceholder="Max year"
              />
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button
                size="lg"
                type="reset"
                variant="outline"
                className="w-full sm:w-auto"
                disabled={!form.formState.isDirty}
                onClick={() => form.reset()}
              >
                <IconFilterX className="h-4 w-4" />
                <span className="ml-2">Clear</span>
              </Button>
              <Button
                size="lg"
                type="submit"
                variant="default"
                className="flex items-center gap-2 w-full sm:w-auto"
                disabled={!form.formState.isValid}
              >
                <IconSearch className="h-4 w-4" />
                Search Properties
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </form>
    </Form>
  );
}
