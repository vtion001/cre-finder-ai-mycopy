import type { Client } from "../types";

export type GetPropertyRecordsParams = {
  assetLicenseId: string;
  locationCodes: string[];
  to: number;
  from: number;
  sort?: [string, "asc" | "desc"];
  searchQuery?: string | null;
  // filter?: {

  // };
};

export async function getPropertyRecordsQuery(
  supabase: Client,
  {
    assetLicenseId,
    locationCodes,
    to,
    from,
    sort,
    searchQuery,
  }: GetPropertyRecordsParams,
) {
  const query = supabase
    .from("property_records")
    .select(
      `
      *,
      location_licenses!inner (
        location_internal_id
      )
    `,
      { count: "exact" },
    )
    .eq("asset_license_id", assetLicenseId)
    .in("location_licenses.location_internal_id", locationCodes);

  if (sort) {
    const [column, value] = sort;
    const ascending = value === "asc";

    query.order(column, { ascending });
  } else {
    query.order("created_at", { ascending: false });
  }

  if (searchQuery) {
    query.ilike("address", `%${searchQuery}%`);
  }

  const { data, count, error } = await query.range(from, to);

  if (error) {
    throw new Error(`Failed to get property records: ${error.message}`);
  }

  return {
    data,
    meta: {
      count,
    },
  };
}
