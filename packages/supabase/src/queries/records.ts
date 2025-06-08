import type { Client } from "../types";

export async function getPropertyRecordsQuery(
  supabase: Client,
  userId: string,
) {
  const { data, error } = await supabase
    .from("property_records")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to get property records: ${error.message}`);
  }

  return {
    data,
    error,
  };
}
