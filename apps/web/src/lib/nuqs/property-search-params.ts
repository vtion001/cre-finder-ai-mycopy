import { searchFiltersSchema } from "@/actions/schema";
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
  page: parseAsInteger.withDefault(0),

  locations: parseAsArrayOf(parseAsString).withDefault([]),
  asset_type: parseAsString,
  map: parseAsBoolean.withDefault(false),
  params: parseAsJson(searchFiltersSchema.parse),
};

export const searchParamsCache = createSearchParamsCache(parsers);
