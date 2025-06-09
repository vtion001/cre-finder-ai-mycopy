import type { Json } from "@v1/supabase/types";
import type { GooglePlaceResult } from "../providers/google/types";
import type { PropertySearchResult } from "../providers/realestateapi/types";

/**
 * Cross-references Real Estate API results with Google Places results.
 * Only returns Real Estate API records that have a matching location in Google Places.
 * Uses Real Estate API data exclusively - Google Places is only used for filtering.
 *
 * Based on analysis of actual response data, uses minimal transformation for optimal matching.
 */
export function crossReferenceResults(
  realEstateResults: PropertySearchResult[],
  googlePlacesResults: GooglePlaceResult[],
): PropertySearchResult[] {
  if (googlePlacesResults.length === 0) {
    return realEstateResults;
  }

  // Create lookup structures for Google Places data
  const googleAddressSet = new Set<string>();
  const googleCoordinates: Array<{
    lat: number;
    lng: number;
    address: string;
  }> = [];

  for (const place of googlePlacesResults) {
    // Normalize Google Places address (remove ", United States" suffix)
    const cleanAddress = place.formatted_address.replace(
      /, United States$/,
      "",
    );
    const normalizedAddress = normalizeAddressForMatching(cleanAddress);
    googleAddressSet.add(normalizedAddress);

    // Store coordinates for proximity matching
    googleCoordinates.push({
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      address: normalizedAddress,
    });

    // Add street-only variation for partial matching
    const addressParts = cleanAddress.split(",");
    if (addressParts.length > 0) {
      const streetOnly = normalizeAddressForMatching(addressParts[0]!.trim());
      googleAddressSet.add(streetOnly);
    }
  }

  // Filter Real Estate API results to only include those with matching locations
  return realEstateResults.filter((property) => {
    // Try address-based matching first
    const addressVariations = [
      property.address.address,
      property.address.street,
      `${property.address.street}, ${property.address.city}, ${property.address.state} ${property.address.zip}`,
      `${property.address.address}, ${property.address.city}, ${property.address.state} ${property.address.zip}`,
    ].filter(Boolean);

    const hasAddressMatch = addressVariations.some((address) => {
      if (typeof address === "string") {
        const normalizedAddress = normalizeAddressForMatching(address);
        return googleAddressSet.has(normalizedAddress);
      }
      return false;
    });

    if (hasAddressMatch) {
      return true;
    }

    // If no address match, try coordinate proximity matching (within ~100 meters)
    if (
      typeof property.latitude === "number" &&
      typeof property.longitude === "number"
    ) {
      return googleCoordinates.some((googleCoord) => {
        const distance = calculateDistance(
          property.latitude as number,
          property.longitude as number,
          googleCoord.lat,
          googleCoord.lng,
        );
        return distance <= 0.001; // Approximately 100 meters
      });
    }

    return false;
  });
}

/**
 * Normalizes addresses for matching based on analysis of actual API responses.
 * Handles specific patterns found in Google Places vs Real Estate API data.
 */
function normalizeAddressForMatching(address: string): string {
  return (
    address
      .toLowerCase()
      .trim()
      // Remove common punctuation and extra spaces
      .replace(/[.,#]/g, "")
      .replace(/\s+/g, " ")
      // Handle highway naming variations (key insight from data analysis)
      .replace(/\bhighway\s+(\d+)\s*([ns]?)\b/g, "hwy $1 $2")
      .replace(/\bsc-(\d+)\b/g, "hwy $1")
      .replace(/\bn\s+hwy\b/g, "hwy")
      .replace(/\bs\s+hwy\b/g, "hwy")
      // Normalize common address abbreviations
      .replace(/\bstreet\b/g, "st")
      .replace(/\bavenue\b/g, "ave")
      .replace(/\bdrive\b/g, "dr")
      .replace(/\broad\b/g, "rd")
      .replace(/\blane\b/g, "ln")
      .replace(/\bcourt\b/g, "ct")
      .replace(/\bplace\b/g, "pl")
      .replace(/\bboulevard\b/g, "blvd")
      .replace(/\bcircle\b/g, "cir")
      .replace(/\bparkway\b/g, "pkwy")
      // Normalize directional indicators
      .replace(/\bnorth\b/g, "n")
      .replace(/\bsouth\b/g, "s")
      .replace(/\beast\b/g, "e")
      .replace(/\bwest\b/g, "w")
      // Clean up extra spaces
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Calculates the distance between two coordinate points in degrees.
 * Used for proximity matching when address matching fails.
 */
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const deltaLat = lat1 - lat2;
  const deltaLng = lng1 - lng2;
  return Math.sqrt(deltaLat * deltaLat + deltaLng * deltaLng);
}

export function mapPropertyToRecord(
  property: PropertySearchResult,
  locationLicenseId: string,
  userId: string,
  assetLicenseId: string,
) {
  return {
    location_license_id: locationLicenseId,
    user_id: userId,
    asset_license_id: assetLicenseId,
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
