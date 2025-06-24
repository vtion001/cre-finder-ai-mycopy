import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { createTRPCRouter } from "../init";
import { licensesRouter } from "./licenses";
import { recordsRouter } from "./records";
import { searchRouter } from "./search";

export const appRouter = createTRPCRouter({
  records: recordsRouter,
  licenses: licensesRouter,
  search: searchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
