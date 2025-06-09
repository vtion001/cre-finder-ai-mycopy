"use server";

import type { Client } from "@v1/supabase/types";
import { getStorageFacilities } from "../providers/google/lib";
import {
  getAutocomplete,
  getPropertySearch,
} from "../providers/realestateapi/lib";
import type {
  GetPropertySearchParams,
  PropertySearchResponse,
} from "../providers/realestateapi/types";
import { parseLocationCode } from "../utils/format";
import { crossReferenceResults } from "../utils/transform";

export async function getPropertyCountQuery(
  supabase: Client,
  asset_type_slug: string,
  location: string,
  params?: GetPropertySearchParams | null,
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
    const realestateapiParams = {
      ...locationParams,
      ...params,
      property_use_code: assetType.use_codes || [],
    };

    const realestateapiResponse = await getPropertySearch(
      realestateapiParams,
      true,
    );
    resultCount = realestateapiResponse.resultCount;
  }

  return {
    resultCount,
    formattedLocation,
    assetTypeName: assetType.name,
    internalId: location,
  };
}

export async function getPropertySearchQuery(
  supabase: Client,
  asset_type_slug: string,
  location: string,
  params?: GetPropertySearchParams | null,
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

  const start_time = performance.now();

  let response: PropertySearchResponse;

  const realestateapiParams = {
    ...locationParams,
    ...params,
    property_use_code: assetType.use_codes || [],
  };

  if (storageUnitType) {
    const [googleResponse, realEstateResponse] = await Promise.all([
      getStorageFacilities(locationParams),
      getPropertySearch(realestateapiParams, false),
    ]);

    const crossReferencedData = crossReferenceResults(
      realEstateResponse.data,
      googleResponse.results,
    );

    response = {
      ...realEstateResponse,
      data: crossReferencedData,
      resultCount: crossReferencedData.length,
    };
  } else {
    response = await getPropertySearch(realestateapiParams, false);
  }

  const end_time = performance.now();
  const executionTime = end_time - start_time;

  return { response, executionTime: Math.round(executionTime) };
}

export async function getAutocompleteQuery({
  query,
  searchTypes,
}: {
  query: string;
  searchTypes: Array<string>;
}) {
  return await getAutocomplete({ query, searchTypes });
}
