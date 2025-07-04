"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { searchFiltersSchema } from "@v1/trpc/schema";
import { Button } from "@v1/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@v1/ui/form";
import { Input } from "@v1/ui/input";
import { Label } from "@v1/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@v1/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@v1/ui/select";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type SearchFiltersFormValues = z.infer<typeof searchFiltersSchema>;

export function PropertyFiltersForm() {
  // Form setup
  const form = useForm<SearchFiltersFormValues>({
    resolver: zodResolver(searchFiltersSchema),
    defaultValues: {
      building_size_min: undefined,
      building_size_max: undefined,
      lot_size_min: undefined,
      lot_size_max: undefined,
      last_sale_year: undefined,
      last_sale_month: undefined,
      year_min: undefined,
      year_max: undefined,
    },
  });

  // Watch form values for display
  const values = form.watch();

  const handleFiltersSubmit = (values: SearchFiltersFormValues) => {
    console.log("Filter values:", values);
  };

  const clearFilters = () => {
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFiltersSubmit)}>
        <div className="flex items-center gap-4 flex-wrap">
          {/* Building Size Filter */}
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-48 justify-between"
                  type="button"
                >
                  <span
                    className={
                      values.building_size_min || values.building_size_max
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    {values.building_size_min || values.building_size_max
                      ? `${values.building_size_min ? `${values.building_size_min.toLocaleString()}` : "0"}${values.building_size_max ? ` - ${values.building_size_max.toLocaleString()}` : "+"} sq ft`
                      : "Building Size"}
                  </span>
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Building Size Range</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="building_size_min"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Min"
                                type="number"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value === ""
                                      ? undefined
                                      : Number(e.target.value),
                                  )
                                }
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
                                placeholder="Max"
                                type="number"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value === ""
                                      ? undefined
                                      : Number(e.target.value),
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Lot Size Filter */}
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-48 justify-between"
                  type="button"
                >
                  <span
                    className={
                      values.lot_size_min || values.lot_size_max
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    {values.lot_size_min || values.lot_size_max
                      ? `${values.lot_size_min ? `${values.lot_size_min.toLocaleString()}` : "0"}${values.lot_size_max ? ` - ${values.lot_size_max.toLocaleString()}` : "+"} sq ft`
                      : "Lot Size"}
                  </span>
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Lot Size Range</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="lot_size_min"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Min"
                                type="number"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value === ""
                                      ? undefined
                                      : Number(e.target.value),
                                  )
                                }
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
                                placeholder="Max"
                                type="number"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value === ""
                                      ? undefined
                                      : Number(e.target.value),
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Last Sale Filter */}
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-48 justify-between"
                  type="button"
                >
                  <span
                    className={
                      values.last_sale_year && values.last_sale_month !== null
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    {values.last_sale_year &&
                    values.last_sale_month !== null &&
                    values.last_sale_month !== undefined
                      ? `Sold ${new Date(values.last_sale_year, values.last_sale_month).toLocaleDateString("en-US", { month: "short", year: "numeric" })}+`
                      : "Last Sale"}
                  </span>
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Last Sale Date</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="last_sale_month"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                value={field.value?.toString() ?? ""}
                                onValueChange={(value) =>
                                  field.onChange(
                                    value === "" ? undefined : Number(value),
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0">January</SelectItem>
                                  <SelectItem value="1">February</SelectItem>
                                  <SelectItem value="2">March</SelectItem>
                                  <SelectItem value="3">April</SelectItem>
                                  <SelectItem value="4">May</SelectItem>
                                  <SelectItem value="5">June</SelectItem>
                                  <SelectItem value="6">July</SelectItem>
                                  <SelectItem value="7">August</SelectItem>
                                  <SelectItem value="8">September</SelectItem>
                                  <SelectItem value="9">October</SelectItem>
                                  <SelectItem value="10">November</SelectItem>
                                  <SelectItem value="11">December</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="last_sale_year"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Year"
                                type="number"
                                min="1900"
                                max={new Date().getFullYear()}
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value === ""
                                      ? undefined
                                      : Number(e.target.value),
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Year Built Filter */}
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-48 justify-between"
                  type="button"
                >
                  <span
                    className={
                      values.year_min || values.year_max
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    {values.year_min || values.year_max
                      ? `Built ${values.year_min || ""}${values.year_min && values.year_max ? " - " : ""}${values.year_max || "+"}`
                      : "Year Built"}
                  </span>
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Year Built Range</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="year_min"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Min Year"
                                type="number"
                                min="1800"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(e.target.valueAsNumber)
                                }
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
                                placeholder="Max Year"
                                type="number"
                                min="1800"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(e.target.valueAsNumber)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="ghost" className="text-primary" type="submit">
              <CheckIcon className="!size-2.5" />
              Apply
            </Button>
            <Button type="button" variant="ghost" onClick={clearFilters}>
              <XIcon className="!size-3" />
              Reset
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
