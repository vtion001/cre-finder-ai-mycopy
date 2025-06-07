import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsString,
} from "nuqs/server";

export const parsers = {
  locations: parseAsArrayOf(parseAsString).withDefault([]),
  asset_type: parseAsString,
  map: parseAsBoolean.withDefault(false),
};

export const searchParamsCache = createSearchParamsCache(parsers);
