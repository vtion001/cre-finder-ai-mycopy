"use client";

import { PropertyRecordsTable } from "@/components/tables/property-records-table";
import { formatNumber } from "@/lib/format";

import type { Tables } from "@v1/supabase/types";
import { Button } from "@v1/ui/button";
import { Card } from "@v1/ui/card";
import { Label } from "@v1/ui/label";
import { ScrollArea, ScrollBar } from "@v1/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@v1/ui/select";
import { Switch } from "@v1/ui/switch";
import { format } from "date-fns";
import { BuildingIcon, SearchIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { DownloadButton } from "./download-button";
import { PropertyMap } from "./property-map";

type SearchLogWithRecords = Tables<"search_logs"> & {
  asset_types: Pick<Tables<"asset_types">, "name">;
  property_records: Tables<"property_records">[];
};

interface PropertyRecordsProps {
  data: SearchLogWithRecords[];
  isLoading?: boolean;
}

export function PropertyRecords({ data }: PropertyRecordsProps) {
  const [selectedId, setSelectedId] = useQueryState("id");
  const [showMap, setShowMap] = useState(true);

  // Auto-select first search log if none selected and data exists
  const effectiveSelectedId =
    selectedId || (data.length > 0 ? data[0]?.id : null);

  const selected = effectiveSelectedId
    ? data.find((log) => log.id === effectiveSelectedId)
    : null;

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <BuildingIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-medium">No exported property records</h3>
        <p className="text-muted-foreground mt-1 mb-4">
          Your exported property records will appear here once you export search
          results.
        </p>
        <Button asChild>
          <a href="/dashboard/search">
            <BuildingIcon className="h-4 w-4 mr-2" />
            Search Properties
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search Log Selector */}
        <div className="flex-1 max-w-lg">
          <Select
            value={effectiveSelectedId || ""}
            onValueChange={(value) => setSelectedId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a completed search..." />
            </SelectTrigger>
            <SelectContent>
              {data.map((searchLog) => (
                <SelectItem key={searchLog.id} value={searchLog.id}>
                  <div className="flex items-center gap-2 w-full min-w-0">
                    <span className="font-medium truncate">
                  
                      {searchLog.asset_types.name}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(searchLog.created_at!), "MMM d, yyyy")} •{" "}
                      {formatNumber(searchLog.property_records?.length || 0)}{" "}
                      records
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {selected && <DownloadButton data={selected.property_records} />}

          {/* Map Toggle */}
          <div className="flex items-center gap-2">
            <Label htmlFor="show-map" className="text-sm font-medium">
              Show Map
            </Label>
            <Switch
              id="show-map"
              checked={showMap}
              onCheckedChange={setShowMap}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {selected ? (
        <div
          className={`grid gap-6 ${showMap ? "lg:grid-cols-[1fr,480px]" : "grid-cols-1"}`}
        >
          {/* Table Section */}
          <div className="min-w-0">
            {selected.property_records &&
            selected.property_records.length > 0 ? (
              <ScrollArea
                hideScrollbar
                className="h-[calc(100vh-7rem)] w-full rounded-md border overflow-y-hidden"
              >
                <PropertyRecordsTable records={selected.property_records} />

                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ) : (
              <Card className="p-8">
                <div className="text-center text-muted-foreground">
                  <BuildingIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <h3 className="text-lg font-medium mb-2">
                    No property records
                  </h3>
                  <p>No exported property records found for this search.</p>
                </div>
              </Card>
            )}
          </div>

          {/* Map Section */}
          {showMap &&
            selected.property_records &&
            selected.property_records.length > 0 && (
              <div className="lg:sticky lg:top-6 lg:h-fit">
                <PropertyMap
                  records={selected.property_records}
                  className="h-[calc(100vh-7rem)]"
                />
              </div>
            )}
        </div>
      ) : (
        <Card className="p-8">
          <div className="text-center text-muted-foreground">
            <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-medium mb-2">
              Select a search to view records
            </h3>
            <p>
              Choose a completed search from the dropdown above to view property
              records.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
