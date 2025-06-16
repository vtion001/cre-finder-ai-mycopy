"use server";

import { getStorageFacilities } from "../providers/google/lib";
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
  PropertySearchResponse,
} from "../providers/realestateapi/types";
import { parseLocationCode } from "../utils/format";
import { crossReferenceResults } from "../utils/transform";

export async function getPropertyCountQuery(
  assetType: { slug: string; name: string; use_codes: number[] },
  location: string,
  params?: GetPropertySearchParams | null,
) {
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
  assetType: { slug: string; name: string; use_codes: number[] },
  location: string,
  params?: GetPropertySearchParams | null,
) {
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
