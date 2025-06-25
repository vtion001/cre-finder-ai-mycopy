"use client";
import { ScrollArea, ScrollBar } from "@v1/ui/scroll-area";
import { Skeleton } from "@v1/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@v1/ui/table";
import { DataTableHeader } from "./data-table-header";
import { DataTablePagination } from "./data-table-pagination";

const data = [...Array(20)].map((_, i) => ({ id: i.toString() }));

export function Loading() {
  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 min-h-0">
        <Table>
          <DataTableHeader loading />

          <TableBody>
            {data?.map((row) => (
              <TableRow key={row.id} className="h-[45px]">
                {/* Checkbox column */}
                <TableCell className="min-w-[50px] hidden md:table-cell px-3 md:px-4 py-2">
                  <Skeleton className="h-4 w-4" />
                </TableCell>

                {/* Property ID */}
                <TableCell className="min-w-[140px] px-3 md:px-4 py-2">
                  <Skeleton className="h-3.5 w-[120px]" />
                </TableCell>

                {/* Address */}
                <TableCell className="w-[200px] md:w-[350px] px-3 md:px-4 py-2">
                  <Skeleton className="h-3.5 w-[80%]" />
                </TableCell>

                {/* Owner */}
                <TableCell className="min-w-[150px] px-3 md:px-4 py-2">
                  <Skeleton className="h-3.5 w-[120px]" />
                </TableCell>

                {/* Property Type */}
                <TableCell className="min-w-[120px] px-3 md:px-4 py-2">
                  <Skeleton className="h-3.5 w-[90px]" />
                </TableCell>

                {/* Square Feet */}
                <TableCell className="min-w-[100px] px-3 md:px-4 py-2">
                  <Skeleton className="h-3.5 w-[70px]" />
                </TableCell>

                {/* Assessed Value */}
                <TableCell className="min-w-[140px] px-3 md:px-4 py-2">
                  <Skeleton className="h-3.5 w-[110px]" />
                </TableCell>

                {/* Estimated Value */}
                <TableCell className="min-w-[140px] px-3 md:px-4 py-2">
                  <Skeleton className="h-3.5 w-[110px]" />
                </TableCell>

                {/* Bedrooms - Responsive */}
                <TableCell className="min-w-[80px] hidden md:table-cell px-3 md:px-4 py-2">
                  <Skeleton className="h-3.5 w-[40px]" />
                </TableCell>

                {/* Bathrooms - Responsive */}
                <TableCell className="min-w-[80px] hidden md:table-cell px-3 md:px-4 py-2">
                  <Skeleton className="h-3.5 w-[40px]" />
                </TableCell>

                {/* Last Sale Amount - Responsive */}
                <TableCell className="min-w-[120px] hidden md:table-cell px-3 md:px-4 py-2">
                  <Skeleton className="h-3.5 w-[90px]" />
                </TableCell>

                {/* Last Sale Date - Responsive */}
                <TableCell className="min-w-[120px] hidden md:table-cell px-3 md:px-4 py-2">
                  <Skeleton className="h-3.5 w-[90px]" />
                </TableCell>

                {/* Year Built - Responsive */}
                <TableCell className="min-w-[100px] hidden md:table-cell px-3 md:px-4 py-2">
                  <Skeleton className="h-3.5 w-[70px]" />
                </TableCell>

                {/* Vacant - Responsive */}
                <TableCell className="min-w-[80px] hidden md:table-cell px-3 md:px-4 py-2">
                  <Skeleton className="h-3.5 w-[50px]" />
                </TableCell>

                {/* High Equity - Responsive */}
                <TableCell className="min-w-[100px] hidden md:table-cell px-3 md:px-4 py-2">
                  <Skeleton className="h-3.5 w-[70px]" />
                </TableCell>

                {/* MLS Status - Responsive */}
                <TableCell className="min-w-[120px] hidden md:table-cell px-3 md:px-4 py-2">
                  <Skeleton className="h-3.5 w-[90px]" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex-shrink-0">
        <DataTablePagination total={0} loading={true} />
      </div>
    </div>
  );
}
