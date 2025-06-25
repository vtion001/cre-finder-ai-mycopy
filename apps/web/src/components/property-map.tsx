"use client";

import type { Tables } from "@v1/supabase/types";
import { Badge } from "@v1/ui/badge";
import { cn } from "@v1/ui/cn";

import { Popover, PopoverContent, PopoverTrigger } from "@v1/ui/popover";
import { useTheme } from "next-themes";
import { use, useMemo, useRef, useState } from "react";
import ReactMap, {
  FullscreenControl,
  type MapRef,
  Marker,
  NavigationControl,
  ScaleControl,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { format } from "date-fns";

type PropertyRecord = Tables<"property_records">;

interface PropertyMapProps {
  dataPromise: Promise<{ data: PropertyRecord[] }>;
  className?: string;
}

interface MapPin {
  id: string;
  latitude: number;
  longitude: number;
  record: PropertyRecord;
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

export function PropertyMap({ dataPromise, className }: PropertyMapProps) {
  const { data: records } = use(dataPromise);

  const { theme } = useTheme();
  const mapRef = useRef<MapRef>(null);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);

  // Filter records with valid coordinates and create map pins
  const mapPins = useMemo<MapPin[]>(() => {
    return records
      .filter(
        (record) =>
          record.latitude &&
          record.longitude &&
          !Number.isNaN(Number(record.latitude)) &&
          !Number.isNaN(Number(record.longitude)),
      )
      .map((record) => ({
        id: record.id,
        latitude: Number(record.latitude),
        longitude: Number(record.longitude),
        record,
      }));
  }, [records]);

  // Calculate bounds to fit all pins
  const bounds = useMemo(() => {
    if (mapPins.length === 0) return null;

    const lats = mapPins.map((pin) => pin.latitude);
    const lngs = mapPins.map((pin) => pin.longitude);

    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
    };
  }, [mapPins]);

  // Calculate initial viewport
  const initialViewState = useMemo(() => {
    if (!bounds || mapPins.length === 0) {
      return {
        longitude: -98.5795,
        latitude: 39.8283,
        zoom: 4,
      };
    }

    if (mapPins.length === 1) {
      return {
        longitude: mapPins[0]!.longitude,
        latitude: mapPins[0]!.latitude,
        zoom: 12,
      };
    }

    const centerLat = (bounds.minLat + bounds.maxLat) / 2;
    const centerLng = (bounds.minLng + bounds.maxLng) / 2;

    // Calculate zoom level based on bounds
    const latDiff = bounds.maxLat - bounds.minLat;
    const lngDiff = bounds.maxLng - bounds.minLng;
    const maxDiff = Math.max(latDiff, lngDiff);

    let zoom = 10;
    if (maxDiff > 10) zoom = 4;
    else if (maxDiff > 5) zoom = 6;
    else if (maxDiff > 1) zoom = 8;
    else if (maxDiff > 0.1) zoom = 10;
    else zoom = 12;

    return {
      longitude: centerLng,
      latitude: centerLat,
      zoom,
    };
  }, [bounds, mapPins]);

  // Map style based on theme
  const mapStyle =
    theme === "dark"
      ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

  return (
    <div
      className={cn(
        "relative h-[600px] w-full rounded-lg overflow-hidden border",
        className,
      )}
    >
      <ReactMap
        ref={mapRef}
        initialViewState={initialViewState}
        style={{ width: "100%", height: "100%" }}
        mapStyle={mapStyle}
        attributionControl={false}
        reuseMaps
      >
        <FullscreenControl position="top-right" />
        <NavigationControl position="top-right" />
        <ScaleControl />

        {mapPins.map((pin) => {
          const { record } = pin;
          const ownerName = formatOwnerName(
            record.owner1_first_name,
            record.owner1_last_name || "Unknown",
          );
          const propertyValue = formatCurrency(
            record.assessed_value || record.estimated_value,
          );

          return (
            <Marker
              key={`marker-${pin.id}`}
              longitude={pin.longitude}
              latitude={pin.latitude}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
              }}
            >
              <Popover
                open={hoveredMarkerId === pin.id}
                onOpenChange={(open) =>
                  setHoveredMarkerId(open ? pin.id : null)
                }
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "relative group transition-all duration-200 hover:scale-110 hover:-translate-y-1",
                      "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full",
                    )}
                    onMouseEnter={() => setHoveredMarkerId(pin.id)}
                    onMouseLeave={() => setHoveredMarkerId(null)}
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
                  onMouseEnter={() => setHoveredMarkerId(pin.id)}
                  onMouseLeave={() => setHoveredMarkerId(null)}
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
        })}
      </ReactMap>
    </div>
  );
}
