import type {
  AutocompleteResponse,
  GetAutocompleteParams,
  GetPropertySearchParams,
  PropertySearchResponse,
  PropertySearchResult,
} from "./types";

export async function getAutocomplete({
  query,
  searchTypes,
}: GetAutocompleteParams) {
  const response = await fetch(
    "https://api.realestateapi.com/v2/AutoComplete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REALESTATEAPI_API_KEY!,
        "x-user-id": "CREFinderAI",
      },
      body: JSON.stringify({
        search: query,
        search_types: searchTypes,
      }),
    },
  );

  const data = (await response.json()) as AutocompleteResponse;

  return data.data;
}

export async function getPropertySearch(
  params: GetPropertySearchParams,
  count = true,
) {
  console.log("getPropertySearch", params);

  // If count is true, just get the count without pagination
  if (count) {
    const response = await fetch(
      "https://api.realestateapi.com/v2/PropertySearch",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REALESTATEAPI_API_KEY!,
          "x-user-id": "CREFinderAI",
        },
        body: JSON.stringify({
          ...params,
          count: true,
        }),
      },
    );

    const data = (await response.json()) as PropertySearchResponse;
    return data;
  }

  const allResults: PropertySearchResult[] = [];
  let resultIndex = 0;
  const pageSize = 250;
  let totalRecords = 0;
  let firstResponse: PropertySearchResponse | null = null;

  do {
    const response = await fetch(
      "https://api.realestateapi.com/v2/PropertySearch",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REALESTATEAPI_API_KEY!,
          "x-user-id": "CREFinderAI",
        },
        body: JSON.stringify({
          ...params,
          count: false,
          size: pageSize,
          resultIndex,
        }),
      },
    );

    const data = (await response.json()) as PropertySearchResponse;

    // Store the first response to use its metadata
    if (!firstResponse) {
      firstResponse = data;
      totalRecords = data.resultCount;
    }

    // Add the current page's results
    if (data.data && data.data.length > 0) {
      allResults.push(...data.data);
    }

    resultIndex += pageSize;
  } while (resultIndex < totalRecords && allResults.length < totalRecords);

  return {
    ...firstResponse!,
    data: allResults,
    resultCount: allResults.length,
    recordCount: allResults.length,
  };
}
