"use client";

import type { propertySearchSchema } from "@/actions/schema";
import { parsers } from "@/lib/nuqs/property-search-params";
import { codes } from "@/lib/use-codes";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import type { Tables } from "@v1/supabase/types";
import { Switch } from "@v1/ui/switch";
import { useRouter } from "next/navigation";
import { createSerializer, useQueryStates } from "nuqs";
import { useState } from "react";
import type { z } from "zod";
import { parseLocationCode } from "../../../../packages/property-data/src/utils/format";
import { PreviewSearchForm } from "./forms/preview-search-form";

interface TestInterfaceProps {
  assetTypes: Tables<"asset_types">[];
}

export function TestSearchInterface({ assetTypes }: TestInterfaceProps) {
  const [state, setState] = useQueryStates(parsers);
  const [useGoogle, setUseGoogle] = useState(false);
  const trpc = useTRPC();

  const { data } = useQuery(
    trpc.search.getPreview.queryOptions(
      {
        assetTypeSlug: state.asset_type!,
        locations: state.locations!,
        useGoogle,
      },
      {
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    ),
  );

  const router = useRouter();

  const handleSubmit = (values: z.infer<typeof propertySearchSchema>) => {
    const { locations, asset_type_slug, ...params } = values;

    setState({
      locations: locations.map((loc) => loc.internal_id),
      asset_type: asset_type_slug,
      params,
    });
  };

  const formattedLocations = state.locations?.map((loc) => {
    const { city, county, state } = parseLocationCode(loc);
    const name = city || county!;
    const displayName = `${name}, ${state}`;

    return {
      type: county ? ("county" as const) : ("city" as const),
      internal_id: loc,
      state_code: state,
      title: name,
      display_name: displayName,
    };
  });

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-foreground mb-3">
          Find commercial real estate, faster.
        </h1>
      </div>

      <PreviewSearchForm
        hideFilters
        assetTypes={assetTypes}
        onSubmit={handleSubmit}
        className="space-y-4"
        initialValues={{
          locations: formattedLocations || [],
          asset_type_slug: state.asset_type!,
          ...state.params,
        }}
      />

      <div className="space-y-1 bg-card p-4">
        <div className="flex items-center gap-2 ">
          <label htmlFor="useGoogle" className="text-sm font-medium">
            Use Google Maps
          </label>

          <Switch
            id="useGoogle"
            checked={useGoogle}
            onCheckedChange={setUseGoogle}
          />
        </div>
        <p>note: only works for self-storage</p>{" "}
        <p>google results are limited to top 60 within a 50km radius</p>
      </div>

      {data?.assetType && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Selected Asset Type
          </h3>
          <div className="rounded-lg border border-border space-y-2 bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-medium text-card-foreground ">
              {data.assetType.name}
            </h4>
            <p className="text-sm text-muted-foreground">
              {data.assetType.description}
            </p>

            <ul className="rounded-md bg-background p-2">
              {data.assetType.use_codes?.map((code) => (
                <li key={code}>
                  {/* @ts-expect-error */}
                  {code} - {codes[code]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {data && data.propertyCounts.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Search Preview
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.propertyCounts.map((item) => (
              <div
                key={item.internalId}
                className="rounded-lg border border-border space-y-2 bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <h4 className="font-medium text-card-foreground ">
                  {item.formattedLocation}
                </h4>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    RealestateAPI: {item.realestateapi?.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Google: {item.google?.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
