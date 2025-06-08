"use server";
import { getPropertyCountCache } from "@/queries/cached";
import { checkoutLicenseWithStripe } from "@v1/stripe/server";
import { z } from "zod";
import { authActionClient } from "./safe-action";
import { searchFiltersSchema } from "./schema";

const checkoutLicenseSchema = z.object({
  locations: z.array(z.string()),
  assetType: z.string(),
  params: searchFiltersSchema,
});

export const checkoutLicenseAction = authActionClient
  .schema(checkoutLicenseSchema)
  .metadata({
    name: "checkout-license",
  })
  .action(
    async ({
      parsedInput: { locations, assetType, params },
      ctx: { supabase, user },
    }) => {
      // map property counts
      const propertyCounts = await Promise.all(
        locations.map((location) =>
          getPropertyCountCache(assetType, location, params),
        ),
      );

      // remove 0 counts
      const filteredCounts = propertyCounts.filter(
        (count) => count.resultCount > 0,
      );

      const filteredLocations = filteredCounts.map((count) => count.internalId);

      const redirectPath = `/dashboard/records?asset_type=${assetType}&locations=${filteredLocations.join(",")}`;

      const result = await checkoutLicenseWithStripe({
        assetTypeSlug: assetType,
        propertyCounts: filteredCounts,
        redirectPath: "/dashboard/search", // temporary
      });

      return result;
    },
  );
