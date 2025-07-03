"use server";
import { checkoutLicenseWithStripe } from "@v1/stripe/server";
import { getPropertyCount } from "@v1/supabase/cached-queries";
import { getAssetLicenseQuery } from "@v1/supabase/queries";
import { z } from "zod";
import { authActionClient } from "./safe-action";
import { searchFiltersSchema } from "./schema";

const checkoutLicenseSchema = z.object({
  locations: z.array(z.string()),
  assetType: z.string(),
  useCodes: z.array(z.number()),
  params: searchFiltersSchema.nullish(),
  isAddingLocations: z.boolean().optional().default(false),
});

export const checkoutLicenseAction = authActionClient
  .schema(checkoutLicenseSchema)
  .metadata({
    name: "checkout-license",
  })
  .action(
    async ({
      parsedInput: {
        locations,
        assetType,
        useCodes,
        params,
        isAddingLocations,
      },
      ctx: { supabase, user },
    }) => {
      let searchParams = params;

      // If adding locations to existing license, fetch existing search params
      if (isAddingLocations) {
        const { data: assetLicense } = await getAssetLicenseQuery(
          supabase,
          user.id,
          assetType,
        );

        if (assetLicense) {
          // Use existing search params instead of new ones
          searchParams = assetLicense.search_params as typeof params;
        } else {
          throw new Error("Asset license not found for location addition");
        }
      }

      // map property counts using the appropriate search params
      const propertyCounts = await Promise.all(
        locations.map((location) =>
          getPropertyCount(
            {
              slug: assetType,
              allowed_use_codes: useCodes,
            },
            location,
            searchParams,
          ),
        ),
      );

      // remove 0 counts
      const filteredCounts = propertyCounts.filter(
        (count) => count.resultCount > 0,
      );

      const filteredLocations = filteredCounts.map((count) => count.internalId);

      const redirectPath = `/dashboard/records?asset_type=${assetType}&locations=${filteredLocations.join(",")}&success=true`;

      const result = await checkoutLicenseWithStripe({
        assetTypeSlug: assetType,
        propertyCounts: filteredCounts,
        searchParams: searchParams,
        redirectPath: redirectPath,
        isAddingLocations,
      });

      return result;
    },
  );
