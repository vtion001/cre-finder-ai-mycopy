"use client";

import { formatNumber, formatSearchParams } from "@/lib/format";
import type { Tables } from "@v1/supabase/types";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import { Pagination } from "@v1/ui/pagination";
import { Skeleton } from "@v1/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@v1/ui/table";
import { format } from "date-fns";
import {
  CheckCircleIcon,
  ClockIcon,
  DownloadIcon,
  HistoryIcon,
  PlayIcon,
  SearchIcon,
  StarIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SaveAsFavoriteDialog } from "./save-as-favorite-dialog";

type SearchParams = {
  locations?: string[] | undefined;
  building_size_min?: number | undefined;
  building_size_max?: number | undefined;
  lot_size_min?: number | undefined;
  lot_size_max?: number | undefined;
  last_sale_date?: Date | undefined;
  year_min?: number | undefined;
  year_max?: number | undefined;
};

type SearchLog = Tables<"search_logs"> & {
  search_parameters: SearchParams;
};

interface SearchHistoryTableProps {
  searchLogs: SearchLog[];
  isLoading?: boolean;
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
  };
}

export function SearchHistoryTable({
  searchLogs,
  isLoading = false,
  pagination,
}: SearchHistoryTableProps) {
  const router = useRouter();
  const [selectedSearchLog, setSelectedSearchLog] =
    useState<Tables<"search_logs"> | null>(null);

  const [isSaveFavoriteDialogOpen, setIsSaveFavoriteDialogOpen] =
    useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="space-y-2">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
        </div>
      </div>
    );
  }

  if (searchLogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <HistoryIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-medium">No search history</h3>
        <p className="text-muted-foreground mt-1 mb-4">
          Your search history will appear here once you start searching for
          properties.
        </p>
        <Button asChild>
          <a href="/dashboard/search">
            <SearchIcon className="h-4 w-4 mr-2" />
            Search Properties
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Date & Time</TableHead>
              <TableHead className="w-[40%]">Search Parameters</TableHead>
              <TableHead className="text-right">Results</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {searchLogs.map((searchLog) => (
              <TableRow key={searchLog.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {format(new Date(searchLog.created_at!), "MMM d, yyyy")}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" />
                      {format(new Date(searchLog.created_at!), "h:mm a")}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatSearchParams(searchLog.search_parameters)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline">
                    {formatNumber(searchLog.result_count)} results
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {searchLog.status === "completed" ? (
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 flex items-center gap-1 mx-auto">
                      <CheckCircleIcon className="h-3 w-3" />
                      Completed
                    </Badge>
                  ) : searchLog.status === "pending" ? (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200 flex items-center gap-1 mx-auto">
                      <ClockIcon className="h-3 w-3" />
                      Pending
                    </Badge>
                  ) : searchLog.status === "failed" ? (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200 flex items-center gap-1 mx-auto">
                      <span className="text-xs">!</span>
                      Failed
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200 flex items-center gap-1 mx-auto">
                      <SearchIcon className="h-3 w-3" />
                      Preview
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedSearchLog(searchLog);
                        setIsSaveFavoriteDialogOpen(true);
                      }}
                      title="Save as favorite"
                    >
                      <StarIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.pageCount > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination />
        </div>
      )}

      {selectedSearchLog && (
        <SaveAsFavoriteDialog
          searchLog={selectedSearchLog}
          open={isSaveFavoriteDialogOpen}
          onOpenChange={setIsSaveFavoriteDialogOpen}
        />
      )}
    </div>
  );
}
