import { env } from "@/env.mjs";

interface GooglePlacesSearchParams {
  city?: string;
  county?: string;
  state?: string;
  size?: number;
}

interface GooglePlaceGeometry {
  location: {
    lat: number;
    lng: number;
  };
}

export interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: GooglePlaceGeometry;
  business_status?: string;
  rating?: number;
  user_ratings_total?: number;
  types: string[];
  vicinity?: string;
  price_level?: number;
  opening_hours?: {
    open_now?: boolean;
  };
}

interface GooglePlacesResponse {
  results: GooglePlaceResult[];
  status: string;
  error_message?: string;
  next_page_token?: string;
}

// Google Places API status codes
const PLACES_STATUS = {
  OK: "OK",
  ZERO_RESULTS: "ZERO_RESULTS",
  OVER_QUERY_LIMIT: "OVER_QUERY_LIMIT",
  REQUEST_DENIED: "REQUEST_DENIED",
  INVALID_REQUEST: "INVALID_REQUEST",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

export async function searchStorageFacilities(
  params: GooglePlacesSearchParams,
) {
  const { city, county, state } = params;

  let locationQuery = "";
  if (city && state) {
    locationQuery = `${city}, ${state}`;
  } else if (county && state) {
    locationQuery = `${county}, ${state}`;
  } else if (state) {
    locationQuery = state;
  }

  const searchQuery = `self storage facilities in ${locationQuery}`;
  const url = new URL(
    "https://maps.googleapis.com/maps/api/place/textsearch/json",
  );

  url.searchParams.append("query", searchQuery);
  url.searchParams.append("type", "storage");
  url.searchParams.append("key", env.GOOGLE_API_KEY);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const data: GooglePlacesResponse = await response.json();

  return data;
}
