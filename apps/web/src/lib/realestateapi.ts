import { env } from "@/env.mjs";

type AutocompleteCity = {
  searchType: "C";
  city: string;
  state: string;
  title: string;
};

type AutocompleteCounty = {
  searchType: "N";
  stateId: string;
  county: string;
  fips: string;
  title: string;
  countyId: string;
  state: string;
};

type AutocompleteResult = AutocompleteCity | AutocompleteCounty;

type AutocompleteResponse = {
  input: {
    search: string;
    search_types: Array<string>;
  };
  data: Array<AutocompleteResult>;
  totalResults: number;
  returnedResults: number;
  statusCode: number;
  statusMessage: string;
  live: string;
  requestExecutionTimeMS: string;
};

export type PropertySearchResult = {
  absenteeOwner: boolean;
  address: {
    address: string;
    city?: string;
    county: string;
    fips: string;
    state: string;
    street?: string;
    zip: string;
  };
  adjustableRate: boolean;
  airConditioningAvailable: boolean;
  apn: string;
  assessedImprovementValue: number;
  assessedLandValue: number;
  assessedValue: number;
  assumable: boolean;
  auction: boolean;
  auctionDate: string;
  basement: boolean;
  bathrooms?: number;
  bedrooms?: number;
  cashBuyer: boolean;
  companyName?: string;
  corporateOwned: boolean;
  death: boolean;
  deck: boolean;
  deckArea: number;
  equity: boolean;
  equityPercent?: number;
  estimatedEquity: number;
  estimatedValue: number;
  floodZone: boolean;
  floodZoneDescription?: string;
  floodZoneType?: string;
  foreclosure: boolean;
  forSale: boolean;
  freeClear: boolean;
  garage: boolean;
  highEquity: boolean;
  hoa: boolean;
  id: string;
  inherited: boolean;
  inStateAbsenteeOwner: boolean;
  investorBuyer: boolean;
  judgment: boolean;
  landUse: string;
  lastMortgage1Amount: string;
  lastSaleAmount: string;
  lastSaleArmsLength?: boolean;
  lastUpdateDate: string;
  latitude?: number;
  lenderName?: string;
  listingAmount: string;
  loanTypeCode?: string;
  longitude?: number;
  lotSquareFeet: number;
  mailAddress: {
    address: string;
    city?: string;
    county?: string;
    state?: string;
    street?: string;
    zip?: string;
  };
  medianIncome?: string;
  MFH2to4: boolean;
  MFH5plus: boolean;
  mlsActive: boolean;
  mlsCancelled: boolean;
  mlsFailed: boolean;
  mlsHasPhotos: boolean;
  mlsListingPrice?: number;
  mlsPending: boolean;
  mlsSold: boolean;
  negativeEquity: boolean;
  neighborhood?: {
    center: string;
    id: string;
    name: string;
    type: string;
  };
  openMortgageBalance: number;
  outOfStateAbsenteeOwner: boolean;
  owner1LastName: string;
  ownerOccupied: boolean;
  patio: boolean;
  patioArea: number;
  pool: boolean;
  poolArea: number;
  portfolioPurchasedLast12Months?: number;
  portfolioPurchasedLast6Months?: number;
  preForeclosure: boolean;
  pricePerSquareFoot: number;
  priorSaleAmount?: string;
  privateLender: boolean;
  propertyId: string;
  propertyType: string;
  propertyUse?: string;
  propertyUseCode?: number;
  rentAmount: string;
  reo: boolean;
  roomsCount: number;
  squareFeet: number;
  stories?: number;
  suggestedRent?: string;
  taxLien?: boolean;
  totalPortfolioEquity?: string;
  totalPortfolioMortgageBalance?: string;
  totalPortfolioValue?: string;
  totalPropertiesOwned?: string;
  unitsCount: number;
  vacant: boolean;
  yearBuilt: number;
  yearsOwned?: number;
  owner1FirstName?: string;
  owner2FirstName?: string;
  owner2LastName?: string;
  parcelAccountNumber?: string;
  documentType?: string;
  documentTypeCode?: string;
  lastSaleDate?: string;
  maturityDateFirst?: string;
  mlsDaysOnMarket?: number;
  mlsLastSaleDate?: string;
  mlsLastStatusDate?: string;
  mlsListingDate?: string;
  mlsSoldPrice?: number;
  mlsStatus?: string;
  mlsType?: string;
  priorOwnerIndividual?: boolean;
  priorOwnerMonthsOwned?: string;
  recordingDate?: string;
  taxDelinquentYear?: string;
};

type PropertySearchResponse = {
  live: boolean;
  input: {
    count: boolean;
    ids_only: boolean;
    obfuscate: boolean;
    summary: boolean;
    size: number;
    building_size_min: number;
    building_size_max: number;
    lot_size_min: number;
    lot_size_max: number;
    last_sale_date: string;
    year_min: number;
    year_max: number;
  };
  data: Array<PropertySearchResult>;
  resultCount: number;
  resultIndex: number;
  recordCount: number;
  statusCode: number;
  statusMessage: string;
  requestExecutionTimeMS: string;
};
interface GetAutocompleteParams {
  query: string;
  searchTypes: Array<string>;
}

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
        "x-api-key": env.REALESTATEAPI_API_KEY,
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

interface GetPropertySearchParams {
  count?: boolean;
  ids_only?: false;
  obfuscate?: false;
  summary?: false;
  size?: number;
  building_size_min?: number;
  building_size_max?: number;
  lot_size_min?: number;
  lot_size_max?: number;
  last_sale_date?: string; // "YYYY-MM-DD"
  year_min?: number;
  year_max?: number;
}

export async function getPropertySearch(params: GetPropertySearchParams) {
  const response = await fetch(
    "https://api.realestateapi.com/v2/PropertySearch",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.REALESTATEAPI_API_KEY,
        "x-user-id": "CREFinderAI",
      },
      body: JSON.stringify(params),
    },
  );

  const data = (await response.json()) as PropertySearchResponse;

  return data;
}
