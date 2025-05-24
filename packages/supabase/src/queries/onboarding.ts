import type { Client } from "../types";

export async function getUserAssetTypesQuery(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("user_asset_types")
    .select("asset_type_id, asset_types(*)")
    .eq("user_id", userId);

  const assetTypes = data?.map((item) => item.asset_types);

  return { data: assetTypes, error };
}

export async function getUserLocationsQuery(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("user_locations")
    .select("*")
    .eq("user_id", userId);

  return { data, error };
}

export async function getAssetTypesQuery(supabase: Client) {
  const { data, error } = await supabase
    .from("asset_types")
    .select("*")
    .order("name");

  return { data, error };
}
