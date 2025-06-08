-- License tables for subscription-based property search access
--
-- SUBSCRIPTION LIFECYCLE HANDLING:
-- - result_count: Tracks number of search results for each location when license was purchased ($1 per record per location)
-- - expires_at: Set to end of current billing period when license is created/renewed (stored at location level)
-- - When user cancels subscription: license remains active until expires_at (grace period)
-- - When subscription renews successfully: update expires_at to next billing period end
-- - When payment fails or subscription cancelled: do NOT extend expires_at, let license expire naturally
--
-- STRIPE WEBHOOK INTEGRATION REQUIREMENTS:
-- - subscription.updated (renewal): extend expires_at to next period end on location licenses
-- - invoice.payment_failed: do NOT extend expires_at, let location licenses expire at current period end
-- - customer.subscription.deleted (cancellation): do NOT extend expires_at, allow grace period until expires_at
--
-- This implements a grace period system where cancelled/failed subscriptions don't immediately
-- terminate access, but allow access until the already-paid billing period ends.
-- Each location license has its own expiration date for individual subscription management.

-- location type enum
CREATE TYPE location_type AS ENUM ('county', 'city');

-- Asset licenses table (parent) - contains main license information per user/asset type
-- Note: expires_at removed - expiration is now tracked per location license
CREATE TABLE asset_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    asset_type_slug TEXT NOT NULL REFERENCES asset_types (slug) ON DELETE CASCADE,
    search_params JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, asset_type_slug)
);

-- Location licenses table (child) - contains specific locations under each asset license
-- Each location has its own subscription and expiration date
CREATE TABLE location_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    asset_license_id UUID NOT NULL REFERENCES asset_licenses (id) ON DELETE CASCADE,
    location_internal_id TEXT NOT NULL,
    location_name TEXT NOT NULL,
    location_type location_type NOT NULL,
    location_formatted TEXT NOT NULL,
    location_state VARCHAR(2) NOT NULL,
    result_count INTEGER NOT NULL DEFAULT 0, -- Number of search results for this specific location ($1 per record)
    expires_at TIMESTAMP WITH TIME ZONE, -- When this location license expires (end of current billing period)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (
        asset_license_id,
        location_internal_id
    )
);

-- Legacy user_licenses view for backward compatibility
CREATE VIEW user_licenses AS
SELECT
    ll.id,
    al.user_id,
    al.asset_type_slug,
    ll.location_internal_id,
    ll.location_name,
    ll.location_type,
    ll.location_formatted,
    ll.location_state,
    (
        al.is_active
        AND ll.is_active
    ) as is_active,
    ll.result_count,
    ll.expires_at, -- Now from location_licenses table
    ll.created_at,
    ll.updated_at
FROM
    location_licenses ll
    JOIN asset_licenses al ON ll.asset_license_id = al.id;

-- Indexes for asset_licenses table
CREATE INDEX idx_asset_licenses_user_id ON asset_licenses (user_id);

CREATE INDEX idx_asset_licenses_asset_type_slug ON asset_licenses (asset_type_slug);

CREATE INDEX idx_asset_licenses_active ON asset_licenses (is_active);

CREATE INDEX idx_asset_licenses_user_asset_type ON asset_licenses (user_id, asset_type_slug);

-- Indexes for location_licenses table
CREATE INDEX idx_location_licenses_asset_license_id ON location_licenses (asset_license_id);

CREATE INDEX idx_location_licenses_location_internal_id ON location_licenses (location_internal_id);

CREATE INDEX idx_location_licenses_active ON location_licenses (is_active);

CREATE INDEX idx_location_licenses_expires_at ON location_licenses (expires_at);

CREATE INDEX idx_location_licenses_result_count ON location_licenses (result_count);

CREATE INDEX idx_location_licenses_state ON location_licenses (location_state);

CREATE INDEX idx_location_licenses_type ON location_licenses (location_type);

-- Triggers for updated_at timestamp
CREATE TRIGGER update_asset_licenses_updated_at
    BEFORE UPDATE ON asset_licenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_location_licenses_updated_at
    BEFORE UPDATE ON location_licenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security
ALTER TABLE asset_licenses ENABLE ROW LEVEL SECURITY;

ALTER TABLE location_licenses ENABLE ROW LEVEL SECURITY;

-- RLS Policies - users can only access their own licenses
CREATE POLICY select_own_asset_licenses ON asset_licenses FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY select_own_location_licenses ON location_licenses FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM asset_licenses al
            WHERE
                al.id = asset_license_id
                AND al.user_id = auth.uid ()
        )
    );

-- Updated view to work with normalized structure
-- Note: Since expires_at is now per location, we show the earliest expiration date for the asset type
CREATE OR REPLACE VIEW user_licenses_by_asset_type AS
SELECT
    al.user_id,
    al.asset_type_slug,
    at.name AS asset_type_name,
    sum(ll.result_count) AS total_result_count, -- Sum of all location result counts
    min(ll.expires_at) AS expires_at, -- Earliest expiration date among all locations
    array_agg(
        ll.location_internal_id
        ORDER BY ll.location_internal_id
    ) AS location_ids,
    count(*) AS license_count
FROM
    asset_licenses al
    JOIN asset_types at ON al.asset_type_slug = at.slug
    JOIN location_licenses ll ON al.id = ll.asset_license_id
WHERE
    al.is_active = true
    AND ll.is_active = true
GROUP BY
    al.user_id,
    al.asset_type_slug,
    at.name;