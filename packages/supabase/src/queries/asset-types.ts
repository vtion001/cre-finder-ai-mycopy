import type { Client } from "../types";


export async function getAssetTypesQuery(supabase: Client) {
  const { data, error } = await supabase
    .from("asset_types")
    .select("*")
    .order("name");

  return { data, error };
}

