import {
  getPropertyRecord,
  getPropertyRecordsQuery,
} from "@v1/supabase/queries";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const recordsRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx: { supabase } }) => {
      return getPropertyRecord(supabase, input.id);
    }),

  download: protectedProcedure
    .input(
      z.object({
        assetLicenseId: z.string(),
        locationCodes: z.array(z.string()),
      }),
    )
    .query(async ({ input, ctx: { supabase } }) => {
      return getPropertyRecordsQuery(supabase, {
        assetLicenseId: input.assetLicenseId,
        locationCodes: input.locationCodes,
      });
    }),
});
