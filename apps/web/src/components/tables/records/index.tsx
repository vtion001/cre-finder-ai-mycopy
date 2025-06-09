import { getPropertyRecords } from "@v1/supabase/cached-queries";
import { EmptyState, NoResults } from "./empty-states";
import { DataTable } from "./data-table";

const pageSize = 20;

type Props = {
  assetLicenseId: string;
};

export async function Table({ assetLicenseId }: Props) {
  const hasFilters = false;

  const { data } = await getPropertyRecords(assetLicenseId);

  if (!data?.length) {
    return hasFilters ? <NoResults /> : <EmptyState />;
  }

  return <DataTable data={data} pageSize={pageSize} />;
}
