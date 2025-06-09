"use client";

import { Button } from "@v1/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@v1/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@v1/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useCallback } from "react";

type DataTablePaginationProps = {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  loading?: boolean;
  showPageNumbers?: boolean;
};

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function DataTablePagination({
  totalCount,
  currentPage,
  pageSize,
  loading = false,
  showPageNumbers = false,
}: DataTablePaginationProps) {
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withOptions({ shallow: false }),
  );
  const [perPage, setPerPage] = useQueryState(
    "per_page",
    parseAsInteger.withOptions({ shallow: false }),
  );

  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (!loading && newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
      }
    },
    [setPage, totalPages, loading],
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: string) => {
      if (!loading) {
        setPerPage(Number(newPageSize));
        setPage(1); // Reset to first page when changing page size
      }
    },
    [setPerPage, setPage, loading],
  );

  // Generate page numbers to show
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page

    // When loading, always show a consistent layout: 1, 2, 3, ..., 5
    if (loading) {
      return [1, 2, 3, "...", 5];
    }

    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-background w-full">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">Rows per page</p>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
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
        <div className="text-sm text-muted-foreground">
          Showing {startItem} - {endItem} of {totalCount} results
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={loading || currentPage <= 1}
          className="h-8 px-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>

        {showPageNumbers ? (
          <Pagination className="mx-0 w-auto">
            <PaginationContent className="gap-1">
              {getVisiblePages().map((pageNum, index) => (
                <PaginationItem key={index}>
                  {pageNum === "..." ? (
                    <span className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground">
                      ...
                    </span>
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(pageNum as number)}
                      isActive={pageNum === currentPage}
                      className={`h-8 w-8 ${loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                      style={{ pointerEvents: loading ? "none" : "auto" }}
                    >
                      {pageNum}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
            </PaginationContent>
          </Pagination>
        ) : null}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={loading || currentPage >= totalPages}
          className="h-8 px-2"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    </div>
  );
}
