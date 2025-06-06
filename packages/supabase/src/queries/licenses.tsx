


import type { Client } from "../types";


export async function checkUserLicenseComboQuery(
  supabase: Client,
  userId: string,
  locationId: string,
  assetTypes: string[],
) {
  const { data, error } = await supabase.rpc("user_has_license_combo", {
    p_user_id: userId,
    p_location_id: locationId,
    p_asset_types: assetTypes,
  });

  return { data, error };
}
