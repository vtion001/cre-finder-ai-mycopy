import { searchFiltersSchema } from "@/actions/schema";

import { createSearchParamsCache, parseAsJson } from "nuqs/server";

export const parsers = {
  form: parseAsJson(searchFiltersSchema.parse),
};

export const searchParamsCache = createSearchParamsCache(parsers);
