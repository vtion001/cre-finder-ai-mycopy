import { searchFiltersSchema } from "@v1/trpc/schema";
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsJson,
  parseAsString,
} from "nuqs/server";

export const parsers = {
  q: parseAsString,
  page: parseAsInteger.withDefault(1),
  per_page: parseAsInteger.withDefault(25),

  locations: parseAsArrayOf(parseAsString).withDefault([]),
  asset_type: parseAsString,
  use_codes: parseAsArrayOf(parseAsInteger).withDefault([]),
  map: parseAsBoolean.withDefault(false),
  params: parseAsJson(searchFiltersSchema.parse),
  success: parseAsBoolean.withDefault(false),
};

export const searchParamsCache = createSearchParamsCache(parsers);
