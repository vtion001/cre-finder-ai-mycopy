"use client";

import { formatNumber } from "@/lib/format";
import type { Tables } from "@v1/supabase/types";
import { Card, CardContent } from "@v1/ui/card";
import { BuildingIcon, SearchIcon } from "lucide-react";

type SearchLogWithRecords = Tables<"search_logs"> & {
  asset_types: Pick<Tables<"asset_types">, "name">;
  user_locations: Pick<Tables<"user_locations">, "display_name">;
  property_records: Tables<"property_records">[];
};

export function RecordsSummary({
  data: searchLogsWithRecords,
}: { data: SearchLogWithRecords[] }) {
  const totalSearches = searchLogsWithRecords.length;
  const totalRecords = searchLogsWithRecords.reduce(
    (sum, log) => sum + (log.property_records?.length || 0),
    0,
  );
  const totalResults = searchLogsWithRecords.reduce(
    (sum, log) => sum + log.result_count,
    0,
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BuildingIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Records</p>
              <p className="text-xl sm:text-2xl font-semibold">
                {formatNumber(totalRecords)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <SearchIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Completed Searches
              </p>
              <p className="text-xl sm:text-2xl font-semibold">
                {formatNumber(totalSearches)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="sm:col-span-2 lg:col-span-1">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <BuildingIcon className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total Results Found
              </p>
              <p className="text-xl sm:text-2xl font-semibold">
                {formatNumber(totalResults)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
