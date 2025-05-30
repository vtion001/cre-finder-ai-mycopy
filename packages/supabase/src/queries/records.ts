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

export async function getPropertyRecordsBySearchLogQuery(
  supabase: Client,
  userId: string,
) {
  const { data, error } = await supabase
    .from("search_logs")
    .select(`
      *,
      asset_types(name),
      user_locations(display_name),
      property_records(*)
    `)
    .eq("user_id", userId)
    .eq("status", "completed")
    .not("property_records", "is", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      `Failed to get property records by search log: ${error.message}`,
    );
  }

  return {
    data,
    error,
  };
}
