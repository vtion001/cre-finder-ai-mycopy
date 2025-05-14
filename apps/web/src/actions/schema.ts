import { z } from "zod";

export const placeSuggestionSchema = z.object({
  description: z.string(),
  place_id: z.string(),
  types: z.array(z.string()),
  terms: z.array(
    z.object({
      offset: z.number(),
      value: z.string(),
    }),
  ),
});

// Schema for RealEstate API location suggestions
export const realEstateLocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  state_code: z.string(),
  type: z.string(),
  full_name: z.string(),
});

export const assetTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
});
