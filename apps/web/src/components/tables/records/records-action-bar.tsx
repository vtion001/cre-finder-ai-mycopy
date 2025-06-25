"use client";

import type { Table } from "@tanstack/react-table";
import { Download, Trash2 } from "lucide-react";
import * as React from "react";

import { deleteRecordsAction } from "@/actions/records";
import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from "@/components/data-table-action-bar";
import { exportRecordsToCSV, exportRecordsToXLSX } from "@/lib/export";
import type { Tables } from "@v1/supabase/types";
import { Separator } from "@v1/ui/separator";
import { useAction } from "next-safe-action/hooks";
// import { deleteRecords, updateRecords } from "../_lib/actions";

const actions = ["export-csv", "export-xlsx", "delete"] as const;

type Action = (typeof actions)[number];

type Record = Tables<"property_records">;

interface RecordsTableActionBarProps {
  table: Table<Record>;
  assetTypeName: string;
}

export function RecordsTableActionBar({
  table,
  assetTypeName,
}: RecordsTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = React.useTransition();
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null);

  const deleteRecords = useAction(deleteRecordsAction);

  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction],
  );

  const onExportCSV = React.useCallback(() => {
    setCurrentAction("export-csv");
    startTransition(() => {
      const originalData = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original);
      exportRecordsToCSV(originalData, assetTypeName);
    });
  }, [table]);

  const onExportXLSX = React.useCallback(() => {
    setCurrentAction("export-xlsx");
    startTransition(() => {
      const originalData = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original);
      exportRecordsToXLSX(originalData, assetTypeName);
    });
  }, [table]);

  const onRecordDelete = React.useCallback(() => {
    setCurrentAction("delete");
    startTransition(async () => {
      await deleteRecords.executeAsync({
        ids: rows.map((row) => row.original.id),
      });

      table.toggleAllRowsSelected(false);
    });
  }, [rows, table]);

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-5 sm:block"
      />
      <div className="flex items-center gap-1.5">
        <DataTableActionBarAction
          tooltip="Export records as CSV"
          isPending={getIsActionPending("export-csv")}
          onClick={onExportCSV}
        >
          <Download /> CSV
        </DataTableActionBarAction>

        <DataTableActionBarAction
          tooltip="Export records as XLSX"
          isPending={getIsActionPending("export-xlsx")}
          onClick={onExportXLSX}
        >
          <Download /> XLSX
        </DataTableActionBarAction>
        <DataTableActionBarAction
          size="icon"
          tooltip="Delete records"
          isPending={getIsActionPending("delete")}
          onClick={onRecordDelete}
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  );
}
