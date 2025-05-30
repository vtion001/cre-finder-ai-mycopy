import type { Client } from "../types";

export async function getSearchLogQuery(supabase: Client, searchLogId: string) {
  const { data, error } = await supabase
    .from("search_logs")
    .select("*")
    .eq("id", searchLogId)
    .single();

  if (error) {
    throw new Error(`Failed to get search log: ${error.message}`);
  }

  return { data, error };
}

export async function getRecentSearchActivityQuery(
  supabase: Client,
  userId: string,
) {
  const { data: searchLogs, error } = await supabase
    .from("search_logs")
    .select(
      `
      *,
      asset_types(name),
      user_locations(display_name)
      `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    throw new Error(`Failed to get recent search activity: ${error.message}`);
  }

  return {
    data: searchLogs,
    error,
  };
}
