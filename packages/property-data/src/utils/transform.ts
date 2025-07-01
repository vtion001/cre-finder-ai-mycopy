import type { Json } from "@v1/supabase/types";

import type { PropertySearchResult } from "../providers/realestateapi/types";

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
