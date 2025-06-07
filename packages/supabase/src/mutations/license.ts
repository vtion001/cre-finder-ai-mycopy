import type { Client } from "../types";

export async function insertUserLicense(
  supabase: Client,
  params: {
    userId: string;
    locationId: string;
    assetTypeSlugs: string[];
    licensed?: boolean;
  },
) {
  const { data, error } = await supabase.rpc("insert_user_license", {
    p_user_id: params.userId,
    p_location_id: params.locationId,
    p_asset_type_slugs: params.assetTypeSlugs,
    p_licensed: params.licensed,
  });

  return { data, error };
}
