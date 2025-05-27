"use server";

import { getAutocomplete } from "@/lib/realestateapi";
import { z } from "zod";
import { authActionClient } from "./safe-action";
import { locationSchema } from "./schema";

export const getRealEstateLocationsAction = authActionClient
  .metadata({
    name: "get-real-estate-locations",
  })
  .schema(
    z.object({
      query: z.string(),
      searchTypes: z.array(z.string()).optional(),
    }),
  )
  .action(async ({ parsedInput: { query, searchTypes = ["C", "N"] } }) => {
    try {
      if (!query.trim()) {
        return [];
      }

      const data = await getAutocomplete({
        query,
        searchTypes,
      });

      // Normalize cities and counties into a common format
      const normalizedLocations = data.map((item) => {
        // Generate a unique ID for the location
        const id =
          `${item.searchType}-${item.state}-${item.searchType === "C" ? item.city : item.county}`
            .toLowerCase()
            .replace(/\s+/g, "-");

        return locationSchema.parse({
          internal_id: id,
          state_code: item.state,
          title: item.searchType === "C" ? item.city : item.county,
          type: item.searchType === "C" ? "city" : "county",
          display_name: item.title,
        });
      });

      return normalizedLocations;
    } catch (err) {
      console.error("Error fetching locations from RealEstate API:", err);
      return [];
    }
  });
