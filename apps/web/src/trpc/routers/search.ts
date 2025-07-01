import { locationSchema } from "@/actions/schema";
import {
  getAutocompleteQuery,
  getPropertyCountQuery,
} from "@v1/property-data/queries";
import type { GetPropertySearchParams } from "@v1/property-data/types";
import { getAssetLicenseQuery } from "@v1/supabase/queries";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const searchRouter = createTRPCRouter({
  getPropertyCounts: protectedProcedure
    .input(
      z.object({
        locations: z.array(z.string()),
        assetTypeSlug: z.string(),
      }),
    )
    .query(
      async ({
        input: { assetTypeSlug, locations },
        ctx: {
          supabase,
          session: { user },
        },
      }) => {
        // Get existing asset license to use its search params
        const { data: assetLicense } = await getAssetLicenseQuery(
          supabase,
          user.id,
          assetTypeSlug,
        );

        if (!assetLicense) {
          throw new Error("Asset license not found");
        }

        const { data: assetType } = await supabase
          .from("asset_types")
          .select("*")
          .eq("slug", assetTypeSlug)
          .single();

        if (!assetType || !assetType.slug) {
          throw new Error("Asset type not found");
        }

        // Use existing search params from the asset license
        const searchParams = assetLicense.search_params;

        // Get property counts for each location
        const propertyCounts = await Promise.all(
          locations.map(async (location) => {
            try {
              const result = await getPropertyCountQuery(
                {
                  slug: assetType.slug!,
                  name: assetType.name,
                  use_codes: assetType.use_codes || [],
                },
                location,
                searchParams as unknown as GetPropertySearchParams,
              );
              return result;
            } catch (error) {
              console.error(
                `Error getting property count for ${location}:`,
                error,
              );
              return {
                resultCount: 0,
                formattedLocation: location,
                assetTypeName: "",
                internalId: location,
              };
            }
          }),
        );

        return propertyCounts;
      },
    ),

  getAutocomplete: protectedProcedure
    .input(
      z.object({
        query: z.string(),
        searchTypes: z.array(z.string()).optional().default(["C", "N"]),
      }),
    )
    .query(async ({ input: { query, searchTypes }, ctx: { supabase } }) => {
      try {
        if (!query.trim()) {
          return [];
        }

        const data = await getAutocompleteQuery({
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
    }),
});
