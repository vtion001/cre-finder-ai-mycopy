import type { Tables } from "@v1/supabase/types";
import { z } from "zod";

export const searchFiltersSchema = z
  .object({
    location_id: z.string(),
    asset_type_id: z.string(),
    building_size_min: z.coerce
      .number()
      .min(0, "Must be a positive number")
      .optional(),
    building_size_max: z.coerce
      .number()
      .min(0, "Must be a positive number")
      .optional(),
    lot_size_min: z.coerce
      .number()
      .min(0, "Must be a positive number")
      .optional(),
    lot_size_max: z.coerce
      .number()
      .min(0, "Must be a positive number")
      .optional(),
    last_sale_date: z.date().optional(),
    year_min: z.coerce
      .number()
      .min(1900, "Year must be after 1900")
      .max(
        new Date().getFullYear(),
        `Year must be before ${new Date().getFullYear() + 1}`,
      )
      .optional(),
    year_max: z.coerce
      .number()
      .min(1800, "Year must be after 1800")
      .max(
        new Date().getFullYear(),
        `Year must be before ${new Date().getFullYear() + 1}`,
      )
      .optional(),
  })
  .refine(
    (data) => {
      // If both min and max are provided, ensure min <= max
      if (data.building_size_min && data.building_size_max) {
        return data.building_size_min <= data.building_size_max;
      }
      return true;
    },
    {
      message: "Minimum building size must be less than or equal to maximum",
      path: ["building_size_min"],
    },
  )
  .refine(
    (data) => {
      // If both min and max are provided, ensure min <= max
      if (data.lot_size_min && data.lot_size_max) {
        return data.lot_size_min <= data.lot_size_max;
      }
      return true;
    },
    {
      message: "Minimum lot size must be less than or equal to maximum",
      path: ["lot_size_min"],
    },
  )
  .refine(
    (data) => {
      // If both min and max are provided, ensure min <= max
      if (data.year_min && data.year_max) {
        return data.year_min <= data.year_max;
      }
      return true;
    },
    {
      message: "Minimum year built must be less than or equal to maximum",
      path: ["year_min"],
    },
  );

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
