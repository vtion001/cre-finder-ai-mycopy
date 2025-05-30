import type { Json } from "@v1/supabase/types";
import type { GooglePlaceResult } from "./google-places";
import type { PropertySearchResult } from "./realestateapi";

export function mergePropertySearchResults(
  realEstateResults: PropertySearchResult[],
  googlePlacesResults: PropertySearchResult[],
): PropertySearchResult[] {
  const uniqueProperties = new Map<string, PropertySearchResult>();

  for (const property of realEstateResults) {
    const key =
      `${property.address.address}_${property.address.zip}`.toLowerCase();
    uniqueProperties.set(key, property);
  }

  for (const property of googlePlacesResults) {
    const key =
      `${property.address.address}_${property.address.zip}`.toLowerCase();
    if (!uniqueProperties.has(key)) {
      uniqueProperties.set(key, property);
    }
  }

  return Array.from(uniqueProperties.values());
}

export function transformGooglePlaceToPropertyResult(
  place: GooglePlaceResult,
): PropertySearchResult {
  // Parse address components
  const { city, state, zip } = parseAddressComponents(place.formatted_address);

  const propertyId = `google_places_${place.place_id}`;

  return {
    // Required fields
    id: propertyId,
    propertyId: propertyId,
    apn: `GP-${place.place_id}`,

    // Address information
    address: {
      address: place.formatted_address,
      city: city,
      county: "", // Not available from Google Places
      fips: "", // Not available from Google Places
      state: state,
      street: place.name, // Use business name as street
      zip: zip,
    },

    // Owner information (not available from Google Places)
    owner1LastName: "Unknown",
    owner1FirstName: "",
    owner2FirstName: "",
    owner2LastName: "",

    // Property details
    propertyType: "Storage Facility",
    propertyUse: "Self Storage",
    propertyUseCode: 229, // Storage facility use code

    // Location data
    latitude: place.geometry.location.lat,
    longitude: place.geometry.location.lng,

    // Business information (when available)
    companyName: place.name,

    // Default values for required fields
    absenteeOwner: false,
    adjustableRate: false,
    airConditioningAvailable: false,
    assessedImprovementValue: 0,
    assessedLandValue: 0,
    assessedValue: 0,
    assumable: false,
    auction: false,
    auctionDate: null,
    basement: false,
    bathrooms: 0,
    bedrooms: 0,
    cashBuyer: false,
    corporateOwned: true, // Most storage facilities are corporate owned
    death: false,
    deck: false,
    deckArea: 0,
    equity: false,
    equityPercent: 0,
    estimatedEquity: 0,
    estimatedValue: 0,
    floodZone: false,
    floodZoneDescription: "",
    floodZoneType: "",
    foreclosure: false,
    forSale: false,
    freeClear: false,
    garage: false,
    highEquity: false,
    hoa: false,
    inherited: false,
    inStateAbsenteeOwner: false,
    investorBuyer: false,
    judgment: false,
    landUse: "Commercial",
    lastMortgage1Amount: "",
    lastSaleAmount: "",
    lastSaleArmsLength: false,
    lastUpdateDate: "",
    lenderName: "",
    listingAmount: "",
    loanTypeCode: "",
    lotSquareFeet: 0,
    mailAddress: {
      address: place.formatted_address,
      city: city,
      county: "",
      state: state,
      street: place.name,
      zip: zip,
    },
    medianIncome: "",
    MFH2to4: false,
    MFH5plus: false,
    mlsActive: false,
    mlsCancelled: false,
    mlsFailed: false,
    mlsHasPhotos: false,
    mlsListingPrice: 0,
    mlsPending: false,
    mlsSold: false,
    negativeEquity: false,
    neighborhood: {
      center: `${place.geometry.location.lat},${place.geometry.location.lng}`,
      id: place.place_id,
      name: place.vicinity || city,
      type: "business_area",
    },
    openMortgageBalance: 0,
    outOfStateAbsenteeOwner: false,
    ownerOccupied: false,
    patio: false,
    patioArea: 0,
    pool: false,
    poolArea: 0,
    portfolioPurchasedLast12Months: 0,
    portfolioPurchasedLast6Months: 0,
    preForeclosure: false,
    pricePerSquareFoot: 0,
    priorSaleAmount: "",
    privateLender: false,
    rentAmount: "",
    reo: false,
    roomsCount: 0,
    squareFeet: 0,
    stories: 1,
    suggestedRent: "",
    taxLien: false,
    totalPortfolioEquity: "",
    totalPortfolioMortgageBalance: "",
    totalPortfolioValue: "",
    totalPropertiesOwned: "",
    unitsCount: 0,
    vacant: false,
    yearBuilt: 0,
    yearsOwned: 0,
    parcelAccountNumber: "",
    documentType: "",
    documentTypeCode: "",
    last_sale_date: "",
    maturityDateFirst: "",
    mlsDaysOnMarket: 0,
    mlslast_sale_date: "",
    mlsLastStatusDate: "",
    mlsListingDate: "",
    mlsSoldPrice: 0,
    mlsStatus: "",
    mlsType: "",
    priorOwnerIndividual: false,
    priorOwnerMonthsOwned: "",
    recordingDate: "",
    taxDelinquentYear: "",
  };
}

function parseAddressComponents(formattedAddress: string): {
  city: string;
  state: string;
  zip: string;
} {
  // Extract ZIP code
  const zipMatch = formattedAddress.match(/\b\d{5}(-\d{4})?\b/);
  const zip = zipMatch ? zipMatch[0] : "";

  // Extract state (2-letter state code)
  const stateMatch = formattedAddress.match(/\b[A-Z]{2}\b/);
  const state = stateMatch ? stateMatch[0] : "";

  // Extract city (part before state)
  let city = "";
  if (state) {
    const stateIndex = formattedAddress.indexOf(state);
    const beforeState = formattedAddress.substring(0, stateIndex).trim();
    const parts = beforeState.split(", ");
    city = parts[parts.length - 1] || "";
  }

  return { city, state, zip };
}

