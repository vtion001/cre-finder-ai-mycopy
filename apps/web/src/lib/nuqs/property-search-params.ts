import { searchFiltersSchema } from "@/actions/schema";
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsJson,
  parseAsString,
} from "nuqs/server";

export const parsers = {
  locations: parseAsArrayOf(parseAsString).withDefault([]),
  asset_type: parseAsString,
  map: parseAsBoolean.withDefault(false),
  params: parseAsJson(searchFiltersSchema.parse),
};

export const searchParamsCache = createSearchParamsCache(parsers);
