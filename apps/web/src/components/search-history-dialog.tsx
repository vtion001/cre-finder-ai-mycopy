"use client";

import { formatNumber, formatSearchParams } from "@/lib/format";
import type { GetPropertySearchParams } from "@/lib/realestateapi";
import type { Tables } from "@v1/supabase/types";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@v1/ui/dialog";
import { ScrollArea } from "@v1/ui/scroll-area";
import { format } from "date-fns";
import {
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  HistoryIcon,
  PlayIcon,
  SearchIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SearchLog = Tables<"search_logs"> & {
  search_parameters: GetPropertySearchParams;
  asset_types: Pick<Tables<"asset_types">, "name">;
  user_locations: Pick<Tables<"user_locations">, "display_name">;
};

interface SearchHistoryDialogProps {
  searchLogs: SearchLog[];
  isLoading?: boolean;
}

export function SearchHistoryDialog({
  searchLogs,
  isLoading = false,
}: SearchHistoryDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleActionClick = (searchLog: SearchLog) => {
    setOpen(false);
    if (searchLog.status === "preview") {
      router.push(`/dashboard/search?id=${searchLog.id}`);
    } else {
      router.push(`/dashboard/records?id=${searchLog.id}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="flex items-center gap-2">
          <HistoryIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Search History</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Recent Search Activity</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-3">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border rounded-lg animate-pulse"
                >
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-48" />
                    <div className="h-3 bg-muted rounded w-32" />
                  </div>
                  <div className="h-8 bg-muted rounded w-20" />
                </div>
              ))}
          </div>
        ) : searchLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <SearchIcon className="h-8 w-8 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">
              Your recent searches will appear here
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-3 pr-4">
              {searchLogs.map((searchLog) => {
                const params = searchLog.search_parameters;
                const formattedParams = formatSearchParams(params);

                return (
                  <div
                    key={searchLog.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {searchLog.user_locations.display_name} •{" "}
                          {searchLog.asset_types.name}
                        </span>
                        {searchLog.status === "completed" ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 flex items-center gap-1"
                          >
                            <CheckCircleIcon className="h-3 w-3" />
                            Exported
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200 flex items-center gap-1"
                          >
                            <ClockIcon className="h-3 w-3" />
                            Preview
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>
                          {format(
                            new Date(searchLog.created_at!),
                            "MMM d, yyyy 'at' h:mm a",
                          )}
                        </span>
                        <span>•</span>
                        <span>
                          {formatNumber(searchLog.result_count)} results
                        </span>
                        {formattedParams && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-xs">
                              {formattedParams}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {searchLog.status === "preview" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleActionClick(searchLog)}
                          className="flex items-center gap-1"
                        >
                          <PlayIcon className="h-3 w-3" />
                          Re-run
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleActionClick(searchLog)}
                          className="flex items-center gap-1"
                        >
                          <EyeIcon className="h-3 w-3" />
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
