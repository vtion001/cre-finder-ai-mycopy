-- Create property_records table to store exported property data
CREATE TABLE public.property_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_license_id UUID NOT NULL REFERENCES public.location_licenses(id) ON DELETE CASCADE,
    asset_license_id UUID NOT NULL REFERENCES public.asset_licenses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

    property_id TEXT NOT NULL,

    -- Address information
    address TEXT NOT NULL,
    city TEXT,
    state TEXT NOT NULL,
    zip TEXT NOT NULL,
    county TEXT,
    street TEXT,
    fips TEXT,

    -- Mailing address
    mail_address TEXT,
    mail_city TEXT,
    mail_state TEXT,
    mail_zip TEXT,
    mail_street TEXT,

    -- Owner information
    owner1_first_name TEXT,
    owner1_last_name TEXT NOT NULL,
    owner2_first_name TEXT,
    owner2_last_name TEXT,
    corporate_owned BOOLEAN DEFAULT FALSE,
    owner_occupied BOOLEAN DEFAULT FALSE,
    absentee_owner BOOLEAN DEFAULT FALSE,
    out_of_state_absentee_owner BOOLEAN DEFAULT FALSE,

    -- Property details
    property_use TEXT,
    property_use_code NUMERIC,
    property_type TEXT,
    land_use TEXT,
    lot_square_feet NUMERIC,
    square_feet NUMERIC,
    year_built NUMERIC,
    bedrooms NUMERIC,
    bathrooms NUMERIC,
    stories NUMERIC,
    rooms_count NUMERIC,
    units_count NUMERIC,

    -- Financial information
    last_sale_date DATE,
    last_sale_amount TEXT,
    last_sale_arms_length BOOLEAN,
    prior_sale_amount TEXT,
    assessed_value BIGINT,
    estimated_value BIGINT,
    price_per_square_foot NUMERIC,

    -- Mortgage/Loan information
    lender_name TEXT,
    last_mortgage1_amount TEXT,
    loan_type_code TEXT,
    adjustable_rate BOOLEAN DEFAULT FALSE,
    recording_date DATE,
    maturity_date_first DATE,
    open_mortgage_balance BIGINT,
    private_lender BOOLEAN DEFAULT FALSE,

    -- Equity information
    high_equity BOOLEAN DEFAULT FALSE,
    negative_equity BOOLEAN DEFAULT FALSE,
    equity_percent NUMERIC,

    -- Property characteristics
    vacant BOOLEAN DEFAULT FALSE,
    patio BOOLEAN DEFAULT FALSE,
    patio_area NUMERIC,
    pool BOOLEAN DEFAULT FALSE,
    pool_area NUMERIC,

    -- Legal/Financial status
    pre_foreclosure BOOLEAN DEFAULT FALSE,
    reo BOOLEAN DEFAULT FALSE,
    judgment BOOLEAN DEFAULT FALSE,
    tax_lien BOOLEAN DEFAULT FALSE,
    tax_delinquent_year TEXT,

    -- MLS information
    mls_active BOOLEAN DEFAULT FALSE,
    mls_cancelled BOOLEAN DEFAULT FALSE,
    mls_failed BOOLEAN DEFAULT FALSE,
    mls_has_photos BOOLEAN DEFAULT FALSE,
    mls_listing_price BIGINT,
    mls_pending BOOLEAN DEFAULT FALSE,
    mls_sold BOOLEAN DEFAULT FALSE,
    mls_days_on_market NUMERIC,
    mls_last_sale_date DATE,
    mls_last_status_date DATE,
    mls_listing_date DATE,
    mls_sold_price BIGINT,
    mls_status TEXT,
    mls_type TEXT,

    -- Portfolio information
    total_properties_owned TEXT,
    total_portfolio_value TEXT,
    total_portfolio_equity TEXT,
    total_portfolio_mortgage_balance TEXT,
    portfolio_purchased_last_6_months NUMERIC,
    portfolio_purchased_last_12_months NUMERIC,
    years_owned NUMERIC,

    -- Geographic information
    latitude NUMERIC, longitude NUMERIC,

    -- Additional fields
    listing_amount TEXT,
    rent_amount TEXT,
    suggested_rent TEXT,
    median_income TEXT,
    last_update_date DATE,
    document_type TEXT,
    document_type_code TEXT,
    parcel_account_number TEXT,
    prior_owner_individual BOOLEAN,
    prior_owner_months_owned TEXT,

    -- Multi-family indicators
    mfh_2_to_4 BOOLEAN DEFAULT FALSE, mfh_5_plus BOOLEAN DEFAULT FALSE,

    -- Neighborhood information (stored as JSONB for flexibility)

    neighborhood JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create unique constraints
ALTER TABLE public.property_records 
ADD CONSTRAINT property_records_property_id_location_license_unique 
UNIQUE (property_id, location_license_id);

-- Create indexes for efficient querying
CREATE INDEX property_records_location_license_id_idx ON public.property_records (location_license_id);

CREATE INDEX property_records_asset_license_id_idx ON public.property_records (asset_license_id);

CREATE INDEX property_records_user_id_idx ON public.property_records (user_id);

CREATE INDEX property_records_property_id_idx ON public.property_records (property_id);

CREATE INDEX property_records_created_at_idx ON public.property_records (created_at);

-- Create trigger to update the updated_at column
CREATE TRIGGER property_records_updated_at
BEFORE UPDATE ON public.property_records
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Enable row level security
ALTER TABLE public.property_records ENABLE ROW LEVEL SECURITY;

-- Create policies for property_records
CREATE POLICY select_own_property_records ON public.property_records FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY insert_own_property_records ON public.property_records FOR INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY update_own_property_records ON public.property_records
FOR UPDATE
    USING (auth.uid () = user_id);

CREATE POLICY delete_own_property_records ON public.property_records FOR DELETE USING (auth.uid () = user_id);