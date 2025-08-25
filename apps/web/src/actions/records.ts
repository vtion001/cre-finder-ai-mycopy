"use server";

import { deleteRecords } from "@v1/supabase/mutations";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { authActionClient } from "./safe-action";
import type { Client } from "@v1/supabase/types";

export const deleteRecordsAction = authActionClient
  .schema(
    z.object({
      ids: z.array(z.string()),
    }),
  )
  .metadata({
    name: "delete-records",
  })
  .action(async ({ parsedInput: { ids }, ctx: { supabase } }) => {
    try {
      const { data, error } = await deleteRecords(supabase as unknown as Client, ids);

      const sample = data?.at(0);

      if (sample) {
        revalidateTag(`property_records_${sample.asset_license_id}`);
      }

      return {
        data,
        error,
      };
    } catch (err) {
      return {
        data: null,
        error: err,
      };
    }
  });
