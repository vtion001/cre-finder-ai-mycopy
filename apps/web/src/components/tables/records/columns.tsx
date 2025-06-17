"use client";

import {
  formatCurrency,
  formatDate,
  formatTableNumber,
  getOwnerInitials,
  getOwnerName,
} from "@/lib/format";
import type { ColumnDef } from "@tanstack/react-table";
import type { Tables } from "@v1/supabase/types";

import { Avatar, AvatarFallback } from "@v1/ui/avatar";
import { Badge } from "@v1/ui/badge";
import { Checkbox } from "@v1/ui/checkbox";
import { Building2, Calendar } from "lucide-react";
import { SkipTraceContactInfo } from "./skip-trace-info";

export type PropertyRecord = Tables<"property_records">;

export const columns: ColumnDef<PropertyRecord>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`Select property ${row.original.property_id}`}
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      return (
        <div className="min-w-0">
          <div className="font-medium truncate">{row.original.address}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.city}, {row.original.state} {row.original.zip}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "owner1_last_name",
    header: "Owner",
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
              {getOwnerInitials(row.original)}
            </AvatarFallback>
          </Avatar>
          <span className="truncate">{getOwnerName(row.original)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "skip_trace_data",
    header: "Contact Info",
    cell: ({ row }) => {
      return (
        <SkipTraceContactInfo
          skipTraceData={
            row.original.skip_trace_data
              ? JSON.parse(JSON.stringify(row.original.skip_trace_data))
              : null
          }
          ownerName={getOwnerName(row.original)}
        />
      );
    },
  },
  {
    accessorKey: "property_type",
    header: "Type",
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="truncate">{row.original.property_type || "-"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "square_feet",
    header: "Sq Ft",
    cell: ({ row }) => {
      return row.original.square_feet ? (
        <span className="text-sm whitespace-nowrap">
          {formatTableNumber(row.original.square_feet)} sq ft
        </span>
      ) : (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          -
        </span>
      );
    },
  },
  {
    accessorKey: "assessed_value",
    header: "Assessed Value",
    cell: ({ row }) => {
      return (
        <span className="font-medium">
          {formatCurrency(row.original.assessed_value)}
        </span>
      );
    },
  },
  {
    accessorKey: "estimated_value",
    header: "Est. Value",
    cell: ({ row }) => {
      return (
        <span className="font-medium">
          {formatCurrency(row.original.estimated_value)}
        </span>
      );
    },
  },
  {
    accessorKey: "bedrooms",
    header: "Bedrooms",
    cell: ({ row }) => {
      return <span className="text-sm">{row.original.bedrooms || "-"}</span>;
    },
  },
  {
    accessorKey: "bathrooms",
    header: "Bathrooms",
    cell: ({ row }) => {
      return <span className="text-sm">{row.original.bathrooms || "-"}</span>;
    },
  },
  {
    accessorKey: "last_sale_amount",
    header: "Last Sale Amount",
    cell: ({ row }) => {
      return (
        <span className="text-sm">
          {formatCurrency(row.original.last_sale_amount)}
        </span>
      );
    },
  },
  {
    accessorKey: "last_sale_date",
    header: "Last Sale Date",
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-1">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">
            {formatDate(row.original.last_sale_date)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "year_built",
    header: "Year Built",
    cell: ({ row }) => {
      return <span className="text-sm">{row.original.year_built || "-"}</span>;
    },
  },
  {
    accessorKey: "vacant",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge
          variant={row.original.vacant ? "destructive" : "secondary"}
          className="text-xs"
        >
          <div className="flex items-center space-x-1">
            <div
              className={`h-2 w-2 rounded-full ${
                row.original.vacant ? "bg-red-500" : "bg-green-500"
              }`}
            />
            <span>{row.original.vacant ? "Vacant" : "Occupied"}</span>
          </div>
        </Badge>
      );
    },
  },
  {
    accessorKey: "high_equity",
    header: "Equity",
    cell: ({ row }) => {
      return (
        <Badge
          variant={row.original.high_equity ? "default" : "secondary"}
          className="text-xs"
        >
          <div className="flex items-center space-x-1">
            <div
              className={`h-2 w-2 rounded-full ${
                row.original.high_equity ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <span>{row.original.high_equity ? "High" : "Standard"}</span>
          </div>
        </Badge>
      );
    },
  },
  {
    accessorKey: "mls_status",
    header: "MLS Status",
    cell: ({ row }) => {
      return row.original.mls_status ? (
        <Badge variant="outline" className="text-xs">
          {row.original.mls_status}
        </Badge>
      ) : (
        <span className="text-sm text-muted-foreground">-</span>
      );
    },
  },
];
