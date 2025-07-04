"use client";

import type { Tables } from "@v1/supabase/types";
import { Badge } from "@v1/ui/badge";
import { Skeleton } from "@v1/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@v1/ui/table";
import { formatNumber } from "@v1/utils/format";
import { format } from "date-fns";
import { BuildingIcon, MapPinIcon } from "lucide-react";

type PropertyRecord = Tables<"property_records">;

interface PropertyRecordsTableProps {
  records: PropertyRecord[];
  isLoading?: boolean;
}

function formatCurrency(value: string | number | null | undefined): string {
  if (!value) return "N/A";

  const numValue =
    typeof value === "string"
      ? Number.parseFloat(value.replace(/[^0-9.-]/g, ""))
      : value;

  if (Number.isNaN(numValue)) return "N/A";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
}

function formatOwnerName(firstName: string | null, lastName: string): string {
  if (firstName) {
    return `${firstName} ${lastName}`;
  }
  return lastName;
}

export function PropertyRecordsTable({
  records,
  isLoading = false,
}: PropertyRecordsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
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

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <BuildingIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-medium">No property records</h3>
        <p className="text-muted-foreground mt-1">
          Your exported property records will appear here.
        </p>
      </div>
    );
  }

  return (
    <Table divClassname="max-h-screen">
      <TableHeader className="sticky top-0">
        <TableRow className="bg-secondary text-secondary-foreground border-b">
          <TableHead className="min-w-[200px]">Address</TableHead>
          <TableHead className="min-w-[150px]">Owner</TableHead>
          <TableHead className="min-w-[120px]">Property Type</TableHead>
          <TableHead className="text-right min-w-[120px]">Last Sale</TableHead>
          <TableHead className="text-right min-w-[120px]">
            Estimated Value
          </TableHead>
          <TableHead className="text-center min-w-[120px]">
            Date Added
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => (
          <TableRow key={record.id}>
            <TableCell>
              <div className="flex items-start gap-2">
                <MapPinIcon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="font-medium">{record.address}</span>
                  <span className="text-xs text-muted-foreground">
                    {record.city && record.state
                      ? `${record.city}, ${record.state} ${record.zip}`
                      : `${record.state} ${record.zip}`}
                  </span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">
                  {formatOwnerName(
                    record.owner1_first_name,
                    record.owner1_last_name,
                  )}
                </span>
                {record.corporate_owned && (
                  <Badge variant="outline" className="w-fit mt-1 text-xs">
                    Corporate
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm">
                {record.property_type || record.property_use || "N/A"}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex flex-col items-end">
                <span className="font-medium">
                  {formatCurrency(record.last_sale_amount)}
                </span>
                {record.last_sale_date && (
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(record.last_sale_date), "MMM yyyy")}
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <span className="font-medium">
                {formatCurrency(record.estimated_value)}
              </span>
            </TableCell>
            <TableCell className="text-center">
              <div className="text-sm">
                {format(new Date(record.created_at!), "MMM d, yyyy")}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
