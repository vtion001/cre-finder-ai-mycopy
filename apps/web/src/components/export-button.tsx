"use client";

import { exportSearchResultsAction } from "@/actions/export-search-results-action";
import { useState } from "react";

import { IconDownload } from "@tabler/icons-react";
import { Button } from "@v1/ui/button";
import { DownloadIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

interface ExportButtonProps {
  searchLogId: string;
  resultCount: number;
}

export function ExportButton({ searchLogId, resultCount }: ExportButtonProps) {
  const { execute, isExecuting } = useAction(exportSearchResultsAction, {
    onSuccess: ({ data: result }) => {
      toast.success(
        `Successfully exported ${result?.recordsInserted} property records to database`,
      );
    },
  });

  const handleExport = async () => {
    execute({ searchLogId });
  };

  return (
    <div className="bg-primary/10 text-primary border-primary rounded-md p-4 flex items-center justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <IconDownload className="size-5" />
          <h2 className="text-lg font-semibold leading-3">Ready to save!</h2>
        </div>

        <div className="space-y-3 ml-7">
          <div className="text-sm">
            Save all{" "}
            <span className="font-semibold">
              {resultCount.toLocaleString()}
            </span>{" "}
            properties with complete data fields to your database.
          </div>
        </div>
      </div>

      <Button
        size="lg"
        onClick={handleExport}
        disabled={isExecuting}
        className="flex items-center gap-1.5"
      >
        <DownloadIcon className="h-3 w-3" />
        {isExecuting ? "Saving..." : "Save to Database"}
      </Button>
    </div>
  );
}
