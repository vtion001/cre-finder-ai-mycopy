import type { PlaceData } from "@googlemaps/google-maps-services-js";

/**
 * Type alias for Google Places API result data
 * Uses the official PlaceData type from @googlemaps/google-maps-services-js
 */
export type GooglePlaceResult = PlaceData;

export type OSMBoundaryResponse = {
  version: number;
  generator: string;
  osm3s: {
    timestamp_osm_base: string;
    timestamp_areas_base: string;
    copyright: string;
  };
  elements: Array<{
    type: string;
    id: number;
    bounds: {
      minlat: number;
      minlon: number;
      maxlat: number;
      maxlon: number;
    };
    members: Array<{
      type: string;
      ref: number;
      role: string;
      lat?: number;
      lon?: number;
      geometry?: Array<{
        lat: number;
        lon: number;
      }>;
    }>;
    tags: {
      admin_level: string;
      alt_name: string;
      attribution: string;
      border_type: string;
      boundary: string;
      name: string;
      "name:el": string;
      "name:en": string;
      "nist:fips_code": string;
      "nist:state_fips": string;
      population: string;
      source: string;
      "source:population": string;
      type: string;
      website: string;
      wikidata: string;
      wikipedia: string;
    };
  }>;
};
