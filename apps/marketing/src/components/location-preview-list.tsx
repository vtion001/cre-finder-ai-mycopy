"use client";

import { formatNumber } from "@v1/utils/format";

interface PropertyCount {
  resultCount: number;
  formattedLocation: string;
  assetTypeName: string;
  internalId: string;
}

interface LocationPreviewListProps {
  locationCounts: PropertyCount[];
}

function LocationPreview({
  resultCount,
  formattedLocation,
}: {
  resultCount: number;
  formattedLocation: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 rounded-md bg-muted/30 border border-border/50">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <div className="w-2 h-2 rounded-full bg-primary/60 flex-shrink-0" />
        <span className="text-xs sm:text-sm font-medium text-foreground truncate">
          {formattedLocation}
        </span>
      </div>
      {resultCount > 0 ? (
        <div className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20 flex-shrink-0">
          {formatNumber(resultCount)} results
        </div>
      ) : (
        <div className="text-xs font-medium text-warning bg-warning/10 px-2 py-1 rounded border border-warning/20 flex-shrink-0">
          No results
        </div>
      )}
    </div>
  );
}

export function LocationPreviewList({
  locationCounts,
}: LocationPreviewListProps) {
  if (locationCounts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">No locations selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-56 sm:max-h-64 overflow-y-auto">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 sm:mb-3 px-1">
        Preview Results
      </div>
      {locationCounts.map(({ resultCount, formattedLocation, internalId }) => (
        <LocationPreview
          key={internalId}
          resultCount={resultCount}
          formattedLocation={formattedLocation}
        />
      ))}
    </div>
  );
}
