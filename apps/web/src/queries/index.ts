"use server";

import { parseLocationCode } from "@/lib/format";
import { getStorageFacilities } from "@/lib/google-places";
import { getPropertySearch } from "@/lib/realestateapi";
import { createClient } from "@v1/supabase/server";
import type { Client } from "@v1/supabase/types";

export async function getPropertyCount(
  supabase: Client,
  asset_type_slug: string,
  location: string,
) {
  const { data: assetType } = await supabase
    .from("asset_types")
    .select("*")
    .eq("slug", asset_type_slug)
    .single();

  if (!assetType) {
    throw new Error("Asset type not found");
  }

  const storageUnitType = assetType.slug === "self-storage";

  const locationParams = parseLocationCode(location);
  const formattedLocation = `${locationParams.city || locationParams.county}, ${locationParams.state}`;

  let resultCount = 0;
  if (storageUnitType) {
    const googleResponse = await getStorageFacilities(locationParams);
    resultCount = googleResponse.results.length;
  } else {
    const params = {
      ...locationParams,
      property_use_code: assetType.use_codes || [],
    };

    const realestateapiResponse = await getPropertySearch(params, true);
    resultCount = realestateapiResponse.resultCount;
  }

  return {
    resultCount,
    formattedLocation,
    assetTypeName: assetType.name,
    internalId: location,
  };
}
