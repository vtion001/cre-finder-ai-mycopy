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

export const locationSchema = z.object({
  internal_id: z.string(),
  state_code: z.string(),
  type: z.enum(["city", "county"]),
  title: z.string(),
  display_name: z.string().optional(),
});

export const assetTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
});
