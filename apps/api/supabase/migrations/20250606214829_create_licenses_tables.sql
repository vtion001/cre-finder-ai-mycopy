-- location type enum
CREATE TYPE location_type AS ENUM ('county', 'city');

CREATE TABLE user_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    asset_type_slug TEXT NOT NULL REFERENCES asset_types (slug) ON DELETE CASCADE,
    location_internal_id TEXT NOT NULL,
    location_name TEXT NOT NULL,
    location_type location_type NOT NULL,
    location_formatted TEXT NOT NULL,
    location_state VARCHAR(2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (
        user_id,
        asset_type_slug,
        location_internal_id
    )
);

-- Indexes for performance
CREATE INDEX idx_user_licenses_user_id ON user_licenses (user_id);

CREATE INDEX idx_user_licenses_asset_type_slug ON user_licenses (asset_type_slug);

CREATE INDEX idx_user_licenses_location_internal_id ON user_licenses (location_internal_id);

CREATE INDEX idx_user_licenses_active ON user_licenses (is_active);

CREATE INDEX idx_user_licenses_state ON user_licenses (location_state);

CREATE INDEX idx_user_licenses_type ON user_licenses (location_type);

CREATE INDEX idx_user_licenses_user_asset_type ON user_licenses (user_id, asset_type_slug);

-- Trigger for updated_at timestamp
CREATE TRIGGER update_user_licenses_updated_at 
    BEFORE UPDATE ON user_licenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security
ALTER TABLE user_licenses ENABLE ROW LEVEL SECURITY;

-- RLS Policy - users can only access their own licenses
CREATE POLICY select_own_user_licenses ON user_licenses FOR
SELECT USING (auth.uid () = user_id);

CREATE OR REPLACE VIEW user_licenses_by_asset_type AS
SELECT
    user_id,
    asset_type_slug,
    array_agg(
        location_internal_id
        ORDER BY location_internal_id
    ) AS location_ids,
    count(*) AS license_count
FROM user_licenses
WHERE
    is_active = true
GROUP BY
    user_id,
    asset_type_slug;