"use client";

import type { Tables } from "@v1/supabase/types";
import { Badge } from "@v1/ui/badge";
import { cn } from "@v1/ui/cn";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@v1/ui/hover-card";
import { useTheme } from "next-themes";
import { useMemo, useRef } from "react";
import ReactMap, {
  FullscreenControl,
  GeolocateControl,
  type MapRef,
  Marker,
  NavigationControl,
  ScaleControl,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { format } from "date-fns";
import { MapPinIcon } from "lucide-react";

type PropertyRecord = Tables<"property_records">;

interface PropertyMapProps {
  records: PropertyRecord[];
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

export function PropertyMap({ records, className }: PropertyMapProps) {
  const { theme } = useTheme();
  const mapRef = useRef<MapRef>(null);

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

  if (mapPins.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-12 text-center",
          className,
        )}
      >
        <MapPinIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-medium">
          No properties with location data
        </h3>
        <p className="text-muted-foreground mt-1">
          Properties need valid latitude and longitude coordinates to display on
          the map.
        </p>
      </div>
    );
  }

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
              <button
                type="button"
                className={cn(
                  "relative group transition-all duration-200 hover:scale-110 hover:-translate-y-1",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full",
                )}
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
            </Marker>
          );
        })}
      </ReactMap>
    </div>
  );
}
