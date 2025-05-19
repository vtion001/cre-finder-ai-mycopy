"use server";

import { getPropertySearch } from "@/lib/realestateapi";
import { createClient } from "@v1/supabase/server";
import type { Json } from "@v1/supabase/types";
import { format } from "date-fns";
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
        size: z.number().optional(),
      }),
    ),
  )
  .action(
    async ({
      parsedInput: { size, location_id, asset_type_id, ...parsedInput },
      ctx: { user },
    }) => {
      const params = {
        ...parsedInput,
        size: size || 8,
      };

      const startTime = Date.now();

      const response = await getPropertySearch({
        ...params,
        last_sale_date: params.last_sale_date
          ? format(params.last_sale_date, "yyyy-MM-dd")
          : undefined,
      });

      const executionTime = Date.now() - startTime;

      const supabase = createClient();

      const { data: searchLog } = await supabase
        .from("search_logs")
        .insert({
          user_id: user.id,
          asset_type_id,
          location_id,
          search_parameters: params as unknown as Json,
          result_count: response.resultCount,
          execution_time_ms: executionTime,
        })
        .select()
        .single();

      return {
        ...response,
        searchLogId: searchLog?.id,
      };
    },
  );
