"use client";

import { propertySearchSchema } from "@/actions/schema";
import { AssetTypeCombobox } from "@/components/asset-type-combobox";
import { MultiLocationCombobox } from "@/components/multi-location-combobox";
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
import { useForm } from "react-hook-form";
import type { z } from "zod";

type PreviewSearchFormValues = z.infer<typeof propertySearchSchema>;

interface PreviewSearchFormProps {
  assetTypes: Tables<"asset_types">[];
  onSubmit: (values: PreviewSearchFormValues) => void;
  className?: string;
}

export function PreviewSearchForm({
  assetTypes,
  onSubmit,
  className,
}: PreviewSearchFormProps) {
  const form = useForm<PreviewSearchFormValues>({
    resolver: zodResolver(propertySearchSchema),
    defaultValues: {},
  });

  const handleSubmit = (values: PreviewSearchFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={className}>
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
                      onValueChange={field.onChange}
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
  );
}
