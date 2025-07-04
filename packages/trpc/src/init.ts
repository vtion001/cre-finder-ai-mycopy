import { TRPCError, initTRPC } from "@trpc/server";
import { createClient } from "@v1/supabase/server";
import { cache } from "react";
import superjson from "superjson";

// NOTE: All these functions are from cookies and then cached
// In the request lifecycle, they are only called once
export const createTRPCContext = cache(async () => {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return {
    session,
    supabase,
  };
});

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async (opts) => {
  const { session } = opts.ctx;

  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      session,
    },
  });
});
