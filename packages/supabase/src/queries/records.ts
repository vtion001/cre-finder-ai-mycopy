import type { Client } from "../types";

export async function getPropertyRecordsQuery(
  supabase: Client,
  assetLicenseId: string,
) {
  const { data, error } = await supabase
    .from("property_records")
    .select("*")
    .eq("asset_license_id", assetLicenseId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to get property records: ${error.message}`);
  }

  return {
    data,
    error,
  };
}
