"use server";

import type { GetPropertySearchParams } from "@v1/property-data/types";
import { getPropertyCount } from "@v1/supabase/cached-queries";
import { getAssetLicenseQuery } from "@v1/supabase/queries";
import { z } from "zod";
import { authActionClient } from "./safe-action";

const getPropertyCountsSchema = z.object({
  locations: z.array(z.string()),
  assetType: z.string(),
});

export const getPropertyCountsAction = authActionClient
  .schema(getPropertyCountsSchema)
  .metadata({
    name: "get-property-counts",
  })
  .action(
    async ({
      parsedInput: { locations, assetType },
      ctx: { supabase, user },
    }) => {
      // Get existing asset license to use its search params
      const { data: assetLicense } = await getAssetLicenseQuery(
        supabase,
        user.id,
        assetType,
      );

      if (!assetLicense) {
        throw new Error("Asset license not found");
      }

      // Use existing search params from the asset license
      const searchParams = assetLicense.search_params;

      // Get property counts for each location
      const propertyCounts = await Promise.all(
        locations.map(async (location) => {
          try {
            const result = await getPropertyCount(
              assetType,
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
  );
