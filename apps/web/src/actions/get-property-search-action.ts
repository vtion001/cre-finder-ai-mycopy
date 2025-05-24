"use server";

import { getPropertySearch } from "@/lib/realestateapi";
import { createClient } from "@v1/supabase/server";
import type { Json } from "@v1/supabase/types";
import { format } from "date-fns";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { authActionClient } from "./safe-action";
import { searchFiltersSchema } from "./schema";

export const getPropertySearchAction = authActionClient
  .metadata({
    name: "get-property-search",
  })
  .schema(
    searchFiltersSchema.and(
      z.object({
        searchId: z.string().optional(),
        size: z.number().optional(),
      }),
    ),
  )
  .action(
    async ({
      parsedInput: {
        size,
        searchId,
        location_id,
        asset_type_id,
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
        .select("use_codes")
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

        size: size || 8,
      };

      const response = await getPropertySearch(params);

      const executionTime = Number.parseInt(response.requestExecutionTimeMS);

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
