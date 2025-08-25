"use client";

import { useQuery } from "@tanstack/react-query";
import { parseLocationCode } from "@v1/property-data/utils";
import type { Tables } from "@v1/supabase/types";
import { useTRPC } from "@v1/trpc/client";
import type { propertySearchSchema } from "@v1/trpc/schema";
import { getDashboardUrl } from "@v1/utils/environment";
import { parsers } from "@v1/utils/nuqs/property-search-params";
import { useRouter } from "next/navigation";
import { createSerializer, useQueryStates } from "nuqs";
import { useState } from "react";
import type { z } from "zod";
import { PreviewResultsWrapper } from "./preview-results-wrapper";
import { PreviewSearchForm } from "./preview-search-form";

interface HeroSectionProps {
  assetTypes: Tables<"asset_types">[];
}

const HeroSection = ({ assetTypes }: HeroSectionProps) => {
  const [state, setState] = useQueryStates(parsers);
  const [showPreview, setShowPreview] = useState(false);

  const router = useRouter();

  const trpc = useTRPC();

  const {
    data: propertyCountsData,
    error,
    isLoading,
    refetch,
  } = useQuery(
    trpc.search.getPublicPropertyCounts.queryOptions(
      {
        locations: state.locations!,
        assetTypeSlug: state.asset_type!,
        useCodes: state.use_codes,
        params: state.params,
      },
      {
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        enabled: !!state.asset_type && !!state.locations?.length,
      },
    ),
  );

  const handlePreview = async (
    values: z.infer<typeof propertySearchSchema>,
  ) => {
    const { locations, asset_type_slug, use_codes, ...params } = values;

    setState({
      locations: locations.map((loc) => loc.internal_id),
      asset_type: asset_type_slug,
      use_codes: use_codes,
      params,
    });

    await refetch();
    setShowPreview(true);
  };

  const handleProceedToCheckout = () => {
    const serialize = createSerializer(parsers);
    const serializedParams = serialize({
      locations: state.locations,
      asset_type: state.asset_type,
      use_codes: state.use_codes,
      params: state.params,
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
          onSubmit={handlePreview}
          onReset={handleReset}
          className="space-y-4"
          initialValues={{
            locations: formattedLocations || [],
            asset_type_slug: state.asset_type!,
            use_codes: state.use_codes || [],
            ...state.params,
          }}
        />

        {/* Preview Results */}
        <PreviewResultsWrapper
          data={propertyCountsData || []}
          isLoading={isLoading}
          error={error?.message}
          onProceedToCheckout={handleProceedToCheckout}
          showPreview={!!propertyCountsData?.length}
          onClosePreview={() => setShowPreview(false)}
          className="mt-8"
        />

        {!showPreview && (
          <div className="text-center mt-8">
            <p className="text-lg text-muted-foreground">
              Discover and filter commercial real estate properties by asset
              type and city, with skip-traced owner contact information
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
