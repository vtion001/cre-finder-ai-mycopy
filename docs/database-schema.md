# Database Schema Documentation

This document describes the PostgreSQL database schema used by CRE Finder AI, hosted on Supabase.

## 🏗️ Schema Overview

The database is designed around a subscription-based licensing model where users purchase licenses to search for commercial real estate properties in specific locations and asset types.

## 📊 Core Tables

### Users Table (`users`)

Stores user profile information and settings.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,                    -- References auth.users
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone_number TEXT,
    avatar_url TEXT,
    locale TEXT DEFAULT 'en',
    timezone TEXT,
    time_format NUMERIC DEFAULT 24,
    billing_address JSONB,                  -- Stripe billing address
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Key Points:**
- Links to Supabase Auth via foreign key
- Stores billing information for Stripe integration
- Supports internationalization (locale, timezone)

### Asset Types Table (`asset_types`)

Defines the types of commercial properties available for search.

```sql
CREATE TABLE asset_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,              -- e.g., "Office", "Retail", "Industrial"
    description TEXT,
    use_codes INTEGER[],                    -- Property use codes for filtering
    slug TEXT UNIQUE,                       -- URL-friendly identifier
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Examples:**
- Office Buildings
- Retail Spaces
- Industrial Properties
- Multi-Family Housing
- Land

## 🔐 Licensing System

The licensing system uses a two-tier approach: Asset Licenses (parent) and Location Licenses (child).

### Asset Licenses Table (`asset_licenses`)

Parent licenses that define search parameters for a specific asset type.

```sql
CREATE TABLE asset_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    asset_type_slug TEXT NOT NULL REFERENCES asset_types(slug) ON DELETE CASCADE,
    search_params JSONB,                    -- Filters like price range, size, etc.
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, asset_type_slug)        -- One license per user per asset type
);
```

**Search Parameters Example:**
```json
{
  "price_min": 100000,
  "price_max": 5000000,
  "square_feet_min": 1000,
  "square_feet_max": 50000,
  "year_built_min": 1990
}
```

### Location Licenses Table (`location_licenses`)

Child licenses for specific geographic locations under an asset license.

```sql
CREATE TABLE location_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_license_id UUID NOT NULL REFERENCES asset_licenses(id) ON DELETE CASCADE,
    location_internal_id TEXT NOT NULL,     -- e.g., "c-fl-miami" or "n-ca-los-angeles"
    location_name TEXT NOT NULL,            -- e.g., "Miami" or "Los Angeles County"
    location_type location_type NOT NULL,   -- 'city' or 'county'
    location_formatted TEXT NOT NULL,       -- e.g., "Miami, FL" or "Los Angeles County, CA"
    location_state VARCHAR(2) NOT NULL,     -- State code
    result_count INTEGER NOT NULL DEFAULT 0, -- Number of properties found ($1 per record)
    expires_at TIMESTAMP WITH TIME ZONE,    -- When this location license expires
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Billing Model:**
- **One-time fee**: $1 per property record returned
- **Monthly subscription**: 50% of one-time fee for continued access
- **Expiration**: Tracked per location, not per asset type

## 🏠 Property Data

### Property Records Table (`property_records`)

Stores detailed property information from search results.

```sql
CREATE TABLE property_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_license_id UUID NOT NULL REFERENCES location_licenses(id) ON DELETE CASCADE,
    asset_license_id UUID NOT NULL REFERENCES asset_licenses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    property_id TEXT NOT NULL,              -- External property identifier
    
    -- Address Information
    address TEXT NOT NULL,
    city TEXT,
    state TEXT NOT NULL,
    zip TEXT NOT NULL,
    county TEXT,
    street TEXT,
    fips TEXT,                              -- FIPS county code
    
    -- Mailing Address
    mail_address TEXT,
    mail_city TEXT,
    mail_state TEXT,
    mail_zip TEXT,
    mail_street TEXT,
    
    -- Owner Information
    owner1_first_name TEXT,
    owner1_last_name TEXT NOT NULL,
    owner2_first_name TEXT,
    owner2_last_name TEXT,
    corporate_owned BOOLEAN DEFAULT FALSE,
    owner_occupied BOOLEAN DEFAULT FALSE,
    absentee_owner BOOLEAN DEFAULT FALSE,
    out_of_state_absentee_owner BOOLEAN DEFAULT FALSE,
    
    -- Property Details
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
    
    -- Financial Information
    last_sale_date DATE,
    last_sale_amount TEXT,
    last_sale_arms_length BOOLEAN,
    prior_sale_amount TEXT,
    assessed_value BIGINT,
    estimated_value BIGINT,
    price_per_square_foot NUMERIC,
    
    -- Mortgage/Loan Information
    lender_name TEXT,
    last_mortgage1_amount TEXT,
    loan_type_code TEXT,
    adjustable_rate BOOLEAN DEFAULT FALSE,
    recording_date DATE,
    maturity_date_first DATE,
    open_mortgage_balance BIGINT,
    private_lender BOOLEAN DEFAULT FALSE,
    
    -- Equity Information
    high_equity BOOLEAN DEFAULT FALSE,
    negative_equity BOOLEAN DEFAULT FALSE,
    equity_percent NUMERIC,
    
    -- Property Characteristics
    vacant BOOLEAN DEFAULT FALSE,
    patio BOOLEAN DEFAULT FALSE,
    patio_area NUMERIC,
    pool BOOLEAN DEFAULT FALSE,
    pool_area NUMERIC,
    
    -- Legal/Financial Status
    pre_foreclosure BOOLEAN DEFAULT FALSE,
    reo BOOLEAN DEFAULT FALSE,
    judgment BOOLEAN DEFAULT FALSE,
    tax_lien BOOLEAN DEFAULT FALSE,
    tax_delinquent_year TEXT,
    
    -- MLS Information
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
    
    -- Portfolio Information
    total_properties_owned TEXT,
    total_portfolio_value TEXT,
    total_portfolio_equity TEXT,
    total_portfolio_mortgage_balance TEXT,
    portfolio_purchased_last_6_months NUMERIC,
    portfolio_purchased_last_12_months NUMERIC,
    years_owned NUMERIC,
    
    -- Geographic Information
    latitude NUMERIC,
    longitude NUMERIC,
    
    -- Skip Trace Data (populated by background jobs)
    skip_trace_data JSONB,
    skip_trace_updated_at TIMESTAMP WITH TIME ZONE,
    
    -- Additional Fields
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
    
    -- Multi-family Indicators
    mfh_2_to_4 BOOLEAN DEFAULT FALSE,
    mfh_5_plus BOOLEAN DEFAULT FALSE,
    
    -- Neighborhood Information
    neighborhood JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Constraints
    UNIQUE(location_license_id, property_id)  -- Prevent duplicate properties per license
);
```

