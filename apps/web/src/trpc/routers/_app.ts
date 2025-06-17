import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { createTRPCRouter } from "../init";
import { headlinesRouter } from "./headlines";
import { websitesRouter } from "./websites";

export const appRouter = createTRPCRouter({
  headlines: headlinesRouter,
  websites: websitesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
