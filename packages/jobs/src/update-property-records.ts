import { logger, schemaTask, task, wait } from "@trigger.dev/sdk/v3";
import { getPropertySearchQuery } from "@v1/property-data/queries";
import type { GetPropertySearchParams } from "@v1/property-data/types";
import { mapPropertyToRecord } from "@v1/property-data/utils";
import { createClient } from "@v1/supabase/job";
import { z } from "zod";
import { revalidateCache } from "./utils/revalidate-cache";

export const updatePropertyRecordsTask = schemaTask({
  id: "update-property-records",
  schema: z.object({
    licenseId: z.string(),
    count: z.boolean().optional().default(false),
  }),
  queue: {
    concurrencyLimit: 10,
  },
  maxDuration: 300,
  run: async (payload, { ctx }) => {
    const supabase = createClient();

    const { data: license } = await supabase
      .from("location_licenses")
      .select(`
            *,
            asset_licenses!inner (
              *
            )
        `)
      .eq("id", payload.licenseId)
      .single();

    const assetLicense = license?.asset_licenses;

    if (!license || !assetLicense) {
      throw new Error(`License not found: ${payload.licenseId}`);
    }

    logger.info(
      `Updating property records for license [${license.id}] for location [${license.location_internal_id}]`,
    );

    const { response, executionTime } = await getPropertySearchQuery(
      supabase,
      assetLicense.asset_type_slug,
      license.location_internal_id,
      assetLicense.search_params as unknown as GetPropertySearchParams,
    );

    logger.info(
      `Fetched ${response.data.length} properties in ${executionTime}ms for license [${license.id}] for location [${license.location_internal_id}]`,
    );

    const records = response.data.map((property) =>
      mapPropertyToRecord(
        property,
        license.id,
        assetLicense.user_id,
        assetLicense.id,
      ),
    );

    await supabase
      .from("property_records")
      .delete()
      .eq("location_license_id", license.id);

    const { data, error } = await supabase
      .from("property_records")
      .upsert(records, {
        onConflict: "location_license_id, property_id",
      })
      .select();

    if (error) {
      throw new Error(`Failed to insert records: ${error.message}`);
    }

    revalidateCache({
      tag: "asset_licenses",
      id: assetLicense.user_id,
    });

    return data;
  },
});
