"use client";

import { PropertyRecordsTable } from "@/components/tables/property-records-table";
import { formatNumber } from "@/lib/format";
import type { GetPropertySearchParams } from "@/lib/realestateapi";
import type { Tables } from "@v1/supabase/types";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import { Card, CardHeader, CardTitle } from "@v1/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@v1/ui/dialog";
import { format } from "date-fns";
import { BuildingIcon, EyeIcon, SearchIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { DownloadButton } from "./download-button";

type SearchLogWithRecords = Tables<"search_logs"> & {
  asset_types: Pick<Tables<"asset_types">, "name">;
  user_locations: Pick<Tables<"user_locations">, "display_name">;
  property_records: Tables<"property_records">[];
};

interface PropertyRecordsProps {
  data: SearchLogWithRecords[];
  isLoading?: boolean;
}

export function PropertyRecords({ data }: PropertyRecordsProps) {
  const [selectedId, setSelectedId] = useQueryState("id");
  const [searchQuery, setSearchQuery] = useQueryState("q");

  const filtered = data.filter((log) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      log.user_locations.display_name.toLowerCase().includes(query) ||
      log.asset_types.name.toLowerCase().includes(query) ||
      log.property_records.some(
        (record) =>
          record.address.toLowerCase().includes(query) ||
          record.city?.toLowerCase().includes(query) ||
          record.state.toLowerCase().includes(query) ||
          record.owner1_last_name.toLowerCase().includes(query) ||
          record.owner2_last_name?.toLowerCase().includes(query),
      )
    );
  });

  const selected = selectedId
    ? data.find((log) => log.id === selectedId)
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
    <div className="space-y-4">
      {filtered.length === 0 && searchQuery ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <SearchIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium">No matching records found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search terms or clear the search to see all
            records.
          </p>
        </div>
      ) : (
        filtered.map((searchLog) => {
          const recordCount = searchLog.property_records?.length || 0;
          const params = searchLog.search_parameters as GetPropertySearchParams;

          return (
            <Card key={searchLog.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-start">
                    <CardTitle className="text-base font-medium">
                      {searchLog.user_locations.display_name} •{" "}
                      {searchLog.asset_types.name}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>
                        {format(
                          new Date(searchLog.created_at!),
                          "MMM d, yyyy 'at' h:mm a",
                        )}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {formatNumber(recordCount)} exported
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {formatNumber(searchLog.result_count)} total found
                      </Badge>
                      {params.building_size_min && (
                        <Badge variant="outline" className="text-xs">
                          {formatNumber(params.building_size_min)}+ sq ft
                        </Badge>
                      )}
                      {params.year_min && (
                        <Badge variant="outline" className="text-xs">
                          Built {params.year_min}+
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DownloadButton data={searchLog.property_records} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedId(searchLog.id)}
                      className="flex items-center gap-2"
                    >
                      <EyeIcon className="h-4 w-4" />
                      Details
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })
      )}

      <Dialog open={!!selectedId} onOpenChange={() => setSelectedId(null)}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selected && (
                <>
                  Property Records - {selected.user_locations.display_name} •{" "}
                  {selected.asset_types.name}
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    {format(
                      new Date(selected.created_at!),
                      "MMM d, yyyy 'at' h:mm a",
                    )}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {formatNumber(selected.property_records?.length || 0)}{" "}
                    records
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {formatNumber(selected.result_count)} total results
                  </Badge>
                </div>

                <DownloadButton data={selected.property_records} />
              </div>

              {selected.property_records &&
              selected.property_records.length > 0 ? (
                <PropertyRecordsTable records={selected.property_records} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BuildingIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No property records found for this search</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
