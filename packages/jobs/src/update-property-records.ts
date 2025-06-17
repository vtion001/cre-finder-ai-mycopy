import { logger, schemaTask, task, tasks, wait } from "@trigger.dev/sdk/v3";
import { getPropertySearchQuery } from "@v1/property-data/queries";
import type { GetPropertySearchParams } from "@v1/property-data/types";
import { mapPropertyToRecord } from "@v1/property-data/utils";
import { createClient } from "@v1/supabase/job";
import { z } from "zod";
import type { skipTraceTask } from "./skip-trace-results";
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

    const { data: assetType } = await supabase
      .from("asset_types")
      .select("*")
      .eq("slug", assetLicense.asset_type_slug)
      .single();

    if (!assetType || !assetType.slug) {
      throw new Error("Asset type not found");
    }

    const { response, executionTime } = await getPropertySearchQuery(
      {
        slug: assetType.slug!,
        name: assetType.name,
        use_codes: assetType.use_codes || [],
      },
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

    await tasks.trigger<typeof skipTraceTask>("skip-trace-task", {
      licenseId: license.id,
    });

    await revalidateCache({
      tag: "licenses",
      id: assetLicense.asset_type_slug,
    });

    await revalidateCache({
      tag: "records",
      id: assetLicense.id,
    });

    return data;
  },
});
