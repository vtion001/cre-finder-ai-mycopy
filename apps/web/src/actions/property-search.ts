"use server";

import { searchStorageFacilities } from "@/lib/google-places";
import {
  type GetPropertySearchParams,
  getPropertySearch,
} from "@/lib/realestateapi";
import { crossReferenceResults, mapPropertyToRecord } from "@/lib/transform";
import { createClient } from "@v1/supabase/server";
import type { Json } from "@v1/supabase/types";
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
      parsedInput: {
        searchId,
        location_id,
        asset_type_id,
        last_sale_year,
        last_sale_month,
        ...parsedInput
      },
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

      let lastSaleDate: string | undefined;

      if (last_sale_year && last_sale_month) {
        const date = new Date(last_sale_year, last_sale_month, 1);
        lastSaleDate = format(date, "yyyy-MM-dd");
      }

      const params = {
        ...parsedInput,

        last_sale_date: lastSaleDate,
        property_use_code: assetType?.use_codes || undefined,

        city: location.type === "city" ? location.title : undefined,
        county: location.type === "county" ? location.title : undefined,
        state: location?.state_code,
      };

      console.log("Params:", params);

      const isStorageUnitSearch = assetType?.slug === "self-storage";

      const countOnly = true;

      const { response, executionTime } = await getResults(
        params,
        isStorageUnitSearch,
        countOnly,
      );

      const { data: searchLog, error } = await supabase
        .from("search_logs")
        .upsert(
          {
            id: searchId,
            user_id: user.id,
            asset_type_id,
            location_id,
            search_parameters: {
              ...params,
              last_sale_year,
              last_sale_month,
            } as unknown as Json,
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
      .select("*, asset_types(slug)")
      .eq("id", searchLogId)
      .eq("user_id", user.id)
      .single();

    if (searchLogError || !searchLog) {
      throw new Error("Search log not found");
    }

    const isStorageUnitSearch = searchLog.asset_types.slug === "self-storage";

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const searchParams = searchLog.search_parameters as unknown as any;
    searchParams.last_sale_year = undefined;
    searchParams.last_sale_month = undefined;

    // We are fetching the full results
    const countOnly = false;

    const { response, executionTime } = await getResults(
      searchParams,
      isStorageUnitSearch,
      countOnly,
    );

    const propertyRecords = (response.data || []).map((property) =>
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
  countOnly = true,
) {
  const start_time = performance.now();

  console.log("Params:", params);

  if (isStorageUnits) {
    if (countOnly) {
      // For storage unit preview searches, only use Google Places results count
      const googleResponse = await searchStorageFacilities({
        city: params.city,
        county: params.county,
        state: params.state,
      });

      const end_time = performance.now();
      const executionTime = end_time - start_time;

      return {
        response: { resultCount: googleResponse.results.length },
        executionTime: Math.round(executionTime),
      };
    }

    // For storage units full search, get both Google Places and Real Estate API results
    const [googleResponse, realEstateResponse] = await Promise.all([
      searchStorageFacilities({
        city: params.city,
        county: params.county,
        state: params.state,
      }),
      getPropertySearch(params, countOnly),
    ]);

    const crossReferencedData = crossReferenceResults(
      realEstateResponse.data,
      googleResponse.results,
    );

    const end_time = performance.now();
    const executionTime = end_time - start_time;

    return {
      response: {
        data: crossReferencedData,
        resultCount: crossReferencedData.length,
      },
      executionTime: Math.round(executionTime),
    };
  }
  const response = await getPropertySearch(params, countOnly);
  const end_time = performance.now();
  const executionTime = end_time - start_time;

  if (countOnly) {
    return {
      response: { resultCount: response.resultCount },
      executionTime: Math.round(executionTime),
    };
  }
  return {
    response: {
      data: response.data,
      resultCount: response.resultCount,
    },
    executionTime: Math.round(executionTime),
  };
}
