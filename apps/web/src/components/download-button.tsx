"use client";

import { startTransition, useCallback, useState } from "react";

import { exportRecordsToCSV, exportRecordsToXLSX } from "@/lib/export";
import { useTRPC } from "@/trpc/client";
import { IconDownload, IconFileDownload } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
// Import skip trace types from the proper package
import { Button } from "@v1/ui/button";
import { DataTableActionBarAction } from "./data-table-action-bar";

const actions = ["export-csv", "export-xlsx"] as const;

type Action = (typeof actions)[number];

interface ExportButtonProps {
  assetTypeName: string;
  assetLicenseId: string;
  locations: string[];
}

export function DownloadButton({
  assetTypeName,
  assetLicenseId,
  locations,
}: ExportButtonProps) {
  const [currentAction, setCurrentAction] = useState<Action | null>(null);

  const trpc = useTRPC();

  const { refetch } = useQuery(
    trpc.records.download.queryOptions(
      {
        assetLicenseId: assetLicenseId,
        locationCodes: locations,
      },
      {
        enabled: false,
      },
    ),
  );

  const onExportCSV = useCallback(() => {
    setCurrentAction("export-csv");
    startTransition(async () => {
      const { data } = await refetch();
      if (data) {
        exportRecordsToCSV(data.data, assetTypeName);
        setCurrentAction(null);
      }
    });
  }, [refetch]);

  const onExportXLSX = useCallback(() => {
    setCurrentAction("export-xlsx");
    startTransition(async () => {
      const { data } = await refetch();
      if (data) {
        exportRecordsToXLSX(data.data, assetTypeName);
        setCurrentAction(null);
      }
    });
  }, [refetch]);

  return (
    <div className="flex items-center gap-1.5">
      <DataTableActionBarAction
        tooltip="Export all records as CSV "
        isPending={currentAction === "export-csv"}
        onClick={onExportCSV}
      >
        <IconDownload /> CSV
      </DataTableActionBarAction>

      <DataTableActionBarAction
        tooltip="Export all records as XLSX"
        isPending={currentAction === "export-xlsx"}
        onClick={onExportXLSX}
      >
        <IconDownload /> XLSX
      </DataTableActionBarAction>
    </div>
  );
}
