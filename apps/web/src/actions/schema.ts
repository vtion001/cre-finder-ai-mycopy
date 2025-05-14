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
