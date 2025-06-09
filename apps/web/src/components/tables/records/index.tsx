import { getPropertyRecords } from "@v1/supabase/cached-queries";
import { DataTable } from "./data-table";
import { EmptyState, NoResults } from "./empty-states";

const pageSize = 20;

type Props = {
  page: number;
  sort?: [string, "asc" | "desc"];
  query?: string | null;
  assetLicenseId: string;
};

export async function Table({ assetLicenseId, page, sort, query }: Props) {
  const hasFilters = false;

  const { data } = await getPropertyRecords({
    assetLicenseId,
    from: page * pageSize,
    to: page > 0 ? pageSize : pageSize - 1,
    sort,
    searchQuery: query,
  });

  if (!data?.length) {
    return hasFilters ? <NoResults /> : <EmptyState />;
  }

  return <DataTable data={data} pageSize={pageSize} />;
}