## 💳 Billing Integration (Stripe)

### Customers Table (`customers`)

Maps users to Stripe customers.

```sql
CREATE TABLE customers (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    stripe_customer_id TEXT
);
```

### Products Table (`products`)

Stripe products synchronized via webhooks.

```sql
CREATE TABLE products (
    id TEXT PRIMARY KEY,                    -- Stripe product ID
    active BOOLEAN,
    name TEXT,
    description TEXT,
    image TEXT,
    metadata JSONB
);
```

### Prices Table (`prices`)

Stripe pricing information.

```sql
CREATE TABLE prices (
    id TEXT PRIMARY KEY,                    -- Stripe price ID
    product_id TEXT REFERENCES products,
    active BOOLEAN,
    description TEXT,
    unit_amount BIGINT,
    currency TEXT CHECK (char_length(currency) = 3),
    type pricing_type,                      -- 'one_time' or 'recurring'
    interval pricing_plan_interval,         -- 'day', 'week', 'month', 'year'
    interval_count INTEGER,
    trial_period_days INTEGER,
    metadata JSONB
);
```

### Subscriptions Table (`subscriptions`)

Active Stripe subscriptions.

```sql
CREATE TABLE subscriptions (
    id TEXT PRIMARY KEY,                    -- Stripe subscription ID
    user_id UUID REFERENCES auth.users NOT NULL,
    status subscription_status,
    metadata JSONB,
    price_id TEXT REFERENCES prices,
    quantity INTEGER,
    cancel_at_period_end BOOLEAN,
    created TIMESTAMP WITH TIME ZONE,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    cancel_at TIMESTAMP WITH TIME ZONE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE
);
```

## 🔄 Data Flow

1. **User Registration**: Creates entry in `users` table
2. **License Purchase**: 
   - Creates `asset_licenses` entry
   - Creates `location_licenses` entries for each location
   - Stripe subscription created for recurring billing
3. **Property Search**: 
   - Background job fetches property data
   - Stores results in `property_records`
   - Updates `result_count` for billing
4. **Skip Tracing**: 
   - Background job processes properties
   - Updates `skip_trace_data` field

## 🔒 Security

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Service role used for background jobs
- Stripe webhooks handle billing updates securely

## 📈 Indexes

Key indexes for performance:

```sql
-- Property records by license
CREATE INDEX idx_property_records_location_license ON property_records(location_license_id);
CREATE INDEX idx_property_records_asset_license ON property_records(asset_license_id);
CREATE INDEX idx_property_records_user ON property_records(user_id);

-- Geographic queries
CREATE INDEX idx_property_records_location ON property_records(latitude, longitude);
CREATE INDEX idx_property_records_state ON property_records(state);

-- License lookups
CREATE INDEX idx_location_licenses_asset ON location_licenses(asset_license_id);
CREATE INDEX idx_asset_licenses_user_type ON asset_licenses(user_id, asset_type_slug);
```

## 🔧 Maintenance

- **Migrations**: Located in `apps/api/supabase/migrations/`
- **Seed Data**: Located in `apps/api/supabase/seed.sql`
- **Type Generation**: Run `bun run generate` in `apps/api/`
- **Backups**: Handled by Supabase automatically
- **Email Templates**:
  - Development: `apps/api/supabase/templates/`
  - Production: Managed through Loops service
