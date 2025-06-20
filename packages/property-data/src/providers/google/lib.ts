import fs from "node:fs";
import type {
  GooglePlaceResult,
  GooglePlacesResponse,
  GooglePlacesSearchParams,
} from "./types";

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
  url.searchParams.append("key", process.env.GOOGLE_API_KEY!);

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

  const isCountySearch = county && state;

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

  if (isCountySearch) {
    return {
      results: allResults,
      status: PLACES_STATUS.OK,
      next_page_token: undefined,
    };
  }

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
