import type { Client } from "../types";

export async function getFavoriteSearchesQuery(
  supabase: Client,
  userId: string,
) {
  const { data, error } = await supabase
    .from("favorite_searches")
    .select(`
        *,
        search_logs(*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

export interface GetSearchHistoryParams {
  page: number;
  pageSize: number;
}

export async function getSearchHistoryQuery(
  supabase: Client,
  userId: string,
  { page, pageSize }: GetSearchHistoryParams,
) {
  const offset = (page - 1) * pageSize;

  // Get total count for pagination
  const { count } = await supabase
    .from("search_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Get search history with pagination
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
    .range(offset, offset + pageSize - 1);

  if (error) {
    throw new Error(`Failed to get search history: ${error.message}`);
  }

  return {
    data: searchLogs,
    pagination: {
      total: count || 0,
      page,
      pageSize,
      pageCount: Math.ceil((count || 0) / pageSize),
    },
  };
}

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
