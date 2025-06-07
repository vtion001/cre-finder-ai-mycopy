import { LicenseWarning } from "@/components/license-warning";
import { PreviewSearchInterface } from "@/components/preview-search-interface";
import { PropertySearchInterface } from "@/components/property-search-interface";
import { SearchLoading } from "@/components/search-loading";
import { getAssetTypes } from "@v1/supabase/cached-queries";
import { createClient } from "@v1/supabase/client";
import type { Metadata } from "next";
import { z } from "zod";

export const metadata: Metadata = {
  title: "Property Search - CRE Finder AI",
  description: "Find commercial real estate properties with AI-powered search",
};

const searchParamsSchema = z.object({
  location: z.string().optional(),
  asset_types: z
    .string()
    .transform((value) => value.split(","))
    .pipe(z.string().array()),
});

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { data: assetTypes } = await getAssetTypes();

  if (!assetTypes) {
    return <div>Loading...</div>;
  }

  const parsedSearchParams = searchParamsSchema.safeParse(searchParams);
  console.log(parsedSearchParams.error);

  if (
    parsedSearchParams.success &&
    parsedSearchParams.data.location &&
    parsedSearchParams.data.asset_types
  ) {
    const supabase = createClient();

    const { location, asset_types } = parsedSearchParams.data;

    const { data: userHasLicense } = await supabase.rpc(
      "user_has_license_combo",
      {
        p_user_id: "1",
        p_location_id: location,
        p_asset_types: asset_types,
      },
    );

    if (!userHasLicense) {
      return (
        <div className="relative overflow-hidden ">
          <LicenseWarning location={location} asset_types={asset_types} />
          <SearchLoading isEmpty />
        </div>
      );
    }

    return (
      <div className="p-4 sm:p-6 pb-16">
        <PropertySearchInterface
          location={location}
          asset_types={asset_types}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <PreviewSearchInterface assetTypes={assetTypes} />
    </div>
  );
}
