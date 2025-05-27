"use client";

import { searchFiltersSchema } from "@/actions/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconFilterX, IconSearch } from "@tabler/icons-react";
import type { Tables } from "@v1/supabase/types";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import { Calendar } from "@v1/ui/calendar";
import { cn } from "@v1/ui/cn";
import { CollapsibleContent } from "@v1/ui/collapsible";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@v1/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@v1/ui/popover";
import { format } from "date-fns";
import { BuildingIcon, CalendarIcon, MapPinIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { AssetTypeSelector } from "../asset-type-selector";
import { SavedLocationsSelector } from "../saved-locations-selector";
import { RangeSliderField } from "./range-slider-field";

type FilterFormValues = z.infer<typeof searchFiltersSchema>;
interface SearchFiltersFormProps {
  intialValues?: FilterFormValues;
  assetTypes: Tables<"asset_types">[];
  savedLocations: Tables<"user_locations">[];
  onSubmit: (filters: FilterFormValues) => void;
}

export function SearchFiltersForm({
  intialValues,
  assetTypes,
  savedLocations,
  onSubmit,
}: SearchFiltersFormProps) {
  const form = useForm<FilterFormValues>({
    mode: "onChange",
    resolver: zodResolver(searchFiltersSchema),
    values: intialValues,
    defaultValues: {
      asset_type_id: intialValues?.asset_type_id ?? assetTypes[0]?.id,
    },
  });

  function handleSubmit(data: FilterFormValues) {
    onSubmit({
      ...data,
    });
  }

  const locationId = form.watch("location_id");
  const assetTypeId = form.watch("asset_type_id");

  const selectedLocation = savedLocations.find(
    (location) => location.id === locationId,
  );

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
            {selectedLocation && (
              <Badge
                key={selectedLocation.id}
                variant="outline"
                className="bg-accent/20 text-accent-foreground hover:bg-accent/20 border-accent/30 flex items-center gap-1"
              >
                {selectedLocation.type === "city" ? (
                  <BuildingIcon className="h-3 w-3" />
                ) : (
                  <MapPinIcon className="h-3 w-3" />
                )}
                {selectedLocation.display_name}
              </Badge>
            )}
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
          <div className="bg-card rounded-md p-4 space-y-6 shadow-sm border">
            <FormField
              control={form.control}
              name="location_id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SavedLocationsSelector
                      options={savedLocations}
                      onValueChange={(values) => field.onChange(values?.at(0))}
                      value={field.value ? [field.value] : []}
                      maxSelections={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                <FormField
                  control={form.control}
                  name="last_sale_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-4  ">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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

            <div className="mt-4 flex justify-end">
              <Button
                size="lg"
                type="reset"
                variant="outline"
                className="mr-2"
                disabled={!form.formState.isDirty}
                onClick={() => form.reset()}
              >
                <IconFilterX className="h-4 w-4 " />
                Clear
              </Button>
              <Button
                size="lg"
                type="submit"
                variant="default"
                className="flex items-center gap-2"
                disabled={!form.formState.isValid}
              >
                <IconSearch className="h-4 w-4 " />
                Search Properties
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </form>
    </Form>
  );
}
