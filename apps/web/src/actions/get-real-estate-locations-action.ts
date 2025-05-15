"use server";

import { title } from "node:process";
import { env } from "@/env.mjs";
import { z } from "zod";
import { authActionClient } from "./safe-action";
import { locationSchema } from "./schema";

type AutocompleteCity = {
  searchType: "C";
  city: string;
  state: string;
  title: string;
};

type AutocompleteCounty = {
  searchType: "N";
  stateId: string;
  county: string;
  fips: string;
  title: string;
  countyId: string;
  state: string;
};

type AutocompleteResult = AutocompleteCity | AutocompleteCounty;

type AutocompleteResponse = {
  input: {
    search: string;
    search_types: Array<string>;
  };
  data: Array<AutocompleteResult>;
  totalResults: number;
  returnedResults: number;
  statusCode: number;
  statusMessage: string;
  live: string;
  requestExecutionTimeMS: string;
};

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
            search_types: searchTypes,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = (await response.json()) as AutocompleteResponse;

      // Normalize cities and counties into a common format
      const normalizedLocations = data.data.map((item) => {
        // Generate a unique ID for the location
        const id =
          `${item.searchType}-${item.state}-${item.searchType === "C" ? item.city : item.county}`
            .toLowerCase()
            .replace(/\s+/g, "-");

        return locationSchema.parse({
          internal_id: id,
          state_code: item.state,
          title: item.searchType === "C" ? item.city : item.county,
          type: "city",
          display_name: item.title,
        });
      });

      return normalizedLocations;
    } catch (err) {
      console.error("Error fetching locations from RealEstate API:", err);
      return [];
    }
  });
