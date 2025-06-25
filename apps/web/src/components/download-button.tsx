"use client";

import { useState } from "react";

import { exportRecordsToXLSX } from "@/lib/export";
import { useTRPC } from "@/trpc/client";
import { IconFileDownload } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
// Import skip trace types from the proper package
import { Button } from "@v1/ui/button";
import { toast } from "sonner";

// Type for the actual stored API response structure (with output wrapper)

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
  const [isExporting, setIsExporting] = useState(false);

  const trpc = useTRPC();

  const { data } = useQuery(
    trpc.records.download.queryOptions(
      {
        assetLicenseId: assetLicenseId,
        locationCodes: locations,
      },
      {
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    ),
  );

  // Handle export to Excel
  const handleExport = async () => {
    if (!data) {
      return;
    }

    setIsExporting(true);

    try {
      // Format data for Excel with all requested fields
      exportRecordsToXLSX(data.data, assetTypeName);

      // Update search log status if searchLogId is provided

      toast.success("Results exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export results");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={handleExport}
      disabled={isExporting || !data}
      className="flex items-center gap-2"
    >
      <IconFileDownload className="size-4" />
      {isExporting ? "Downloading..." : "Export"}
    </Button>
  );
}
