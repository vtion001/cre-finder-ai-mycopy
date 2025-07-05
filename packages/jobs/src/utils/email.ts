import { logger } from "@trigger.dev/sdk/v3";
import { format } from "date-fns";
import type { LoopsClient } from "loops";
import type { RecordComparison } from "./comparison";

const formatEmailDate = (date: string | Date) => {
  try {
    return format(new Date(date), "M-d-yyyy");
  } catch {
    return "Unknown date";
  }
};

export async function sendDataReadyNotification(
  loops: LoopsClient,
  userEmail: string,
  resultCount: number,
  locationName: string,
  assetTypeName: string,
) {
  try {
    const response = await loops.sendTransactionalEmail({
      transactionalId: process.env.LOOPS_DATA_READY_TEMPLATE_ID!,
      email: userEmail,
      dataVariables: {
        resultCount: resultCount.toString(),
        locationName,
        assetTypeName,
      },
    });

    if (response.success) {
      logger.info(`Data ready notification sent to ${userEmail}`, {
        resultCount,
        locationName,
        assetTypeName,
      });
    } else {
      logger.error(`Failed to send data ready notification to ${userEmail}`, {
        error: "Email sending failed",
        userEmail,
      });
    }
  } catch (error) {
    logger.error(`Error sending data ready notification to ${userEmail}`, {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
  }
}

export async function sendPropertyUpdateNotification(
  loops: LoopsClient,
  userEmail: string,
  locationName: string,
  assetTypeName: string,
  changes: RecordComparison["changes"],
) {
  try {
    // Filter for meaningful updates (sales, ownership changes)
    const significantChanges = changes.filter((change) => {
      if (change.type !== "updated" || !change.changes) return false;

      // Check for ownership or sale changes
      const hasOwnershipChange =
        change.changes.owner1_last_name ||
        change.changes.owner1_first_name ||
        change.changes.owner2_last_name ||
        change.changes.owner2_first_name;

      const hasSaleChange =
        change.changes.last_sale_date || change.changes.last_sale_amount;

      return hasOwnershipChange || hasSaleChange;
    });

    if (significantChanges.length === 0) {
      logger.info("No significant changes to notify about");
      return;
    }

    // Format changes for email - create a simple string list
    const changeDescriptions = significantChanges.map((change) => {
      const changes = change.changes!;
      let changeDescription = `${change.property_id} `;

      // Handle sale changes
      if (changes.last_sale_date) {
        const saleDate = formatEmailDate(changes.last_sale_date.new as string);
        changeDescription += `sold on ${saleDate}`;
      }

      // Handle ownership changes
      if (changes.owner1_last_name || changes.owner1_first_name) {
        const newOwner =
          [changes.owner1_first_name?.new, changes.owner1_last_name?.new]
            .filter(Boolean)
            .join(" ") || changes.owner1_last_name?.new;

        if (changeDescription.includes("sold")) {
          changeDescription += ` and the new owner is ${newOwner}`;
        } else {
          changeDescription += `ownership changed to ${newOwner}`;
        }
      }

      return changeDescription;
    });

    const response = await loops.sendTransactionalEmail({
      transactionalId: process.env.LOOPS_PROPERTY_UPDATES_TEMPLATE_ID!,
      email: userEmail,
      dataVariables: {
        locationName,
        assetTypeName,
        changesCount: changeDescriptions.length.toString(),
        changesList: changeDescriptions.join("; "),
      },
    });

    if (response.success) {
      logger.info(`Property update notification sent to ${userEmail}`, {
        changesCount: changeDescriptions.length,
        locationName,
        assetTypeName,
      });
    } else {
      logger.error(
        `Failed to send property update notification to ${userEmail}`,
        {
          error: "Email sending failed",
          userEmail,
        },
      );
    }
  } catch (error) {
    logger.error(`Error sending property update notification to ${userEmail}`, {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
  }
}

export async function testLoopsConnection({ loops }: { loops: LoopsClient }) {
  try {
    // Test API key
    const keyTest = await loops.testApiKey();
    if (keyTest.success) {
      logger.info(`Connected to Loops.so (Team: ${keyTest.teamName})`);
    }

    // List available transactional emails
    const templates = await loops.getTransactionalEmails();
    logger.info("Available transactional email templates:", {
      count: templates.data?.length || 0,
      templates:
        templates.data?.map((t) => ({
          id: t.id,
          lastUpdated: t.lastUpdated,
          dataVariables: t.dataVariables,
        })) || [],
    });

    return { success: true, templates: templates.data };
  } catch (error) {
    logger.error("Error connecting to Loops.so:", {
      error: error instanceof Error ? error.message : String(error),
    });
    return { success: false, error };
  }
}

export { formatEmailDate };
