"use server";

import { getPropertySearch } from "@/lib/realestateapi";
import { z } from "zod";
import { authActionClient } from "./safe-action";

// Define the schema for the property search parameters
const propertySearchSchema = z.object({
  size: z.number().optional(),
  building_size_min: z.number().optional(),
  building_size_max: z.number().optional(),
  lot_size_min: z.number().optional(),
  lot_size_max: z.number().optional(),
  last_sale_date: z.string().optional(), // "YYYY-MM-DD"
  year_min: z.number().optional(),
  year_max: z.number().optional(),
});

export const getPropertySearchAction = authActionClient
  .metadata({
    name: "get-property-search",
  })
  .schema(propertySearchSchema)
  .action(async ({ parsedInput }) => {
    try {
      // Set default size if not provided
      const params = {
        ...parsedInput,
        size: parsedInput.size || 8, // Default to 8 results if not specified
      };

      // Call the real estate API
      const response = await getPropertySearch(params);
      
      return response;
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw new Error("Failed to fetch properties");
    }
  });
