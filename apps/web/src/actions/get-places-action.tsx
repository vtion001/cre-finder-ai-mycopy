"use server";

import { env } from "@/env.mjs";
import { z } from "zod";
import { authActionClient } from "./safe-action";
import { placeSuggestionSchema } from "./schema";

const getPlacesResponseSchema = z.object({
  status: z.string(),
  predictions: z.array(placeSuggestionSchema),
});

export const getPlacesAction = authActionClient
  .metadata({
    name: "get-places",
  })
  .schema(
    z.object({
      query: z.string(),
      countryCode: z.string().optional(),
    }),
  )
  .action(async ({ parsedInput: { query, countryCode } }) => {
    try {
      const baseUrl = "https://maps.googleapis.com/";
      const url = new URL("/maps/api/place/autocomplete/json", baseUrl);

      url.searchParams.append("key", env.GOOGLE_API_KEY);
      url.searchParams.append("input", query);

      //https://developers.google.com/maps/documentation/places/web-service/autocomplete#components
      if (countryCode) {
        url.searchParams.append("components", `country:${countryCode}`);
      }

      // https://developers.google.com/maps/documentation/places/web-service/autocomplete#types
      url.searchParams.append(
        "types",
        [
          // Type Collections -> cannot be mixed!!
          // "(regions)", // locality, sublocality, postal_code, country, administrative_area_level_1, administrative_area_level_2
          "(cities)", // locality, administrative_area_level_3

          // Up to five values from Table 1 - 2
          // https://developers.google.com/maps/documentation/places/web-service/supported_types#table1
          // "locality",
          // "administrative_area_level_3",
          // "natural_feature",
          // "point_of_interest",
        ].join("|"),
      );

      const response = await fetch(url);

      const safeParsedOutput = getPlacesResponseSchema.safeParse(
        await response.json(),
      );

      if (!safeParsedOutput.success) {
        throw new Error("Failed to fetch places");
      }

      return safeParsedOutput.data.predictions;
    } catch (err) {
      console.error(err);
      return [];
    }
  });
