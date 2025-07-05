export type PropertyRecord = {
  id: string;
  property_id: string;
  location_license_id: string;
  [key: string]: unknown;
};

export type RecordComparison = {
  added: number;
  updated: number;
  removed: number;
  changes: Array<{
    property_id: string;
    type: "added" | "updated" | "removed";
    changes?: Record<string, { old: unknown; new: unknown }>;
  }>;
};

export function compareRecords(
  oldRecords: PropertyRecord[],
  newRecords: PropertyRecord[],
): RecordComparison {
  const oldMap = new Map(
    oldRecords.map((record) => [record.property_id, record]),
  );
  const newMap = new Map(
    newRecords.map((record) => [record.property_id, record]),
  );

  const comparison: RecordComparison = {
    added: 0,
    updated: 0,
    removed: 0,
    changes: [],
  };

  // Find removed records
  for (const [propertyId, oldRecord] of oldMap) {
    if (!newMap.has(propertyId)) {
      comparison.removed++;
      comparison.changes.push({
        property_id: propertyId,
        type: "removed",
      });
    }
  }

  // Find added and updated records
  for (const [propertyId, newRecord] of newMap) {
    const oldRecord = oldMap.get(propertyId);

    if (!oldRecord) {
      // New record
      comparison.added++;
      comparison.changes.push({
        property_id: propertyId,
        type: "added",
      });
    } else {
      // Check for updates
      const changes: Record<string, { old: unknown; new: unknown }> = {};

      // Compare all fields except timestamps and IDs
      const excludeFields = ["id", "created_at", "updated_at"];

      for (const [key, newValue] of Object.entries(newRecord)) {
        if (excludeFields.includes(key)) continue;

        const oldValue = oldRecord[key];
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          changes[key] = { old: oldValue, new: newValue };
        }
      }

      if (Object.keys(changes).length > 0) {
        comparison.updated++;
        comparison.changes.push({
          property_id: propertyId,
          type: "updated",
          changes,
        });
      }
    }
  }

  return comparison;
}


