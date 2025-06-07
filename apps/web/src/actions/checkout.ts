"use server";
import { getPropertyCountCache } from "@/queries/cached";
import { checkoutLicenseWithStripe } from "@v1/stripe/server";
import { z } from "zod";
import { authActionClient } from "./safe-action";

const checkoutLicenseSchema = z.object({
  locations: z.array(z.string()),
  assetType: z.string(),
});

export const checkoutLicenseAction = authActionClient
  .schema(checkoutLicenseSchema)
  .metadata({
    name: "checkout-license",
  })
  .action(
    async ({
      parsedInput: { locations, assetType },
      ctx: { supabase, user },
    }) => {
      const redirectPath = `/dashboard/search?asset_type=${assetType}&locations=${locations.join(",")}`;

      // map property counts
      const propertyCounts = await Promise.all(
        locations.map((location) => getPropertyCountCache(assetType, location)),
      );

      const result = await checkoutLicenseWithStripe({
        assetTypeSlug: assetType,
        propertyCounts,
        redirectPath,
      });

      return result;
    },
  );
