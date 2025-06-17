import { getPropertyRecord } from "@v1/supabase/queries";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const recordsRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx: { supabase } }) => {
      return getPropertyRecord(supabase, input.id);
    }),
});
