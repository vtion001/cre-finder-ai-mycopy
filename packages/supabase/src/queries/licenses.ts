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

export async function getUserLicensesByAssetTypeQuery(
  supabase: Client,
  userId: string,
) {
  const { data, error } = await supabase
    .from("user_licenses_by_asset_type")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to get user licenses: ${error.message}`);
  }

  return { data, error };
}

export async function getAssetTypeLicensesQuery(
  supabase: Client,
  assetTypeSlug: string,
) {
  const { data, error } = await supabase
    .from("user_licenses")
    .select("*")
    .eq("asset_type_slug", assetTypeSlug)
    .eq("is_active", true);

  if (error) {
    throw new Error(`Failed to get asset type licenses: ${error.message}`);
  }

  return { data, error };
}
