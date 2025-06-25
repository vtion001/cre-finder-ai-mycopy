import type { Client } from "../types";

export async function deleteRecords(supabase: Client, ids: string[]) {
  const result = await supabase
    .from("property_records")
    .delete()
    .in("id", ids)
    .select();

  if (result.error) {
    throw new Error(`Failed to delete records: ${result.error.message}`);
  }

  return result;
}
