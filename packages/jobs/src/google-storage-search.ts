import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { getStorageFacilitiesQuery } from "@v1/property-data/queries";
import { z } from "zod";

export const googleStorageSearchTask = schemaTask({
  id: "google-storage-search",
  schema: z.object({
    city: z.string().optional(),
    county: z.string().optional(),
    state: z.string(),
  }),
  queue: {
    concurrencyLimit: 2, // Limit concurrent searches to respect Google API limits
  },
  maxDuration: 1800, // 30 minutes for large searches
  run: async (payload) => {
    const { city, county, state } = payload;

    // Validate that either city or county is provided
    if (!city && !county) {
      throw new Error("Either city or county must be provided");
    }

    const locationName = city || county;
    const locationType = city ? "city" : "county";

    if (!locationName || !state) {
      throw new Error("Location name and state must be provided");
    }

    logger.info(
      `🔍 Starting Google storage facility search for ${locationType}: ${locationName}, ${state}`,
    );

    try {
      // Call the getStorageFacilities method
      const result = await getStorageFacilitiesQuery({
        city,
        county,
        state,
      });

      logger.info(
        `✅ Found ${result.results.length} storage facilities in ${locationName}, ${state}`,
      );

      // Save results to JSON file for development/testing
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `google-storage-search-${locationName.replace(/\s+/g, "-")}-${state}-${timestamp}.json`;
      const filepath = join(process.cwd(), "data/google", filename);

      const outputData = {
        searchParams: {
          city,
          county,
          state,
          locationType,
        },
        timestamp: new Date().toISOString(),
        resultCount: result.results.length,
        results: result.results,
      };

      writeFileSync(filepath, JSON.stringify(outputData, null, 2));

      logger.info(`💾 Results saved to: ${filename}`);

      return {
        success: true,
        resultCount: result.results.length,
        location: `${locationName}, ${state}`,
        filename,
        results: result.results,
      };
    } catch (error) {
      logger.error(
        `❌ Failed to search storage facilities in ${locationName}, ${state}: ${error}`,
      );
      throw error;
    }
  },
});
