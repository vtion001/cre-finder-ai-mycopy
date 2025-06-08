import type { Client } from "../types";

export async function getUserLicensesQuery(
  supabase: Client,
  userId: string,
  assetTypeSlug: string,
) {
  const { data, error } = await supabase
    .from("user_licenses")
    .select("location_internal_id")
    .eq("user_id", userId)
    .eq("asset_type_slug", assetTypeSlug)
    .eq("is_active", true);

  if (error) {
    throw new Error(`Failed to get user licenses: ${error.message}`);
  }

  return { data, error };
}
