"use client";

import { propertySearchSchema } from "@/actions/schema";
import { AssetTypeCombobox } from "@/components/asset-type-combobox";
import { MultiLocationCombobox } from "@/components/multi-location-combobox";
import { parseLocationCode } from "@/lib/format";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowRight } from "@tabler/icons-react";
import type { Tables } from "@v1/supabase/types";
import { Button } from "@v1/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@v1/ui/form";
import Link from "next/link";
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type PropertySearchFormValues = z.infer<typeof propertySearchSchema>;

interface PreviewSearchInterfaceProps {
  assetTypes: Tables<"asset_types">[];
  combos: Tables<"user_licensed_combinations">[];
}

export function PreviewSearchInterface({
  assetTypes,
  combos,
}: PreviewSearchInterfaceProps) {
  const [_, setState] = useQueryStates({
    locations: parseAsArrayOf(parseAsString),
    asset_type: parseAsString,
  });

  const form = useForm<PropertySearchFormValues>({
    resolver: zodResolver(propertySearchSchema),
    defaultValues: {},
  });

  const handleSubmit = (values: PropertySearchFormValues) => {
    setState(
      {
        locations: values.locations.map((loc) => loc.internal_id),
        asset_type: values.asset_type_slug,
      },
      { shallow: false },
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-foreground mb-3">
          Find commercial real estate, faster.
        </h1>
      </div>

      {/* Search Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            {/* Location Search */}

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
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1">
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
                        className="h-12 text-base"
                      />
                    </FormControl>
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
      {combos.length > 0 && (
        <div className="mt-8 text-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            RECENT SEARCHES
          </h3>
          <div className="space-y-2 w-max mx-auto">
            {combos.map((combo) => {
              const l = parseLocationCode(combo.location_id!);
              const formattedLocation = `${l.city || l.county}, ${l.state}`;

              const href = `/dashboard/search?locations=${combo.location_id}&asset_type=${combo.asset_type_slugs?.[0]}`;

              return (
                <Link href={href} key={combo.license_id}>
                  <div className="group hover:underline text-sm text-muted-foreground flex items-center gap-1.5 ">
                    {formattedLocation} | {combo.asset_type_names?.[0]}
                    <IconArrowRight className="h-4 w-4 hidden group-hover:block" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
