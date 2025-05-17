"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Tables } from "@v1/supabase/types";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import { Calendar } from "@v1/ui/calendar";
import { cn } from "@v1/ui/cn";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@v1/ui/collapsible";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@v1/ui/form";
import { Input } from "@v1/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@v1/ui/popover";
import { Slider } from "@v1/ui/slider";
import { format } from "date-fns";
import {
  BuildingIcon,
  CalendarIcon,
  FilterIcon,
  MapPinIcon,
  SearchIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SavedLocationsSelector } from "../saved-locations-selector";

// Define the schema for the filter form
const filterSchema = z
  .object({
    locations: z.array(z.custom<Tables<"user_locations">>()).min(1),
    buildingSizeMin: z.coerce
      .number()
      .min(0, "Must be a positive number")
      .optional(),
    buildingSizeMax: z.coerce
      .number()
      .min(0, "Must be a positive number")
      .optional(),
    lotSizeMin: z.coerce
      .number()
      .min(0, "Must be a positive number")
      .optional(),
    lotSizeMax: z.coerce
      .number()
      .min(0, "Must be a positive number")
      .optional(),
    lastSaleDate: z.date().optional(),
    yearBuiltMin: z.coerce
      .number()
      .min(1800, "Year must be after 1800")
      .max(
        new Date().getFullYear(),
        `Year must be before ${new Date().getFullYear() + 1}`,
      )
      .optional(),
    yearBuiltMax: z.coerce
      .number()
      .min(1800, "Year must be after 1800")
      .max(
        new Date().getFullYear(),
        `Year must be before ${new Date().getFullYear() + 1}`,
      )
      .optional(),
  })
  .refine(
    (data) => {
      // If both min and max are provided, ensure min <= max
      if (data.buildingSizeMin && data.buildingSizeMax) {
        return data.buildingSizeMin <= data.buildingSizeMax;
      }
      return true;
    },
    {
      message: "Minimum building size must be less than or equal to maximum",
      path: ["buildingSizeMin"],
    },
  )
  .refine(
    (data) => {
      // If both min and max are provided, ensure min <= max
      if (data.lotSizeMin && data.lotSizeMax) {
        return data.lotSizeMin <= data.lotSizeMax;
      }
      return true;
    },
    {
      message: "Minimum lot size must be less than or equal to maximum",
      path: ["lotSizeMin"],
    },
  )
  .refine(
    (data) => {
      // If both min and max are provided, ensure min <= max
      if (data.yearBuiltMin && data.yearBuiltMax) {
        return data.yearBuiltMin <= data.yearBuiltMax;
      }
      return true;
    },
    {
      message: "Minimum year built must be less than or equal to maximum",
      path: ["yearBuiltMin"],
    },
  );

type FilterFormValues = z.infer<typeof filterSchema>;

interface PropertyFiltersFormProps {
  savedLocations: Tables<"user_locations">[];
  onApplyFilters: (filters: FilterFormValues) => void;
}

export function PropertyFiltersForm({
  savedLocations,
  onApplyFilters,
}: PropertyFiltersFormProps) {
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
  });

  function onSubmit(data: FilterFormValues) {
    onApplyFilters(data);
  }

  const selectedLocations = form.watch("locations");

  const activeFilterCount = Object.keys(form.getValues()).reduce((acc, key) => {
    if (key === "locations") return acc;
    if (form.getValues(key as keyof FilterFormValues)) return acc + 1;
    return acc;
  }, 0);

  return (
    <>
      <div className="flex items-center text-sm text-muted-foreground mt-1">
        <span>Properties in</span>

        <div className="flex flex-wrap gap-1 ml-2">
          {selectedLocations?.map((location) => (
            <Badge
              key={location.id}
              variant="outline"
              className="bg-accent/20 text-accent-foreground hover:bg-accent/20 border-accent/30 flex items-center gap-1"
            >
              {location.type === "city" ? (
                <BuildingIcon className="h-3 w-3" />
              ) : (
                <MapPinIcon className="h-3 w-3" />
              )}
              {location.display_name}
            </Badge>
          ))}
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
        <div className="bg-card rounded-md p-4 space-y-4 shadow-sm border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="locations"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SavedLocationsSelector
                        options={savedLocations}
                        onValueChange={field.onChange}
                        value={field.value ?? []}
                        maxSelections={3}
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
                      name="buildingSizeMin"
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
                      name="buildingSizeMax"
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

                {/* Lot Size */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Lot Size (sq ft)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="lotSizeMin"
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
                      name="lotSizeMax"
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

                {/* Last Sale Date */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Last Sale Date</h3>
                  <FormField
                    control={form.control}
                    name="lastSaleDate"
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
                                date > new Date() ||
                                date < new Date("1900-01-01")
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

                {/* Year Built */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Year Built</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="yearBuiltMin"
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
                      name="yearBuiltMax"
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
                  type="submit"
                  variant="default"
                  className="flex items-center gap-2"
                  disabled={!form.formState.isValid}
                >
                  <SearchIcon className="h-4 w-4 mr-1" />
                  Search Properties
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </CollapsibleContent>
    </>
  );
}
