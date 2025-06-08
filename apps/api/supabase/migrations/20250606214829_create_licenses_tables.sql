-- location type enum
CREATE TYPE location_type AS ENUM ('county', 'city');

-- Asset licenses table (parent) - contains main license information per user/asset type
CREATE TABLE asset_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    asset_type_slug TEXT NOT NULL REFERENCES asset_types (slug) ON DELETE CASCADE,
    search_params JSONB,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, asset_type_slug)
);

-- Location licenses table (child) - contains specific locations under each asset license
CREATE TABLE location_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    asset_license_id UUID NOT NULL REFERENCES asset_licenses (id) ON DELETE CASCADE,
    location_internal_id TEXT NOT NULL,
    location_name TEXT NOT NULL,
    location_type location_type NOT NULL,
    location_formatted TEXT NOT NULL,
    location_state VARCHAR(2) NOT NULL,
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
    al.expires_at,
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
CREATE OR REPLACE VIEW user_licenses_by_asset_type AS
SELECT
    al.user_id,
    al.asset_type_slug,
    at.name AS asset_type_name,
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