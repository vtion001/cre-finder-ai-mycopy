import type {
  AutocompleteResponse,
  BulkSkipTraceAwaitResponse,
  BulkSkipTraceResponse,
  GetAutocompleteParams,
  GetBulkSkipTraceAwaitParams,
  GetBulkSkipTraceParams,
  GetPropertySearchParams,
  GetSkipTraceParams,
  PropertySearchResponse,
  PropertySearchResult,
  SkipTraceResponse,
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

  // Transform frontend fields to API parameters
  const {
    loan_paid_off_percent_min,
    loan_paid_off_percent_max,
    number_of_units,
    ...baseParams
  } = params;
  const transformedParams = { ...baseParams };

  // Convert loan paid off percentage to API format
  if (loan_paid_off_percent_min && loan_paid_off_percent_max) {
    // If both min and max are provided, use the min value with "gte" operator
    transformedParams.equity_percent = loan_paid_off_percent_min;
    transformedParams.equity_percent_operator = "gte";
  } else if (loan_paid_off_percent_min) {
    // Only min provided
    transformedParams.equity_percent = loan_paid_off_percent_min;
    transformedParams.equity_percent_operator = "gte";
  } else if (loan_paid_off_percent_max) {
    // Only max provided
    transformedParams.equity_percent = loan_paid_off_percent_max;
    transformedParams.equity_percent_operator = "lte";
  }

  // Convert number of units to API format
  if (number_of_units === "2-4") {
    transformedParams.mfh_2to4 = true;
  } else if (number_of_units === "5+") {
    transformedParams.mfh_5plus = true;
  }

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
          ...transformedParams,
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
          ...transformedParams,
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

export async function getSkipTrace(params: GetSkipTraceParams) {
  console.log("getSkipTrace", params);

  const response = await fetch("https://api.realestateapi.com/v1/SkipTrace", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.REALESTATEAPI_SKIP_KEY!,
      "x-user-id": "CREFinderAI",
    },
    body: JSON.stringify(params),
  });

  const data = (await response.json()) as SkipTraceResponse;
  return data;
}

export async function getBulkSkipTrace(params: GetBulkSkipTraceParams) {
  console.log("getBulkSkipTrace", params);

  const response = await fetch(
    "https://api.realestateapi.com/v1/SkipTraceBatch",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REALESTATEAPI_API_KEY!,
        "x-user-id": "CREFinderAI",
      },
      body: JSON.stringify(params),
    },
  );

  const data = (await response.json()) as BulkSkipTraceResponse;
  return data;
}

export async function getBulkSkipTraceAwait(
  params: GetBulkSkipTraceAwaitParams,
) {
  console.log("getBulkSkipTraceAwait", params);

  const response = await fetch(
    "https://api.realestateapi.com/v1/SkipTraceBatchAwait",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REALESTATEAPI_API_KEY!,
        "x-user-id": "CREFinderAI",
      },
      body: JSON.stringify(params),
    },
  );

  const data = (await response.json()) as BulkSkipTraceAwaitResponse;
  return data;
}
