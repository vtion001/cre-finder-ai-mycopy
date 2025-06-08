"use client";

import type { propertySearchSchema } from "@/actions/schema";

import { parsers } from "@/lib/nuqs/property-search-params";
import type { Tables } from "@v1/supabase/types";
import { useQueryStates } from "nuqs";
import type { z } from "zod";
import { PreviewSearchForm } from "./forms/preview-search-form";

interface PreviewSearchInterfaceProps {
  assetTypes: Tables<"asset_types">[];
}

export function PreviewSearchInterface({
  assetTypes,
}: PreviewSearchInterfaceProps) {
  const [_, setState] = useQueryStates(parsers);

  const handleSubmit = (values: z.infer<typeof propertySearchSchema>) => {
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

      <PreviewSearchForm
        assetTypes={assetTypes}
        onSubmit={handleSubmit}
        className="space-y-4"
      />
    </div>
  );
}
