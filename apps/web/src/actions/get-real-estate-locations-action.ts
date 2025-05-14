"use server";

import { env } from "@/env.mjs";
import { z } from "zod";
import { authActionClient } from "./safe-action";

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

      const response = await fetch(
        "https://api.realestateapi.com/v2/AutoComplete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": env.REALESTATEAPI_API_KEY,
            "x-user-id": "CREFinderAI",
          },
          body: JSON.stringify({
            search: query,
            search_types: [searchTypes.join(",")],
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();

      // Define a type for the location data from the API
      type ApiLocation = {
        id: string;
        name: string;
        state_code: string;
        type: string;
        full_name: string;
      };

      // Transform the API response to match our schema
      const locations = data.data.map((location: ApiLocation) => ({
        id: location.id,
        name: location.name,
        state_code: location.state_code,
        type: location.type.toLowerCase(), // Normalize to lowercase
        full_name: `${location.name}, ${location.state_code}`,
      }));

      // Sort results: cities first, then counties
      const sortedLocations = locations.sort(
        (a: (typeof locations)[0], b: (typeof locations)[0]) => {
          if (a.type === "city" && b.type !== "city") return -1;
          if (a.type !== "city" && b.type === "city") return 1;
          return a.name.localeCompare(b.name);
        },
      );

      return sortedLocations as ApiLocation[];
    } catch (err) {
      console.error("Error fetching locations from RealEstate API:", err);
      return [];
    }
  });
