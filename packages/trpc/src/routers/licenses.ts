import { getAssetTypeLicensesQuery } from "@v1/supabase/queries";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const licensesRouter = createTRPCRouter({
  getAssetTypeLicenses: protectedProcedure
    .input(z.object({ assetTypeSlug: z.string() }))
    .query(async ({ ctx: { supabase, session }, input }) => {
      return getAssetTypeLicensesQuery(supabase, input.assetTypeSlug);
    }),
});
