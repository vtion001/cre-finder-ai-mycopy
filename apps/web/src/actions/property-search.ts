"use server";

import { searchStorageFacilities } from "@/lib/google-places";
import {
  type GetPropertySearchParams,
  getPropertySearch,
} from "@/lib/realestateapi";
import {
  mapPropertyToRecord,
  mergePropertySearchResults,
  transformGooglePlaceToPropertyResult,
} from "@/lib/transform";
import { createClient } from "@v1/supabase/server";
import type { Json, Tables } from "@v1/supabase/types";
import { format } from "date-fns";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { authActionClient } from "./safe-action";
import { searchFiltersSchema } from "./schema";

export const previewSearchAction = authActionClient
  .metadata({
    name: "get-search-preview",
  })
  .schema(
    searchFiltersSchema.and(
      z.object({
        searchId: z.string().optional(),
      }),
    ),
  )
  .action(
    async ({
      parsedInput: { searchId, location_id, asset_type_id, ...parsedInput },
      ctx: { user },
    }) => {
      const supabase = createClient();

      const { data: location } = await supabase
        .from("user_locations")
        .select("*")
        .eq("id", location_id)
        .single();

      const { data: assetType } = await supabase
        .from("asset_types")
        .select("*")
        .eq("id", asset_type_id)
        .single();

      if (!location || !assetType) {
        throw new Error("Location or asset type not found");
      }

      const params = {
        ...parsedInput,
        last_sale_date: parsedInput.last_sale_date
          ? format(parsedInput.last_sale_date, "yyyy-MM-dd")
          : undefined,
        property_use_code: assetType?.use_codes || undefined,

        city: location.type === "city" ? location.title : undefined,
        county: location.type === "county" ? location.title : undefined,
        state: location?.state_code,
      };

      const isStorageUnitSearch = assetType?.name === "Storage Unit";

      const { response, executionTime } = await getResults(
        params,
        isStorageUnitSearch,
        true,
      );

      const { data: searchLog, error } = await supabase
        .from("search_logs")
        .upsert(
          {
            id: searchId,
            user_id: user.id,
            asset_type_id,
            location_id,
            search_parameters: params as unknown as Json,
            result_count: response.resultCount,
            execution_time_ms: executionTime,
          },
          {
            onConflict: "id",
          },
        )
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to save search log: ${error.message}`);
      }

      revalidateTag(`search_history_${user.id}`);
      revalidateTag(`search_log_${searchLog?.id}`);

      return {
        ...response,
        searchLogId: searchLog?.id,
      };
    },
  );

const completeSearchSchema = z.object({
  searchLogId: z.string().uuid(),
});

export const completeSearchAction = authActionClient
  .schema(completeSearchSchema)
  .metadata({
    name: "completeSearchAction",
  })
  .action(async ({ parsedInput: { searchLogId }, ctx: { user } }) => {
    const supabase = createClient();

    const { data: searchLog, error: searchLogError } = await supabase
      .from("search_logs")
      .select("*, asset_types(name)")
      .eq("id", searchLogId)
      .eq("user_id", user.id)
      .single();

    if (searchLogError || !searchLog) {
      throw new Error("Search log not found");
    }

    const isStorageUnitSearch = searchLog.asset_types.name === "Storage Unit";

    const searchParams = searchLog.search_parameters as GetPropertySearchParams;

    const { response, executionTime } = await getResults(
      searchParams,
      isStorageUnitSearch,
      true,
    );

    const propertyRecords = response.data.map((property) =>
      mapPropertyToRecord(property, searchLogId, user.id),
    );

    const { error: insertError } = await supabase
      .from("property_records")
      .insert(propertyRecords);

    if (insertError) {
      throw new Error(
        `Failed to insert property records: ${insertError.message}`,
      );
    }

    // Update search log status to completed
    const { error: updateError } = await supabase
      .from("search_logs")
      .update({ status: "completed", execution_time_ms: executionTime })
      .eq("id", searchLogId)
      .eq("user_id", user.id);

    if (updateError) {
      throw new Error(
        `Failed to update search log status: ${updateError.message}`,
      );
    }

    // Revalidate relevant tags
    revalidateTag(`search_history_${user.id}`);
    revalidateTag(`credit_usage_${user.id}`);
    revalidateTag(`property_records_${user.id}`);
    revalidateTag(`property_records_by_search_log_${user.id}`);

    return {
      success: true,
      recordsInserted: propertyRecords.length,
      searchLogId,
    };
  });

async function getResults(
  params: GetPropertySearchParams,
  isStorageUnits: boolean,
  count = true,
) {
  let response: Awaited<ReturnType<typeof getPropertySearch>>;

  const start_time = performance.now();

  if (isStorageUnits) {
    const [realEstateResponse, googleResponse] = await Promise.all([
      getPropertySearch(params, count),
      searchStorageFacilities({
        city: params.city,
        county: params.county,
        state: params.state,
      }),
    ]);

    const googleResults = googleResponse.results.map((place) =>
      transformGooglePlaceToPropertyResult(place),
    );

    const mergedData = mergePropertySearchResults(
      realEstateResponse.data,
      googleResults,
    );

    response = {
      ...realEstateResponse,
      data: mergedData,
      resultCount: realEstateResponse.resultCount + googleResults.length,
    };
  } else {
    response = await getPropertySearch(params);
  }

  const end_time = performance.now();
  const executionTime = end_time - start_time;

  return { response, executionTime: Math.round(executionTime) };
}
