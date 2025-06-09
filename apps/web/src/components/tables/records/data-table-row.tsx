"use client";

import {
  formatCurrency,
  formatDate,
  formatTableNumber,
  getOwnerInitials,
  getOwnerName,
} from "@/lib/format";
import type { Tables } from "@v1/supabase/types";
import { Avatar, AvatarFallback } from "@v1/ui/avatar";
import { Badge } from "@v1/ui/badge";
import { Checkbox } from "@v1/ui/checkbox";
import { cn } from "@v1/ui/cn";
import { TableCell, TableRow } from "@v1/ui/table";
import { Building2, Calendar } from "lucide-react";

type DataTableCellProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export function DataTableCell({
  children,
  className,
  onClick,
}: DataTableCellProps) {
  return (
    <TableCell className={className} onClick={onClick}>
      {children}
    </TableCell>
  );
}

type RowProps = {
  children: React.ReactNode;
};

export function Row({ children }: RowProps) {
  return <TableRow className="h-[45px]">{children}</TableRow>;
}

type DataTableRowProps = {
  row: Tables<"property_records">;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
};

export function DataTableRow({ row, isSelected, onSelect }: DataTableRowProps) {
  return (
    <Row>
      {/* Checkbox */}
      <DataTableCell className="hidden md:table-cell px-3 md:px-4 py-2">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          aria-label={`Select property ${row.property_id}`}
        />
      </DataTableCell>

      {/* Property ID */}
      {/* <DataTableCell className="px-3 md:px-4 py-2">
        <span className="font-mono text-sm">{row.property_id}</span>
      </DataTableCell> */}

      {/* Address */}
      <DataTableCell className="px-3 md:px-4 py-2">
        <div className="min-w-0">
          <div className="font-medium truncate">{row.address}</div>
          <div className="text-sm text-muted-foreground">
            {row.city}, {row.state} {row.zip}
          </div>
        </div>
      </DataTableCell>

      {/* Owner */}
      <DataTableCell className="px-3 md:px-4 py-2">
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
              {getOwnerInitials(row)}
            </AvatarFallback>
          </Avatar>
          <span className="truncate">{getOwnerName(row)}</span>
        </div>
      </DataTableCell>

      {/* Property Type */}
      <DataTableCell className="px-3 md:px-4 py-2">
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="truncate">{row.property_type || "-"}</span>
        </div>
      </DataTableCell>

      {/* Square Feet */}
      <DataTableCell className="px-3 md:px-4 py-2">
        {row.square_feet ? (
          <span className="text-sm whitespace-nowrap">
            {formatTableNumber(row.square_feet)} sq ft
          </span>
        ) : (
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            -
          </span>
        )}
      </DataTableCell>

      {/* Assessed Value */}
      <DataTableCell className="px-3 md:px-4 py-2">
        <span className="font-medium">
          {formatCurrency(row.assessed_value)}
        </span>
      </DataTableCell>

      {/* Estimated Value */}
      <DataTableCell className="px-3 md:px-4 py-2">
        <span className="font-medium">
          {formatCurrency(row.estimated_value)}
        </span>
      </DataTableCell>

      {/* Bedrooms - Responsive */}
      <DataTableCell className="hidden md:table-cell px-3 md:px-4 py-2">
        <span className="text-sm">{row.bedrooms || "-"}</span>
      </DataTableCell>

      {/* Bathrooms - Responsive */}
      <DataTableCell className="hidden md:table-cell px-3 md:px-4 py-2">
        <span className="text-sm">{row.bathrooms || "-"}</span>
      </DataTableCell>

      {/* Last Sale Amount - Responsive */}
      <DataTableCell className="hidden md:table-cell px-3 md:px-4 py-2">
        <span className="text-sm">{formatCurrency(row.last_sale_amount)}</span>
      </DataTableCell>

      {/* Last Sale Date - Responsive */}
      <DataTableCell className="hidden md:table-cell px-3 md:px-4 py-2">
        <div className="flex items-center space-x-1">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{formatDate(row.last_sale_date)}</span>
        </div>
      </DataTableCell>

      {/* Year Built - Responsive */}
      <DataTableCell className="hidden md:table-cell px-3 md:px-4 py-2">
        <span className="text-sm">{row.year_built || "-"}</span>
      </DataTableCell>

      {/* Vacant - Responsive */}
      <DataTableCell className="hidden md:table-cell px-3 md:px-4 py-2">
        <Badge
          variant={row.vacant ? "destructive" : "secondary"}
          className="text-xs"
        >
          <div className="flex items-center space-x-1">
            <div
              className={`h-2 w-2 rounded-full ${
                row.vacant ? "bg-red-500" : "bg-green-500"
              }`}
            />
            <span>{row.vacant ? "Vacant" : "Occupied"}</span>
          </div>
        </Badge>
      </DataTableCell>

      {/* High Equity - Responsive */}
      <DataTableCell className="hidden md:table-cell px-3 md:px-4 py-2">
        <Badge
          variant={row.high_equity ? "default" : "secondary"}
          className="text-xs"
        >
          <div className="flex items-center space-x-1">
            <div
              className={`h-2 w-2 rounded-full ${
                row.high_equity ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <span>{row.high_equity ? "High" : "Standard"}</span>
          </div>
        </Badge>
      </DataTableCell>

      {/* MLS Status - Responsive */}
      <DataTableCell className="hidden md:table-cell px-3 md:px-4 py-2">
        {row.mls_status ? (
          <Badge variant="outline" className="text-xs">
            {row.mls_status}
          </Badge>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )}
      </DataTableCell>
    </Row>
  );
}
