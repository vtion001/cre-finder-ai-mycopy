import type { Client } from "../types";

export async function getAssetTypesQuery(supabase: Client) {
  const { data, error } = await supabase
    .from("asset_types")
    .select("*")
    .order("created_at", { ascending: true });

  return { data, error };
}

export async function getAssetTypeQuery(supabase: Client, slug: string) {
  const { data, error } = await supabase
    .from("asset_types")
    .select("*")
    .eq("slug", slug)
    .single();

  return { data, error };
}
