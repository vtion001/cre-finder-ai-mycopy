"use client";

import { propertySearchSchema } from "@/actions/schema";
import { AssetTypeCombobox } from "@/components/asset-type-combobox";
import { LocationCombobox } from "@/components/location-combobox";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Tables } from "@v1/supabase/types";
import { Button } from "@v1/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@v1/ui/form";
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type PropertySearchFormValues = z.infer<typeof propertySearchSchema>;

interface PreviewSearchInterfaceProps {
  assetTypes: Tables<"asset_types">[];
}

export function PreviewSearchInterface({
  assetTypes,
}: PreviewSearchInterfaceProps) {
  const [state, setState] = useQueryStates({
    location: parseAsString,
    asset_types: parseAsArrayOf(parseAsString),
  });

  const form = useForm<PropertySearchFormValues>({
    resolver: zodResolver(propertySearchSchema),
    defaultValues: {},
  });

  const handleSubmit = (values: PropertySearchFormValues) => {
    setState(
      {
        location: values.location.internal_id,
        asset_types: values.asset_type_slugs,
      },
      { shallow: false },
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Find commercial real estate, faster.
        </h1>
      </div>

      {/* Search Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            {/* Location Search */}
            <div className="flex-1">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <LocationCombobox
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Search city or county..."
                        className="h-12 text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Asset Type Selection */}
            <div className="w-full sm:w-64">
              <FormField
                control={form.control}
                name="asset_type_slugs"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <AssetTypeCombobox
                        value={field.value}
                        onValueChange={field.onChange}
                        assetTypes={assetTypes}
                        placeholder="All Property Types"
                        className="h-12 text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Search Button */}
            <Button
              type="submit"
              size="lg"
              disabled={!form.formState.isValid}
              className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Search
            </Button>
          </div>
        </form>
      </Form>

      {/* Recent Searches Section */}
      <div className="mt-12 text-center">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          RECENT SEARCHES
        </h3>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Greenville, SC, USA | All Property Types
          </div>
          <div className="text-sm text-muted-foreground">
            Dallas, TX, USA | Office Buildings
          </div>
          <div className="text-sm text-muted-foreground">
            Miami, FL, USA | Retail Properties
          </div>
          <div className="text-sm text-muted-foreground">
            Austin, TX, USA | Industrial
          </div>
          <div className="text-sm text-muted-foreground">
            All Property Types | Nationwide Search
          </div>
        </div>
      </div>
    </div>
  );
}
