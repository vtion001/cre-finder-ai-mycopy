import {
  getPropertyCountQuery,
  getTestPropertyCountQuery,
} from "@v1/property-data/queries";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const searchRouter = createTRPCRouter({
  getPreview: protectedProcedure
    .input(
      z.object({
        assetTypeSlug: z.string(),
        locations: z.string().array(),
        useGoogle: z.boolean().optional().default(false),
      }),
    )
    .query(async ({ input, ctx: { supabase } }) => {
      const { data: assetType } = await supabase
        .from("asset_types")
        .select("*")
        .eq("slug", input.assetTypeSlug)
        .single();

      if (!assetType || !assetType.slug) {
        throw new Error("Asset type not found");
      }

      const propertyCounts = await Promise.all(
        input.locations.map(async (location) => {
          try {
            const result = await getTestPropertyCountQuery(
              {
                slug: assetType.slug!,
                name: assetType.name,
                use_codes: assetType.use_codes || [],
              },
              location,
              input.useGoogle,
            );
            return {
              ...result,
              use_codes: assetType.use_codes || [],
            };
          } catch (error) {
            console.error(
              `Error getting property count for ${location}:`,
              error,
            );
            return {
              use_codes: [],
              realestateapi: 0,
              google: 0,
              formattedLocation: location,
              assetTypeName: "",
              internalId: location,
            };
          }
        }),
      );

      return {
        propertyCounts,
        assetType,
      };
    }),
});
