import type { Client } from "../types";

// Get user licenses for a specific asset type (using normalized structure)
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

// Get asset license with search params
export async function getAssetLicenseQuery(
  supabase: Client,
  userId: string,
  assetTypeSlug: string,
) {
  const { data, error } = await supabase
    .from("asset_licenses")
    .select("*")
    .eq("user_id", userId)
    .eq("asset_type_slug", assetTypeSlug)
    .eq("is_active", true)
    .single();

  if (error) {
    throw new Error(`Failed to get asset license: ${error.message}`);
  }

  return { data, error };
}

// Add locations to existing asset license
export async function addLocationsToAssetLicenseQuery(
  supabase: Client,
  assetLicenseId: string,
  locationData: Array<{
    location_internal_id: string;
    location_name: string;
    location_type: "city" | "county";
    location_formatted: string;
    location_state: string;
  }>,
) {
  const { data, error } = await supabase.from("location_licenses").upsert(
    locationData.map((location) => ({
      asset_license_id: assetLicenseId,
      ...location,
    })),
    {
      onConflict: "asset_license_id, location_internal_id",
    },
  );

  if (error) {
    throw new Error(
      `Failed to add locations to asset license: ${error.message}`,
    );
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

// Get detailed user licenses with asset type information and location details
export async function getUserLicensesWithDetailsQuery(
  supabase: Client,
  userId: string,
) {
  const { data, error } = await supabase
    .from("asset_licenses")
    .select(`
      id,
      asset_type_slug,
      search_params,
      is_active,
      created_at,
      updated_at,
      asset_types!inner (
        name,
        description,
        slug
      ),
      location_licenses!inner (
        id,
        location_internal_id,
        location_name,
        location_type,
        location_formatted,
        location_state,
        result_count,
        expires_at,
        is_active,
        created_at
      )
    `)
    .eq("user_id", userId)
    .eq("is_active", true)
    .eq("location_licenses.is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      `Failed to get user licenses with details: ${error.message}`,
    );
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
