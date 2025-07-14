export type AutocompleteCity = {
  searchType: "C";
  city: string;
  state: string;
  title: string;
};

export type AutocompleteCounty = {
  searchType: "N";
  stateId: string;
  county: string;
  fips: string;
  title: string;
  countyId: string;
  state: string;
};

export type AutocompleteResult = AutocompleteCity | AutocompleteCounty;

export type AutocompleteResponse = {
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
  auctionDate: string | null;
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
  last_sale_date?: string;
  maturityDateFirst?: string;
  mlsDaysOnMarket?: number;
  mlslast_sale_date?: string;
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

export type PropertySearchResponse = {
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

export type GetAutocompleteParams = {
  query: string;
  searchTypes: Array<string>;
};

export type GetPropertySearchParams = {
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
  equity_percent?: number;
  equity_percent_operator?: "gt" | "lt" | "gte" | "lte" | "eq";
  loan_paid_off_percent_min?: number;
  loan_paid_off_percent_max?: number;
  number_of_units?: "2-4" | "5+";
  mfh_2to4?: boolean;
  mfh_5plus?: boolean;
  mortgage_free_and_clear?: boolean;
  free_clear?: boolean;
  property_use_code?: number[];
  tax_delinquent_year_min?: number;
  tax_delinquent_year_max?: number;
  city?: string;
  county?: string;
  state?: string;
  resultIndex?: number;
};

// Skip Trace API Types
export type GetSkipTraceParams = {
  first_name?: string;
  last_name?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

export type SkipTraceIdentity = {
  name?: {
    first?: string;
    last?: string;
    middle?: string;
    full?: string;
  };
  addresses?: Array<{
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    type?: string;
    date_first_seen?: string;
    date_last_seen?: string;
  }>;
  phones?: Array<{
    number?: string;
    type?: string;
    carrier?: string;
    line_type?: string;
    date_first_seen?: string;
    date_last_seen?: string;
  }>;
  emails?: Array<{
    email?: string;
    type?: string;
    date_first_seen?: string;
    date_last_seen?: string;
  }>;
  relatives?: Array<{
    name?: string;
    relationship?: string;
    age?: number;
  }>;
};

export type SkipTraceDemographics = {
  age?: number;
  birth_date?: string;
  gender?: string;
  education?: string;
  occupation?: string;
  income_range?: string;
  marital_status?: string;
  children?: number;
  home_owner?: boolean;
  length_of_residence?: number;
};

export type SkipTraceStats = {
  phones_found?: number;
  emails_found?: number;
  jobs_found?: number;
  relationships_found?: number;
  addresses_found?: number;
};

export type SkipTraceResponse = {
  identity?: SkipTraceIdentity;
  demographics?: SkipTraceDemographics;
  stats?: SkipTraceStats;
  statusCode: number;
  statusMessage: string;
  requestExecutionTimeMS: string;
};

// Bulk Skip Trace API Types
export type BulkSkipTraceRequest = {
  key: string | number;
  first_name?: string;
  last_name?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  webhook_url?: string;
};

export type GetBulkSkipTraceParams = {
  webhook_url?: string;
  webcomplete_url?: string;
  requests: BulkSkipTraceRequest[];
};

export type BulkSkipTraceResponse = {
  batchId: string;
  receiveCount: number;
  batchRequestIds: Array<{
    key: string | number;
    batchRequestId: string;
  }>;
  statusCode: number;
  statusMessage: string;
  requestExecutionTimeMS: string;
};

export type BulkSkipTraceWebhookResponse = {
  batchId: string;
  batchRequestId: string;
  requestId: string;
  input: {
    key: string | number;
    first_name?: string;
    last_name?: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  identity?: SkipTraceIdentity;
  demographics?: SkipTraceDemographics;
  stats?: SkipTraceStats;
  statusCode: number;
  statusMessage: string;
  requestExecutionTimeMS: string;
};

// Bulk Skip Trace Await API Types
export type BulkSkipTraceAwaitRequest = {
  key: string | number;
  first_name?: string;
  last_name?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

export type GetBulkSkipTraceAwaitParams = {
  requests: BulkSkipTraceAwaitRequest[];
};

export type BulkSkipTraceAwaitResult = {
  key: string | number;
  identity?: SkipTraceIdentity;
  demographics?: SkipTraceDemographics;
  stats?: SkipTraceStats;
  statusCode: number;
  statusMessage: string;
};

export type BulkSkipTraceAwaitResponse = {
  results: BulkSkipTraceAwaitResult[];
  totalProcessed: number;
  statusCode: number;
  statusMessage: string;
  requestExecutionTimeMS: string;
};
