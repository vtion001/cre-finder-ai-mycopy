"use server";
import { checkoutLicenseWithStripe } from "@v1/stripe/server";
import { z } from "zod";
import { authActionClient } from "./safe-action";

const checkoutLicenseSchema = z.object({
  locationId: z.string().min(1, "Location is required"),
  assetTypeSlugs: z
    .array(z.string())
    .min(1, "At least one asset type is required"),
  resultCount: z.number().min(1, "Result count must be at least 1"),
  redirectPath: z.string().optional(),
});

export const checkoutLicenseAction = authActionClient
  .schema(checkoutLicenseSchema)
  .metadata({
    name: "checkout-license",
  })
  .action(
    async ({
      parsedInput: { locationId, assetTypeSlugs, resultCount, redirectPath },
      ctx: { supabase, user },
    }) => {
      const path = `/dashboard/search?location=${locationId}&asset_types=${assetTypeSlugs.join(",")}`;
      const result = await checkoutLicenseWithStripe({
        locationId,
        assetTypeSlugs,
        resultCount,
        redirectPath: redirectPath ?? path,
      });

      return result;
    },
  );
