"use client";

import { searchFiltersSchema } from "@/actions/schema";
import { parsers } from "@/lib/search/property-filters";
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
import { Input } from "@v1/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@v1/ui/popover";
import { useDebounce } from "@v1/ui/use-debounce";
import { format } from "date-fns";
import { BuildingIcon, CalendarIcon, MapPinIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { AssetTypeSelector } from "../asset-type-selector";
import { SavedLocationsSelector } from "../saved-locations-selector";

type FilterFormValues = z.infer<typeof searchFiltersSchema>;
interface SearchFiltersFormProps {
  assetTypes: Tables<"asset_types">[];
  savedLocations: Tables<"user_locations">[];
  onApplyFilters: (filters: FilterFormValues) => void;
}

export function SearchFiltersForm({
  assetTypes,
  savedLocations,
  onApplyFilters,
}: SearchFiltersFormProps) {
  const [values, setValues] = useQueryStates(parsers, {
    history: "push",
  });

  const defaultValues = {
    location_id: savedLocations[0]?.id,
    asset_type_id: assetTypes[0]?.id,
  };

  const form = useForm<FilterFormValues>({
    mode: "onChange",
    resolver: zodResolver(searchFiltersSchema),
    defaultValues: values.form
      ? {
          ...defaultValues,
          ...values.form,
        }
      : defaultValues,
  });

  const formValues = form.watch();

  useDebounce(formValues, 300, (debouncedValues) => {
    setValues({ form: debouncedValues });
  });

  function onSubmit(data: FilterFormValues) {
    onApplyFilters({
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
    if (key === "locations") return acc;
    if (form.getValues(key as keyof FilterFormValues)) return acc + 1;
    return acc;
  }, 0);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Building Size (sq ft)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="building_size_min"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Min sq ft"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="building_size_max"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Max sq ft"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Lot Size (sq ft)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="lot_size_min"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Min sq ft"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lot_size_max"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Max sq ft"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

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

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Year Built</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="year_min"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Min year"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="year_max"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Max year"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button
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
