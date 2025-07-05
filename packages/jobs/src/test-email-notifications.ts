/**
 * Trigger task for testing email notifications
 *
 * This task demonstrates how to test the email notification functionality
 * for property record updates using real property data.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import type { PropertySearchResult } from "@v1/property-data/types";
import { mapPropertyToRecord } from "@v1/property-data/utils";
import type { Tables } from "@v1/supabase/types";
import { LoopsClient } from "loops";
import { z } from "zod";
import { compareRecords } from "./utils/comparison";
import {
  sendDataReadyNotification,
  sendPropertyUpdateNotification,
  testLoopsConnection,
} from "./utils/email";

type PropertyRecord = Tables<"property_records">;

interface TestResult {
  success: boolean;
  error?: string;
  [key: string]: unknown;
}

/**
 * Load property data from JSON file and convert to PropertyRecord format
 */
function loadPropertyData(filename: string): PropertyRecord[] {
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

  logger.info(`Loading test data from: ${filePath}`);
  const rawData = JSON.parse(fs.readFileSync(filePath, "utf8")) as {
    data: PropertySearchResult[];
  };

  return rawData.data.map(
    (property) =>
      mapPropertyToRecord(
        property,
        "test-location-license-id",
        "test-user-id",
        "test-asset-license-id",
      ) as PropertyRecord,
  );
}

export const testEmailNotificationsTask = schemaTask({
  id: "test-email-notifications",
  schema: z.object({
    testEmail: z.string().email(),
    testType: z
      .enum(["connection", "data-ready", "property-updates", "all"])
      .optional()
      .default("all"),
  }),
  queue: {
    concurrencyLimit: 1,
  },
  maxDuration: 300, // 5 minutes
  run: async (payload) => {
    const { testEmail, testType } = payload;

    // Check if API key is set
    if (!process.env.LOOPS_API_KEY) {
      throw new Error("LOOPS_API_KEY environment variable is not set");
    }

    const loops = new LoopsClient(process.env.LOOPS_API_KEY);
    const results: Record<string, TestResult> = {};

    logger.info("🧪 Testing Loops.so Email Notifications", {
      testEmail,
      testType,
    });

    // Test connection if requested
    if (testType === "connection" || testType === "all") {
      logger.info("Testing Loops.so connection...");

      try {
        const connectionResult = await testLoopsConnection({ loops });

        if (connectionResult.success) {
          logger.info("✅ Connected to Loops.so successfully");
          results.connection = {
            success: true,
            templates: connectionResult.templates,
          };

          if (
            connectionResult.templates &&
            connectionResult.templates.length > 0
          ) {
            logger.info("📧 Available transactional email templates:", {
              templates: connectionResult.templates.map((t) => ({
                id: t.id,
                lastUpdated: t.lastUpdated,
                dataVariables: t.dataVariables,
              })),
            });
          } else {
            logger.warn(
              "No templates found. Create templates in your Loops.so dashboard first.",
            );
          }
        } else {
          logger.error("❌ Failed to connect to Loops.so");
          results.connection = { success: false };
        }
      } catch (error) {
        logger.error("❌ Error testing connection:", { error });
        results.connection = { success: false, error: String(error) };
      }
    }

    // Test data ready email if requested
    if (testType === "data-ready" || testType === "all") {
      logger.info("Testing Data Ready notification with real data...");

      try {
        // Load property data
        const propertyData = loadPropertyData("property-records-example.json");

        await sendDataReadyNotification(
          loops,
          testEmail,
          propertyData.length,
          "Vero Beach, FL",
          "Multi-Family Residential",
        );

        logger.info(
          `✅ Data Ready notification sent successfully for ${propertyData.length} properties`,
        );
        results.dataReady = {
          success: true,
          propertyCount: propertyData.length,
          location: "Vero Beach, FL",
          assetType: "Multi-Family Residential",
        };
      } catch (error) {
        logger.error("❌ Error sending Data Ready notification:", { error });
        results.dataReady = { success: false, error: String(error) };
      }
    }

    // Test property update email if requested
    if (testType === "property-updates" || testType === "all") {
      logger.info(
        "Testing Property Updates notification with real data comparison...",
      );

      try {
        // Load original and modified property data
        const originalData = loadPropertyData("property-records-example.json");
        const modifiedData = loadPropertyData(
          "property-records-example-modified.json",
        );

        // Compare the data to find changes
        const comparison = compareRecords(originalData, modifiedData);

        logger.info(`Found ${comparison.changes.length} changes`);
        comparison.changes.forEach((change) => {
          logger.info(`- ${change.type}: ${change.property_id}`);
          if (change.changes) {
            Object.keys(change.changes).forEach((field) => {
              const fieldChange = change.changes![field];
              if (fieldChange) {
                logger.info(
                  `  ${field}: ${fieldChange.old} → ${fieldChange.new}`,
                );
              }
            });
          }
        });

        if (comparison.changes.length > 0) {
          await sendPropertyUpdateNotification(
            loops,
            testEmail,
            "Vero Beach, FL",
            "Multi-Family Residential",
            comparison.changes,
          );
          logger.info("✅ Property Updates notification sent successfully");
          results.propertyUpdates = {
            success: true,
            changesCount: comparison.changes.length,
            location: "Vero Beach, FL",
            assetType: "Multi-Family Residential",
          };
        } else {
          logger.info("ℹ️ No changes detected between the datasets");
          results.propertyUpdates = {
            success: true,
            changesCount: 0,
            message: "No changes detected between the datasets",
          };
        }
      } catch (error) {
        logger.error("❌ Error sending Property Updates notification:", {
          error,
        });
        results.propertyUpdates = { success: false, error: String(error) };
      }
    }

    logger.info("🎉 Email notification tests completed!", { results });

    return {
      success: true,
      results,
      summary: {
        testsRun: Object.keys(results).length,
        allSuccessful: Object.values(results).every((r) => r.success),
      },
    };
  },
});
