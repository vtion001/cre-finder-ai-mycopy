"use client";

import type { Table } from "@tanstack/react-table";
import { Button } from "@v1/ui/button";
import { Checkbox } from "@v1/ui/checkbox";
import { cn } from "@v1/ui/cn";
import { TableHead, TableHeader, TableRow } from "@v1/ui/table";
import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useCallback } from "react";

type Props<TData> = {
  table?: Table<TData>;
  loading?: boolean;
};

type ColumnConfig = {
  id: string;
  label: string;
  sortKey?: string;
  className?: string;
  responsive?: boolean;
};

const COLUMNS: ColumnConfig[] = [
  {
    id: "address",
    label: "Address",
    sortKey: "address",
    className: "min-w-[350px]",
  },
  {
    id: "owner1_last_name",
    label: "Owner",
    sortKey: "owner1_last_name",
    className: "min-w-[260px] ",
  },
  {
    id: "skip_trace_data",
    label: "Contact Info",
    sortKey: "skip_trace_data",
    className: "min-w-[260px] ",
  },
  {
    id: "property_type",
    label: "Type",
    sortKey: "property_type",
    className: "min-w-[120px]",
  },
  {
    id: "square_feet",
    label: "Sq Ft",
    sortKey: "square_feet",
    className: "min-w-[100px]",
  },
  {
    id: "assessed_value",
    label: "Assessed Value",
    sortKey: "assessed_value",
    className: "min-w-[140px]",
  },
  {
    id: "estimated_value",
    label: "Est. Value",
    sortKey: "estimated_value",
    className: "min-w-[140px]",
  },
  {
    id: "bedrooms",
    label: "Beds",
    sortKey: "bedrooms",
    className: "min-w-[80px]",
    responsive: true,
  },
  {
    id: "bathrooms",
    label: "Baths",
    sortKey: "bathrooms",
    className: "min-w-[80px]",
    responsive: true,
  },
  {
    id: "last_sale_amount",
    label: "Last Sale",
    sortKey: "last_sale_amount",
    className: "min-w-[120px]",
    responsive: true,
  },
  {
    id: "last_sale_date",
    label: "Sale Date",
    sortKey: "last_sale_date",
    className: "min-w-[120px]",
    responsive: true,
  },
  {
    id: "year_built",
    label: "Year Built",
    sortKey: "year_built",
    className: "min-w-[100px]",
    responsive: true,
  },
  {
    id: "vacant",
    label: "Vacant",
    sortKey: "vacant",
    className: "min-w-[80px]",
    responsive: true,
  },
  {
    id: "high_equity",
    label: "High Equity",
    sortKey: "high_equity",
    className: "min-w-[100px]",
    responsive: true,
  },
  {
    id: "mls_status",
    label: "MLS Status",
    sortKey: "mls_status",
    className: "min-w-[120px]",
    responsive: true,
  },
];

export function DataTableHeader<TData>({ table, loading }: Props<TData>) {
  const pathname = usePathname();
  const router = useRouter();
  const [sort, setSort] = useQueryState("sort", { shallow: false });
  const [column, value] = sort ? sort.split(":") : [];

  const createSortQuery = useCallback(
    (name: string) => {
      const prevSort = sort;

      if (`${name}:asc` === prevSort) {
        setSort(`${name}:desc`);
      } else if (`${name}:desc` === prevSort) {
        setSort(null);
      } else {
        setSort(`${name}:asc`);
      }
    },
    [router, pathname],
  );

  const isVisible = (id: string) =>
    loading ||
    table
      ?.getAllLeafColumns()
      .find((col) => col.id === id)
      ?.getIsVisible();

  const renderSortButton = (config: ColumnConfig) => (
    <Button
      className="pl-1.5 group space-x-2 w-full justify-between"
      variant="ghost"
      onClick={() => createSortQuery(config.sortKey!)}
    >
      <span>{config.label}</span>

      {config.sortKey !== column && (
        <ArrowDown
          className="transition-opacity opacity-0 group-hover:opacity-60"
          size={16}
        />
      )}
      {config.sortKey === column && value === "asc" && <ArrowDown size={16} />}
      {config.sortKey === column && value === "desc" && <ArrowUp size={16} />}
    </Button>
  );

  return (
    <TableHeader className="sticky top-0 h-[45px] bg-background z-10 !opacity-100 hover:bg-background">
      <TableRow className="">
        <TableHead className="min-w-[50px] table-cell px-3 md:px-4 py-2">
          <Checkbox
            checked={
              table?.getIsAllPageRowsSelected() ||
              (table?.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table?.toggleAllPageRowsSelected(!!value)
            }
          />
        </TableHead>

        {COLUMNS.map(
          (config) =>
            isVisible(config.id) && (
              <TableHead
                key={config.id}
                className={cn(
                  "px-3 md:px-4 py-2",
                  config.className,
                  config.responsive ? "hidden md:table-cell" : "",
                )}
              >
                {config.sortKey ? (
                  renderSortButton(config)
                ) : (
                  <span>{config.label}</span>
                )}
              </TableHead>
            ),
        )}
      </TableRow>
    </TableHeader>
  );
}
