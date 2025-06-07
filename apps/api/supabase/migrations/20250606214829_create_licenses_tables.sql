CREATE TABLE user_asset_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    asset_type_id UUID NOT NULL REFERENCES asset_types (id) ON DELETE RESTRICT,
    is_active BOOLEAN DEFAULT true,
    licensed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, asset_type_id)
);

CREATE TABLE license_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    license_id UUID NOT NULL REFERENCES user_asset_licenses (id) ON DELETE CASCADE,
    internal_id VARCHAR(255) name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('county', 'city')),
    formatted_name VARCHAR(255) NOT NULL,
    state_code VARCHAR(2) NOT NULL,
    result_count INTEGER NOT NULL,
    monthly_price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    removed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (license_id, internal_id)
);

CREATE INDEX idx_user_asset_licenses_user_id ON user_asset_licenses (user_id);

CREATE INDEX idx_user_asset_licenses_asset_type_id ON user_asset_licenses (asset_type_id);

CREATE INDEX idx_user_asset_licenses_active ON user_asset_licenses (is_active);

CREATE INDEX idx_license_locations_license_id ON license_locations (license_id);

CREATE INDEX idx_license_locations_external_id ON license_locations (internal_id);

CREATE INDEX idx_license_locations_active ON license_locations (is_active);

CREATE INDEX idx_license_locations_state ON license_locations (state_code);

CREATE INDEX idx_license_locations_type ON license_locations(type);

CREATE TRIGGER update_user_asset_licenses_updated_at BEFORE UPDATE ON user_asset_licenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_license_locations_updated_at BEFORE UPDATE ON license_locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE user_asset_licenses ENABLE ROW LEVEL SECURITY;

ALTER TABLE license_locations ENABLE ROW LEVEL SECURITY;

-- User asset licenses - users can only read their own licenses

CREATE POLICY select_own_user_asset_licenses ON user_asset_licenses FOR
SELECT USING (auth.uid () = user_id);

-- License locations - users can only read locations from their own licenses

CREATE POLICY select_license_locations ON public.license_locations FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM user_asset_licenses
            WHERE
                id = license_locations.user_asset_license_id
                AND user_id = auth.uid ()
        )
    );