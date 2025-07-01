import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { getSkipTraceQuery } from "@v1/property-data/queries";
import { createClient } from "@v1/supabase/job";
import { z } from "zod";
import { revalidateCache } from "./utils/revalidate-cache";

export const skipTraceTask = schemaTask({
  id: "skip-trace-task",
  schema: z.object({
    licenseId: z.string(),
  }),
  queue: {
    concurrencyLimit: 1,
  },
  maxDuration: 1800, // 30 minutes for large batches
  run: async (payload) => {
    const supabase = createClient();

    // Fetch license information
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

    if (!license) {
      throw new Error(`License not found: ${payload.licenseId}`);
    }

    logger.info(
      `Starting skip trace for license [${license.id}] for location [${license.location_internal_id}]`,
    );

    // Fetch property records for this license that don't have skip trace data
    const { data: propertyRecords, error } = await supabase
      .from("property_records")
      .select("*")
      .eq("location_license_id", license.id)
      .is("skip_trace_data", null);

    if (error) {
      throw new Error(`Failed to fetch property records: ${error.message}`);
    }

    if (!propertyRecords || propertyRecords.length === 0) {
      logger.info(`No property records found for license [${license.id}]`);
      return { processed: 0, results: [] };
    }

    logger.info(
      `Found ${propertyRecords.length} property records to skip trace`,
    );

    const skipTraceResults = [];
    let processed = 0;

    // Process each property record
    for (const property of propertyRecords) {
      try {
        const { response, executionTime } = await getSkipTraceQuery({
          first_name: property.owner1_first_name || undefined,
          last_name: property.owner1_last_name,
          address: property.address,
          city: property.city || "",
          state: property.state,
          zip: property.zip,
        });

        const result = {
          propertyId: property.property_id,
          address: property.address,
          owner:
            `${property.owner1_first_name || ""} ${property.owner1_last_name}`.trim(),
          skipTraceResponse: response,
          executionTime,
          timestamp: new Date().toISOString(),
        };

        skipTraceResults.push(result);

        const { error: updateError } = await supabase
          .from("property_records")
          .update({
            skip_trace_data: response,
            skip_trace_updated_at: new Date().toISOString(),
          })
          .eq("id", property.id);

        if (updateError) {
          logger.error(
            `Failed to update skip trace data for property ${property.property_id}: ${updateError.message}`,
          );
        }

        processed++;

        logger.info(
          `Processed ${processed}/${propertyRecords.length} - Property: ${property.address}`,
        );

        // Add small delay to respect API rate limits
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        logger.error(
          `Failed to skip trace property ${property.property_id}: ${error}`,
        );

        // Continue processing other properties even if one fails
        skipTraceResults.push({
          propertyId: property.property_id,
          address: property.address,
          owner:
            `${property.owner1_first_name || ""} ${property.owner1_last_name}`.trim(),
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString(),
        });
      }
    }

    logger.info(
      `Skip trace completed. Processed ${processed}/${propertyRecords.length} records.`,
    );

    const assetLicense = license?.asset_licenses;

    await revalidateCache({
      tag: "licenses",
      id: assetLicense.asset_type_slug,
    });

    await revalidateCache({
      tag: "records",
      id: assetLicense.id,
    });

    return {
      processed,
      total: propertyRecords.length,
      results: skipTraceResults,
    };
  },
});
