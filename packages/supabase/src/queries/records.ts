import type { Client } from "../types";

export type GetPropertyRecordsParams = {
  assetLicenseId: string;
  locationCodes: string[];
  to?: number;
  from?: number;
  sort?: [string, "asc" | "desc"];
  searchQuery?: string | null;
  filters?: {
    building_size_min?: number;
    building_size_max?: number;
    lot_size_min?: number;
    lot_size_max?: number;
    last_sale_year?: number;
    last_sale_month?: number;
    year_min?: number;
    year_max?: number;
    loan_paid_off_percent_min?: number;
    loan_paid_off_percent_max?: number;
    number_of_units?: "2-4" | "5+";
    mortgage_free_and_clear?: boolean;
    tax_delinquent_year_min?: number;
    tax_delinquent_year_max?: number;
  };
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
    filters,
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

  // Apply filters
  if (filters) {
    if (filters.building_size_min) {
      query.gte("square_feet", filters.building_size_min);
    }
    if (filters.building_size_max) {
      query.lte("square_feet", filters.building_size_max);
    }
    if (filters.lot_size_min) {
      query.gte("lot_square_feet", filters.lot_size_min);
    }
    if (filters.lot_size_max) {
      query.lte("lot_square_feet", filters.lot_size_max);
    }
    if (filters.year_min) {
      query.gte("year_built", filters.year_min);
    }
    if (filters.year_max) {
      query.lte("year_built", filters.year_max);
    }
    if (filters.last_sale_year && filters.last_sale_month !== undefined) {
      // Create date from year and month
      const startDate = new Date(
        filters.last_sale_year,
        filters.last_sale_month,
        1,
      );
      const endDate = new Date(
        filters.last_sale_year,
        filters.last_sale_month + 1,
        0,
      );
      query.gte("last_sale_date", startDate.toISOString().split("T")[0]);
      query.lte("last_sale_date", endDate.toISOString().split("T")[0]);
    }
    if (filters.tax_delinquent_year_min) {
      query.gte(
        "tax_delinquent_year",
        filters.tax_delinquent_year_min.toString(),
      );
    }
    if (filters.tax_delinquent_year_max) {
      query.lte(
        "tax_delinquent_year",
        filters.tax_delinquent_year_max.toString(),
      );
    }
    if (filters.number_of_units === "2-4") {
      query.eq("mfh_2_to_4", true);
    }
    if (filters.number_of_units === "5+") {
      query.eq("mfh_5_plus", true);
    }
    if (filters.mortgage_free_and_clear) {
      query.eq("free_clear", true);
    }
  }

  const result =
    from !== undefined && to !== undefined
      ? await query.range(from, to)
      : await query;

  const { data, count, error } = result;

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

export async function getPropertyRecord(
  supabase: Client,
  propertyRecordId: string,
) {
  const { data, error } = await supabase
    .from("property_records")
    .select("*")
    .eq("id", propertyRecordId)
    .single();

  if (error) {
    throw new Error(`Failed to get property record: ${error.message}`);
  }

  return { data, error };
}
