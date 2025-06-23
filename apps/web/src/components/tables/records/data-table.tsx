"use client";

import {
  type RowSelectionState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { Tables } from "@v1/supabase/types";

import { ScrollArea, ScrollBar } from "@v1/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@v1/ui/table";
import { useMemo, useState } from "react";
import { columns } from "./columns";
import { DataTableHeader } from "./data-table-header";
import { DataTablePagination } from "./data-table-pagination";
import { NoResults } from "./empty-states";

type DataTableProps = {
  data: Tables<"property_records">[];
};

export async function DataTable({ data: initialData }: DataTableProps) {
  const data = useMemo(() => initialData, [initialData]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    getRowId: (row) => row.id,
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      rowSelection,
      columnVisibility,
    },
  });

  return (
    <Table divClassname="max-h-screen overflow-y-scroll">
      <DataTableHeader table={table} />
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className="h-[45px]"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="px-3 md:px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              <NoResults />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
