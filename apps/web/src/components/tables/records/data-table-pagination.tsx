"use client";

import type { Table } from "@tanstack/react-table";
import { Button } from "@v1/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@v1/ui/select";
import { Skeleton } from "@v1/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PropertyRecord } from "./columns";

type DataTablePaginationProps = {
  table?: Table<PropertyRecord>;
  total: number;
  loading?: boolean;
};

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function DataTablePagination({
  table,
  total,
  loading = false,
}: DataTablePaginationProps) {
  const pageIndex = table?.getState().pagination.pageIndex ?? 0;
  const pageSize = table?.getState().pagination.pageSize ?? 0;

  const startItem = total === 0 ? 0 : pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-background w-full">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">Rows per page</p>
          <Select
            value={`${table?.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table?.setPageSize(Number(value));
            }}
            disabled={loading}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {loading ? (
          <Skeleton className="h-5 w-32" />
        ) : (
          <div className="text-sm text-muted-foreground">
            Showing {startItem} - {endItem} of {total} results
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2"
          onClick={() => table?.previousPage()}
          disabled={loading || !table?.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2"
          onClick={() => table?.nextPage()}
          disabled={loading || !table?.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    </div>
  );
}
