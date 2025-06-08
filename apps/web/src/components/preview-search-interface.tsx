"use client";

import type { propertySearchSchema } from "@/actions/schema";
import { parsers } from "@/lib/nuqs/property-search-params";
import type { Tables } from "@v1/supabase/types";
import { useRouter } from "next/navigation";
import { createSerializer, useQueryStates } from "nuqs";
import type { z } from "zod";
import { parseLocationCode } from "../../../../packages/property-data/src/utils/format";
import { PreviewSearchForm } from "./forms/preview-search-form";

interface PreviewSearchInterfaceProps {
  assetTypes: Tables<"asset_types">[];
}

export function PreviewSearchInterface({
  assetTypes,
}: PreviewSearchInterfaceProps) {
  const [state, setState] = useQueryStates(parsers);

  const router = useRouter();

  const handleSubmit = (values: z.infer<typeof propertySearchSchema>) => {
    const { locations, asset_type_slug, ...params } = values;

    const serialize = createSerializer(parsers);
    const serializedParams = serialize({
      locations: locations.map((loc) => loc.internal_id),
      asset_type: asset_type_slug,
      params,
    });

    router.push(`/dashboard/search/checkout${serializedParams}`);
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
        assetTypes={assetTypes}
        onSubmit={handleSubmit}
        className="space-y-4"
        initialValues={{
          locations: formattedLocations || [],
          asset_type_slug: state.asset_type!,
          ...state.params,
        }}
      />
    </div>
  );
}
