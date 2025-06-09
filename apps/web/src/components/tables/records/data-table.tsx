"use client";

import type { Tables } from "@v1/supabase/types";
import { Table, TableBody } from "@v1/ui/table";
import { useMemo } from "react";
import { DataTableHeader } from "./data-table-header";
import { DataTableRow } from "./data-table-row";

type DataTableProps = {
  data: Tables<"property_records">[];
  pageSize: number;
};

export function DataTable({ data: initialData, pageSize }: DataTableProps) {
  const data = useMemo(() => initialData, [initialData]);

  return (
    <>
      <Table>
        <DataTableHeader />

        <TableBody>
          {data.map((row) => (
            <DataTableRow key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>
    </>
  );
}
