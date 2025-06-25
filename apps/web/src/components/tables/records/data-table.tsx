"use client";

import {
  type PaginationState,
  type RowSelectionState,
  type Updater,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { Tables } from "@v1/supabase/types";

import { DownloadButton } from "@/components/download-button";
import type { getPropertyRecordsQuery } from "@v1/supabase/queries";
import { ScrollArea, ScrollBar } from "@v1/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@v1/ui/table";
import { parseAsInteger, useQueryState } from "nuqs";
import React, { use, useMemo, useState } from "react";
import { columns } from "./columns";
import { DataTableHeader } from "./data-table-header";
import { DataTablePagination } from "./data-table-pagination";
import { EmptyState, NoResults } from "./empty-states";
import { RecordsTableActionBar } from "./records-action-bar";

type DataTableProps = {
  dataPromise: ReturnType<typeof getPropertyRecordsQuery>;
  hasFilters: boolean;
  assetTypeName: string;
  assetLicenseId: string;
  locations: string[];
};

export function DataTable({
  dataPromise,
  hasFilters,
  assetTypeName,
  assetLicenseId,
  locations,
}: DataTableProps) {
  const { data, meta } = use(dataPromise);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withOptions({ shallow: false }).withDefault(1),
  );
  const [perPage, setPerPage] = useQueryState(
    "per_page",
    parseAsInteger.withOptions({ shallow: false }).withDefault(25),
  );

  const pagination: PaginationState = React.useMemo(() => {
    return {
      pageIndex: page - 1,
      pageSize: perPage,
    };
  }, [page, perPage]);

  const pageCount = useMemo(() => {
    if (!meta.count) {
      return 1;
    }

    return Math.ceil(meta.count / perPage);
  }, [meta.count, perPage]);

  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      if (typeof updaterOrValue === "function") {
        const newPagination = updaterOrValue(pagination);
        void setPage(newPagination.pageIndex + 1);
        void setPerPage(newPagination.pageSize);
      } else {
        void setPage(updaterOrValue.pageIndex + 1);
        void setPerPage(updaterOrValue.pageSize);
      }
    },
    [pagination, setPage, setPerPage],
  );

  const table = useReactTable({
    getRowId: (row) => row.id,
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    manualPagination: true,
    pageCount,
    state: {
      pagination,
      rowSelection,
    },
  });

  if (!data?.length) {
    return hasFilters ? <NoResults /> : <EmptyState />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        <ScrollArea hideScrollbar className="h-full rounded-md border">
          <Table divClassname="overflow-y-scroll">
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <NoResults />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="flex-shrink-0 flex flex-row items-center w-full">
        <DownloadButton
          assetTypeName={assetTypeName}
          assetLicenseId={assetLicenseId}
          locations={locations}
        />

        <DataTablePagination table={table} total={meta.count || 0} />

        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <RecordsTableActionBar table={table} assetTypeName={assetTypeName} />
        )}
      </div>
    </div>
  );
}
