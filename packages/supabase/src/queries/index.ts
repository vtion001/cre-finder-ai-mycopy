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