// Helper function to convert PropertySearchResult to database record
export function mapPropertyToRecord(
  property: PropertySearchResult,
  searchLogId: string,
  userId: string,
) {
  return {
    search_log_id: searchLogId,
    user_id: userId,
    property_id: property.propertyId,

    // Address information
    address: property.address.address,
    city: property.address.city || null,
    state: property.address.state,
    zip: property.address.zip,
    county: property.address.county || null,
    street: property.address.street || null,
    fips: property.address.fips,

    // Mailing address
    mail_address: property.mailAddress?.address || null,
    mail_city: property.mailAddress?.city || null,
    mail_state: property.mailAddress?.state || null,
    mail_zip: property.mailAddress?.zip || null,
    mail_street: property.mailAddress?.street || null,

    // Owner information
    owner1_first_name: property.owner1FirstName || null,
    owner1_last_name: property.owner1LastName,
    owner2_first_name: property.owner2FirstName || null,
    owner2_last_name: property.owner2LastName || null,
    corporate_owned: property.corporateOwned,
    owner_occupied: property.ownerOccupied,
    absentee_owner: property.absenteeOwner,
    out_of_state_absentee_owner: property.outOfStateAbsenteeOwner,

    // Property details
    property_use: property.propertyUse || null,
    property_use_code: property.propertyUseCode || null,
    property_type: property.propertyType,
    land_use: property.landUse,
    lot_square_feet: property.lotSquareFeet || null,
    square_feet: property.squareFeet || null,
    year_built: property.yearBuilt || null,
    bedrooms: property.bedrooms || null,
    bathrooms: property.bathrooms || null,
    stories: property.stories || null,
    rooms_count: property.roomsCount || null,
    units_count: property.unitsCount || null,

    // Financial information
    last_sale_date: property.last_sale_date || null,
    last_sale_amount: property.lastSaleAmount || null,
    last_sale_arms_length: property.lastSaleArmsLength || null,
    prior_sale_amount: property.priorSaleAmount || null,
    assessed_value: property.assessedValue || null,
    estimated_value: property.estimatedValue || null,
    price_per_square_foot: property.pricePerSquareFoot || null,

    // Mortgage/Loan information
    lender_name: property.lenderName || null,
    last_mortgage1_amount: property.lastMortgage1Amount || null,
    loan_type_code: property.loanTypeCode || null,
    adjustable_rate: property.adjustableRate || false,
    recording_date: property.recordingDate || null,
    maturity_date_first: property.maturityDateFirst || null,
    open_mortgage_balance: property.openMortgageBalance || null,
    private_lender: property.privateLender || false,

    // Equity information
    high_equity: property.highEquity || false,
    negative_equity: property.negativeEquity || false,
    equity_percent: property.equityPercent || null,

    // Property characteristics
    vacant: property.vacant || false,
    patio: property.patio || false,
    patio_area: property.patioArea || null,
    pool: property.pool || false,
    pool_area: property.poolArea || null,

    // Legal/Financial status
    pre_foreclosure: property.preForeclosure || false,
    reo: property.reo || false,
    judgment: property.judgment || false,
    tax_lien: property.taxLien || null,
    tax_delinquent_year: property.taxDelinquentYear || null,

    // MLS information
    mls_active: property.mlsActive || false,
    mls_cancelled: property.mlsCancelled || false,
    mls_failed: property.mlsFailed || false,
    mls_has_photos: property.mlsHasPhotos || false,
    mls_listing_price: property.mlsListingPrice || null,
    mls_pending: property.mlsPending || false,
    mls_sold: property.mlsSold || false,
    mls_days_on_market: property.mlsDaysOnMarket || null,
    mls_last_sale_date: property.mlslast_sale_date || null,
    mls_last_status_date: property.mlsLastStatusDate || null,
    mls_listing_date: property.mlsListingDate || null,
    mls_sold_price: property.mlsSoldPrice || null,
    mls_status: property.mlsStatus || null,
    mls_type: property.mlsType || null,

    // Portfolio information
    total_properties_owned: property.totalPropertiesOwned || null,
    total_portfolio_value: property.totalPortfolioValue || null,
    total_portfolio_equity: property.totalPortfolioEquity || null,
    total_portfolio_mortgage_balance:
      property.totalPortfolioMortgageBalance || null,
    portfolio_purchased_last_6_months:
      property.portfolioPurchasedLast6Months || null,
    portfolio_purchased_last_12_months:
      property.portfolioPurchasedLast12Months || null,
    years_owned: property.yearsOwned || null,

    // Geographic information
    latitude: property.latitude || null,
    longitude: property.longitude || null,

    // Additional fields
    listing_amount: property.listingAmount || null,
    rent_amount: property.rentAmount || null,
    suggested_rent: property.suggestedRent || null,
    median_income: property.medianIncome || null,
    last_update_date: property.lastUpdateDate || null,
    document_type: property.documentType || null,
    document_type_code: property.documentTypeCode || null,
    parcel_account_number: property.parcelAccountNumber || null,
    prior_owner_individual: property.priorOwnerIndividual || null,
    prior_owner_months_owned: property.priorOwnerMonthsOwned || null,

    // Multi-family indicators
    mfh_2_to_4: property.MFH2to4 || false,
    mfh_5_plus: property.MFH5plus || false,

    // Neighborhood information
    neighborhood: property.neighborhood
      ? (property.neighborhood as Json)
      : null,
  };
}
