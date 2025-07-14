import { z } from "zod";

export const locationSchema = z.object({
  internal_id: z.string(),
  state_code: z.string(),
  type: z.enum(["city", "county"]),
  title: z.string(),
  display_name: z.string(),
});

export const searchFiltersSchema = z
  .object({
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
    last_sale_year: z.coerce
      .number()
      .min(1900, "Year must be after 1900")
      .max(
        new Date().getFullYear(),
        `Year must be before ${new Date().getFullYear() + 1}`,
      )
      .optional(),
    last_sale_month: z.coerce
      .number()
      .min(0, "Month must be between 0 and 11")
      .max(11, "Month must be between 0 and 11")
      .optional(),
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
    loan_paid_off_percent_min: z.coerce
      .number()
      .min(0, "Percentage must be between 0 and 100")
      .max(100, "Percentage must be between 0 and 100")
      .optional(),
    loan_paid_off_percent_max: z.coerce
      .number()
      .min(0, "Percentage must be between 0 and 100")
      .max(100, "Percentage must be between 0 and 100")
      .optional(),
    number_of_units: z
      .enum(["2-4", "5+"], {
        errorMap: () => ({
          message: "Please select a valid unit count option",
        }),
      })
      .optional(),
    mortgage_free_and_clear: z.boolean().optional(),
    tax_delinquent_year_min: z.coerce
      .number()
      .min(1900, "Year must be after 1900")
      .max(
        new Date().getFullYear(),
        `Year must be before ${new Date().getFullYear() + 1}`,
      )
      .optional(),
    tax_delinquent_year_max: z.coerce
      .number()
      .min(1900, "Year must be after 1900")
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
  )
  .refine(
    (data) => {
      // If year is provided, month should also be provided (optional validation)
      if (data.last_sale_year && data.last_sale_month === undefined) {
        return false;
      }
      if (data.last_sale_month !== undefined && !data.last_sale_year) {
        return false;
      }
      return true;
    },
    {
      message: "Both year and month must be selected together",
      path: ["last_sale_month"],
    },
  )
  .refine(
    (data) => {
      // If both min and max are provided, ensure min <= max
      if (data.loan_paid_off_percent_min && data.loan_paid_off_percent_max) {
        return data.loan_paid_off_percent_min <= data.loan_paid_off_percent_max;
      }
      return true;
    },
    {
      message: "Minimum percentage must be less than or equal to maximum",
      path: ["loan_paid_off_percent_min"],
    },
  )
  .refine(
    (data) => {
      // If both min and max are provided, ensure min <= max
      if (data.tax_delinquent_year_min && data.tax_delinquent_year_max) {
        return data.tax_delinquent_year_min <= data.tax_delinquent_year_max;
      }
      return true;
    },
    {
      message:
        "Minimum tax delinquent year must be less than or equal to maximum",
      path: ["tax_delinquent_year_min"],
    },
  );

export const propertySearchSchema = searchFiltersSchema.and(
  z.object({
    locations: z
      .array(locationSchema)
      .min(1, "Please select at least one location"),
    asset_type_slug: z.string().min(1, "Please select a property type"),
    use_codes: z.array(z.number()).optional(),
    // Optional filter fields
  }),
);

export const passwordSchema = z
  .string()
  .min(8, {
    message: "Password must be at least 8 characters long",
  })
  .max(100)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
    message:
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
  });

// Keep the original schema for advanced search/existing functionality

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

export const assetTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  use_codes: z.array(z.number()).optional(),
});

export const productMetadataSchema = z.object({
  max_searches: z.coerce.number(),
  max_skip_trace: z.coerce.number(),
  county_access: z.string(),
  asset_type_count: z.coerce.number(),
  is_enterprise: z.coerce.boolean(),
});
