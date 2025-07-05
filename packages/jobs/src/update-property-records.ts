import * as fs from "node:fs";
import * as path from "node:path";
import { logger, schemaTask, tasks } from "@trigger.dev/sdk/v3";
import { getPropertySearchQuery } from "@v1/property-data/queries";
import type {
  GetPropertySearchParams,
  PropertySearchResult,
} from "@v1/property-data/types";
import { mapPropertyToRecord } from "@v1/property-data/utils";
import { createClient } from "@v1/supabase/job";
import { LoopsClient } from "loops";
import { z } from "zod";
import type { skipTraceTask } from "./skip-trace-results";
import { compareRecords } from "./utils/comparison";
import {
  sendDataReadyNotification,
  sendPropertyUpdateNotification,
} from "./utils/email";
import { revalidateCache } from "./utils/revalidate-cache";

function loadTestPropertyData(filename: string): PropertySearchResult[] {
  // Handle different working directories for Trigger.dev vs local execution
  const possiblePaths = [
    path.join(__dirname, "../data/records", filename),
    path.join(__dirname, "data/records", filename),
    path.join(process.cwd(), "packages/jobs/src/data/records", filename),
    path.join(process.cwd(), "src/data/records", filename),
  ];

  let filePath: string | null = null;
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      filePath = testPath;
      break;
    }
  }

  if (!filePath) {
    throw new Error(
      `Could not find test data file: ${filename}. Searched paths: ${possiblePaths.join(", ")}. Current working directory: ${process.cwd()}`,
    );
  }

  logger.info(`Loading test property data from: ${filePath}`);
  const rawData = JSON.parse(fs.readFileSync(filePath, "utf8")) as {
    data: PropertySearchResult[];
  };

  return rawData.data;
}

export const updatePropertyRecordsTask = schemaTask({
  id: "update-property-records",
  schema: z.object({
    licenseId: z.string(),
    count: z.boolean().optional().default(false),
    useTestData: z.boolean().optional().default(false),
  }),
  queue: {
    concurrencyLimit: 10,
  },
  maxDuration: 300,

  run: async (payload) => {
    const { licenseId, count, useTestData } = payload;
    const supabase = createClient();

    const { data: license } = await supabase
      .from("location_licenses")
      .select(`
            *,
            asset_licenses!inner (
              *
            )
        `)
      .eq("id", licenseId)
      .single();

    const assetLicense = license?.asset_licenses;

    if (!license || !assetLicense) {
      throw new Error(`License not found: ${licenseId}`);
    }

    logger.info(
      `Updating property records for license [${license.id}] for location [${license.location_internal_id}]${useTestData ? " (using test data)" : ""}`,
    );

    const { data: assetType } = await supabase
      .from("asset_types")
      .select("*")
      .eq("slug", assetLicense.asset_type_slug)
      .single();

    if (!assetType || !assetType.slug) {
      throw new Error("Asset type not found");
    }

    let propertyData: PropertySearchResult[];
    let executionTime = 0;

    if (useTestData) {
      // Load test data instead of fetching from API
      logger.info("Loading test property data...");
      const startTime = Date.now();
      propertyData = loadTestPropertyData("property-records-example.json");
      executionTime = Date.now() - startTime;

      logger.info(
        `Loaded ${propertyData.length} test properties in ${executionTime}ms for license [${license.id}]`,
      );
    } else {
      // Fetch from API as usual
      const allowedUseCodes = assetLicense.use_codes || [];
      const filteredUseCodes =
        allowedUseCodes.length > 0
          ? assetType.use_codes?.filter((code) =>
              allowedUseCodes.includes(code),
            )
          : assetType.use_codes;

      const { response, executionTime: apiExecutionTime } =
        await getPropertySearchQuery(
          {
            slug: assetType.slug!,
            name: assetType.name,
            use_codes: filteredUseCodes || [],
          },
          license.location_internal_id,
          assetLicense.search_params as unknown as GetPropertySearchParams,
        );

      propertyData = response.data;
      executionTime = apiExecutionTime;

      logger.info(
        `Fetched ${propertyData.length} properties in ${executionTime}ms for license [${license.id}] for location [${license.location_internal_id}]`,
      );
    }

    const records = propertyData.map((property) =>
      mapPropertyToRecord(
        property,
        license.id,
        assetLicense.user_id,
        assetLicense.id,
      ),
    );

    // Get existing records before upsert for comparison
    const { data: existingRecords } = await supabase
      .from("property_records")
      .select("*")
      .eq("location_license_id", license.id);

    const { data: newRecords, error } = await supabase
      .from("property_records")
      .upsert(records, {
        onConflict: "location_license_id, property_id",
      })
      .select();

    if (error) {
      throw new Error(`Failed to insert records: ${error.message}`);
    }

    // Compare old and new records
    const comparison = compareRecords(existingRecords || [], newRecords || []);

    logger.info(
      `Record comparison for license [${license.id}]: ${comparison.added} added, ${comparison.updated} updated, ${comparison.removed} removed`,
      {
        licenseId: license.id,
        locationId: license.location_internal_id,
        comparison: {
          added: comparison.added,
          updated: comparison.updated,
          removed: comparison.removed,
          totalChanges: comparison.changes.length,
        },
      },
    );

    // Log detailed changes if there are any updates
    if (comparison.updated > 0) {
      const updatedChanges = comparison.changes.filter(
        (change) => change.type === "updated",
      );
      logger.info(`Detailed updates for license [${license.id}]:`, {
        licenseId: license.id,
        updatedRecords: updatedChanges.map((change) => ({
          property_id: change.property_id,
          changedFields: Object.keys(change.changes || {}),
          changes: change.changes,
        })),
      });
    }

    // Send email notifications
    try {
      // Check if API key is set for email notifications
      if (!process.env.LOOPS_API_KEY) {
        logger.warn("LOOPS_API_KEY not set, skipping email notifications");
      } else {
        const loops = new LoopsClient(process.env.LOOPS_API_KEY);

        // Get user email for notifications
        const { data: user } = await supabase
          .from("users")
          .select("email")
          .eq("id", assetLicense.user_id)
          .single();

        if (user?.email) {
          const isFirstUpdate =
            !existingRecords || existingRecords.length === 0;

          if (isFirstUpdate && newRecords && newRecords.length > 0) {
            // First update - send data ready notification
            await sendDataReadyNotification(
              loops,
              user.email,
              newRecords.length,
              license.location_name,
              assetType.name,
            );
          } else if (comparison.updated > 0) {
            // Subsequent updates - send property change notifications
            await sendPropertyUpdateNotification(
              loops,
              user.email,
              license.location_name,
              assetType.name,
              comparison.changes,
            );
          }
        }
      }
    } catch (emailError) {
      // Don't fail the entire task if email sending fails
      logger.error(
        `Failed to send email notifications for license [${license.id}]`,
        {
          error:
            emailError instanceof Error
              ? emailError.message
              : String(emailError),
          licenseId: license.id,
        },
      );
    }

    // Only trigger skip trace for real data, not test data
    if (!useTestData) {
      await tasks.trigger<typeof skipTraceTask>("skip-trace-task", {
        licenseId: license.id,
      });
    } else {
      logger.info("Skipping skip trace task when using test data");
    }

    await revalidateCache({
      tag: "licenses",
      id: assetLicense.asset_type_slug,
    });

    await revalidateCache({
      tag: "records",
      id: assetLicense.id,
    });

    return {
      records: newRecords,
      comparison,
    };
  },
});
