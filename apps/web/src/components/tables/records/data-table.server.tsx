import { getPropertyRecords } from "@v1/supabase/cached-queries";
import { DataTable } from "./data-table";
import { EmptyState, NoResults } from "./empty-states";

type Props = {
  page: number;
  per_page: number;
  sort?: [string, "asc" | "desc"];
  query?: string | null;
  assetLicenseId: string;
  locationCodes: string[];
};

export async function DataTableServer({
  assetLicenseId,
  locationCodes,
  page,
  per_page,
  sort,
  query,
}: Props) {
  const hasFilters = true;

  const from = (page - 1) * per_page;
  const to = from + per_page - 1;

  const { data } = await getPropertyRecords({
    assetLicenseId,
    locationCodes,
    from,
    to,
    sort,
    searchQuery: query,
  });

  if (!data?.length) {
    return hasFilters ? <NoResults /> : <EmptyState />;
  }

  return <DataTable data={data} />;
}
