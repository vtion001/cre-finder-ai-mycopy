"use client";

import type { Tables } from "@v1/supabase/types";
import { Badge } from "@v1/ui/badge";
import { cn } from "@v1/ui/cn";
import { Popover, PopoverContent, PopoverTrigger } from "@v1/ui/popover";
import { Marker } from "react-map-gl/maplibre";
import { format } from "date-fns";

type PropertyRecord = Tables<"property_records">;

interface PropertyMapMarkerProps {
  id: string;
  latitude: number;
  longitude: number;
  record: PropertyRecord;
  isHovered: boolean;
  isClicked: boolean;
  onHover: (id: string | null) => void;
  onClick: (id: string | null) => void;
}

// Utility functions
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

export function PropertyMapMarker({
  id,
  latitude,
  longitude,
  record,
  isHovered,
  isClicked,
  onHover,
  onClick,
}: PropertyMapMarkerProps) {
  const ownerName = formatOwnerName(
    record.owner1_first_name,
    record.owner1_last_name || "Unknown",
  );
  const propertyValue = formatCurrency(
    record.assessed_value || record.estimated_value,
  );

  return (
    <Marker
      key={`marker-${id}`}
      longitude={longitude}
      latitude={latitude}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
      }}
    >
      <Popover
        open={isHovered || isClicked}
        onOpenChange={(open) => {
          if (!open) {
            onHover(null);
            onClick(null);
          }
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "relative group transition-all duration-200 hover:scale-110 hover:-translate-y-1",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full",
            )}
            onMouseEnter={() => {
              if (!isClicked) {
                onHover(id);
              }
            }}
            onMouseLeave={() => {
              if (!isClicked) {
                onHover(null);
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (isClicked) {
                // If already clicked, close it
                onClick(null);
                onHover(null);
              } else {
                // Open this one and close any others
                onClick(id);
                onHover(null);
              }
            }}
          >
            {/* Marker shadow */}
            <div className="absolute inset-0 bg-black/20 rounded-full blur-sm translate-y-1 group-hover:translate-y-2 transition-transform duration-200" />

            <div
              className={cn(
                "relative size-8 rounded-full shadow-lg border-2 border-white",
                "bg-primary hover:bg-primary/90",
                "group-hover:shadow-xl transition-all duration-200",
              )}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 p-0"
          side="top"
          align="center"
          sideOffset={10}
          onMouseEnter={() => {
            if (!isClicked) {
              onHover(id);
            }
          }}
          onMouseLeave={() => {
            if (!isClicked) {
              onHover(null);
            }
          }}
        >
          <div className="p-4 space-y-3">
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1 min-w-0">
                  <h4 className="font-semibold text-sm leading-tight">
                    {record.address || "Address not available"}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {record.city && record.state
                      ? `${record.city}, ${record.state} ${record.zip || ""}`.trim()
                      : "Location not available"}
                  </p>
                </div>
                {record.property_type && (
                  <Badge
                    variant="secondary"
                    className="ml-2 text-xs shrink-0"
                  >
                    {record.property_type}
                  </Badge>
                )}
              </div>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <p className="text-muted-foreground">Owner</p>
                <p className="font-medium truncate">{ownerName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Property Value</p>
                <p className="font-medium">{propertyValue}</p>
              </div>
              {record.bedrooms && (
                <div className="space-y-1">
                  <p className="text-muted-foreground">Bedrooms</p>
                  <p className="font-medium">{record.bedrooms}</p>
                </div>
              )}
              {record.bathrooms && (
                <div className="space-y-1">
                  <p className="text-muted-foreground">Bathrooms</p>
                  <p className="font-medium">{record.bathrooms}</p>
                </div>
              )}
              {record.square_feet && (
                <div className="space-y-1">
                  <p className="text-muted-foreground">Square Feet</p>
                  <p className="font-medium">
                    {Number(record.square_feet).toLocaleString()}
                  </p>
                </div>
              )}
              {record.year_built && (
                <div className="space-y-1">
                  <p className="text-muted-foreground">Year Built</p>
                  <p className="font-medium">{record.year_built}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {record.last_sale_date && (
              <div className="pt-2 border-t border-border">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">
                    Last Sale
                  </span>
                  <div className="text-right">
                    <p className="font-medium">
                      {record.last_sale_amount
                        ? formatCurrency(record.last_sale_amount)
                        : "N/A"}
                    </p>
                    <p className="text-muted-foreground">
                      {format(
                        new Date(record.last_sale_date),
                        "MMM yyyy",
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </Marker>
  );
}
