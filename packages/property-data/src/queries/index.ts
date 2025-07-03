"use server";

import { searchRegionAssets } from "../providers/google/lib";
import {
  getAutocomplete,
  getBulkSkipTrace,
  getBulkSkipTraceAwait,
  getPropertySearch,
  getSkipTrace,
} from "../providers/realestateapi/lib";
import type {
  GetBulkSkipTraceAwaitParams,
  GetBulkSkipTraceParams,
  GetPropertySearchParams,
  GetSkipTraceParams,
} from "../providers/realestateapi/types";
import { parseLocationCode } from "../utils/format";

export async function getPropertyCountQuery(
  assetType: { slug: string; name: string; use_codes: number[] },
  location: string,
  params?: GetPropertySearchParams | null,
) {
  const locationParams = parseLocationCode(location);
  const formattedLocation = `${locationParams.city || locationParams.county}, ${locationParams.state}`;

  let resultCount = 0;

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

  return {
    resultCount,
    formattedLocation,
    assetTypeName: assetType.name,
    internalId: location,
  };
}

export async function getPropertySearchQuery(
  assetType: { slug: string; name: string; use_codes: number[] },
  location: string,
  params?: GetPropertySearchParams | null,
) {
  const locationParams = parseLocationCode(location);

  const start_time = performance.now();

  const realestateapiParams = {
    ...locationParams,
    ...params,
    property_use_code: assetType.use_codes || [],
  };

  const response = await getPropertySearch(realestateapiParams, false);

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

export async function getSkipTraceQuery(params: GetSkipTraceParams) {
  const start_time = performance.now();

  const response = await getSkipTrace(params);

  const end_time = performance.now();
  const executionTime = end_time - start_time;

  return { response, executionTime: Math.round(executionTime) };
}

export async function getBulkSkipTraceQuery(params: GetBulkSkipTraceParams) {
  const start_time = performance.now();

  const response = await getBulkSkipTrace(params);

  const end_time = performance.now();
  const executionTime = end_time - start_time;

  return { response, executionTime: Math.round(executionTime) };
}

export async function getBulkSkipTraceAwaitQuery(
  params: GetBulkSkipTraceAwaitParams,
) {
  const start_time = performance.now();

  const response = await getBulkSkipTraceAwait(params);

  const end_time = performance.now();
  const executionTime = end_time - start_time;

  return { response, executionTime: Math.round(executionTime) };
}

export async function getStorageFacilitiesQuery(locationParams: {
  city?: string;
  county?: string;
  state: string;
}) {
  const regionName = locationParams.city || locationParams.county!;
  const regionType = locationParams.city ? "city" : "county";

  console.log(
    `🚀 Starting storage facility search for: ${regionName}, ${locationParams.state}`,
  );

  const results = await searchRegionAssets(
    regionName,
    "storage facilities",
    regionType,
    locationParams.state,
  );

  console.log(`📦 Found ${results.length} storage facilities`);
  return { results };
}
