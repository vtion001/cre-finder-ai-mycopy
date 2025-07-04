"use client";

import type { Tables } from "@v1/supabase/types";
import type { propertySearchSchema } from "@v1/trpc/schema";
import { getDashboardUrl } from "@v1/utils/environment";
import { parsers } from "@v1/utils/nuqs/property-search-params";
import { useRouter } from "next/navigation";
import { createSerializer, useQueryStates } from "nuqs";
import type { z } from "zod";
import { parseLocationCode } from "../../../../packages/property-data/src/utils/format";
import { PreviewSearchForm } from "./preview-search-form";

interface HeroSectionProps {
  assetTypes: Tables<"asset_types">[];
}

const HeroSection = ({ assetTypes }: HeroSectionProps) => {
  const [state, setState] = useQueryStates(parsers);
  const router = useRouter();

  const handleSubmit = (values: z.infer<typeof propertySearchSchema>) => {
    const { locations, asset_type_slug, use_codes, ...params } = values;

    const serialize = createSerializer(parsers);
    const serializedParams = serialize({
      locations: locations.map((loc) => loc.internal_id),
      asset_type: asset_type_slug,
      use_codes: use_codes,
      params,
    });

    const baseUrl = getDashboardUrl();

    router.push(`${baseUrl}/dashboard/search/checkout${serializedParams}`);
  };

  const handleReset = () => {
    setState({
      ...state,
      params: null,
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
    <div className="h-[calc(100vh-4rem)] bg-blue-50 px-4 pt-20">
      <div className="w-full max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center ">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-3">
            <span className="block">Find your next CRE deal.</span>
            <span className="block text-primary">In seconds.</span>
          </h1>
        </div>

        <PreviewSearchForm
          assetTypes={assetTypes}
          onSubmit={handleSubmit}
          onReset={handleReset}
          className="space-y-4"
          initialValues={{
            locations: formattedLocations || [],
            asset_type_slug: state.asset_type!,
            use_codes: state.use_codes || [],
            ...state.params,
          }}
        />

        {/* Subheading */}
        <div className="text-center mt-8">
          <p className="text-lg text-muted-foreground">
            Discover and filter commercial real estate properties by asset type
            and city, with skip-traced owner contact information
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
