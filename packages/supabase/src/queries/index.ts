import type { Client } from "../types";

export async function getUserQuery(supabase: Client, userId: string) {
  const result = await supabase
    .from("users")
    .select()
    .eq("id", userId)
    .single()
    .throwOnError();

  return result;
}

export async function getUserAssetTypesQuery(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("user_asset_types")
    .select("asset_type_id, asset_types(*)")
    .eq("user_id", userId);

  // Transform the data to return just the asset types
  const assetTypes = data?.map((item) => item.asset_types);

  return { data: assetTypes, error: null };
}

export async function getFavoriteSearches(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("favorite_searches")
    .select(
      `
          *,
          search_logs (*)
        `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

interface GetSerchHistoryParams {
  userId: string;
  page: number;
  pageSize: number;
}

export async function getSearchHistory(
  supabase: Client,
  { userId, page, pageSize }: GetSerchHistoryParams,
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
      user_locations(name)
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
