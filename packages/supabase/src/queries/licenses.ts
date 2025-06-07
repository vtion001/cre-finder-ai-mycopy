import type { Client } from "../types";

export async function checkUserLicenseComboQuery(
  supabase: Client,
  userId: string,
  locationId: string,
  assetTypes: string[],
) {
  const { data } = await supabase.rpc("user_has_license_combo", {
    p_user_id: userId,
    p_location_id: locationId,
    p_asset_types: assetTypes,
  });

  if (data) {
    const { data: assetTypesData } = await supabase
      .from("asset_types")
      .select("name")
      .in("slug", assetTypes);

    return {
      hasLicense: data,
      assetTypes: assetTypesData?.map((a) => a.name),
    };
  }

  return { hasLicense: data };
}
