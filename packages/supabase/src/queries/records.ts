import type { Client } from "../types";

export type GetPropertyRecordsParams = {
  assetLicenseId: string;
  to: number;
  from: number;
  sort?: [string, "asc" | "desc"];
  searchQuery?: string | null;
  // filter?: {

  // };
};

export async function getPropertyRecordsQuery(
  supabase: Client,
  { assetLicenseId, to, from, sort, searchQuery }: GetPropertyRecordsParams,
) {
  console.log("Query params:", {
    assetLicenseId,
    to,
    from,
    sort,
    searchQuery,
  });

  const query = supabase
    .from("property_records")
    .select("*", { count: "exact" })
    .eq("asset_license_id", assetLicenseId)
    .order("created_at", { ascending: false });

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
