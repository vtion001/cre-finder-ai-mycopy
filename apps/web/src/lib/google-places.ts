import fs from "node:fs";
import { env } from "@/env.mjs";

interface GooglePlacesSearchParams {
  city?: string;
  county?: string;
  state?: string;
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

// Helper function to add delay between requests
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper function to make a single Google Places API request
async function makeGooglePlacesRequest(
  searchQuery: string,
  state?: string,
  pageToken?: string,
): Promise<GooglePlacesResponse> {
  const url = new URL(
    "https://maps.googleapis.com/maps/api/place/textsearch/json",
  );

  url.searchParams.append("query", searchQuery);
  url.searchParams.append("type", "storage");
  url.searchParams.append("key", env.GOOGLE_API_KEY);

  // Add radius parameter to maximize search area (50,000 meters is the max for Text Search)
  // url.searchParams.append("radius", "50000");

  // Add region parameter for location bias if state is available
  if (state) {
    // Convert state code to region format (lowercase)
    url.searchParams.append("region", state.toLowerCase());
  }

  if (pageToken) {
    url.searchParams.append("pagetoken", pageToken);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const data: GooglePlacesResponse = await response.json();

  return data;
}

export async function getStorageFacilities(params: GooglePlacesSearchParams) {
  const { city, county, state } = params;

  let locationQuery = "";
  if (city && state) {
    locationQuery = `${city}, ${state}`;
  } else if (county && state) {
    locationQuery = `${county}, ${state}`;
  } else if (state) {
    locationQuery = state;
  }

  const searchQuery = `"storage facilities in ${locationQuery}`;

  console.log("Google Places Search Query:", searchQuery);

  const allResults: GooglePlaceResult[] = [];
  let nextPageToken: string | undefined;
  let pageCount = 0;
  const maxPages = 10;

  do {
    pageCount++;

    if (nextPageToken) {
      await delay(2000);
    }

    const data = await makeGooglePlacesRequest(
      searchQuery,
      state,
      nextPageToken,
    );

    if (data.results && data.results.length > 0) {
      allResults.push(...data.results);
    }

    nextPageToken = data.next_page_token;
  } while (nextPageToken && pageCount < maxPages);

  const filteredResults = allResults.filter((result) => {
    return result.formatted_address
      .toLowerCase()
      .includes(locationQuery.toLowerCase());
  });

  // console.log(
  //   `Filtered ${allResults.length} results down to ${filteredResults.length} results that contain "${locationQuery}"`,
  // );

  // writeLogFile(locationQuery, filteredResults);

  return {
    results: filteredResults,
    status: PLACES_STATUS.OK,
    next_page_token: undefined,
  };
}
function writeLogFile(
  locationQuery: string,
  filteredResults: GooglePlaceResult[],
) {
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .substring(0, 19);

  // Create a URL-friendly version of the location query
  const querySlug = locationQuery
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const filename = `google-${querySlug}-${timestamp}.txt`;

  const addressList = filteredResults
    .map((result) => {
      const googleMapsUrl = `https://www.google.com/maps/place/?q=place_id:${result.place_id}`;
      return `${result.name}\n${result.formatted_address}\n${googleMapsUrl}\n`;
    })
    .join("\n");

  fs.writeFileSync(filename, addressList);
  console.log(`Wrote ${filteredResults.length} addresses to ${filename}`);
}
