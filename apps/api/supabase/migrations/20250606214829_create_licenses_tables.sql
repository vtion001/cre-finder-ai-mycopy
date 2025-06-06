CREATE TABLE public.user_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
    location_id TEXT NOT NULL,
    licensed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.user_license_asset_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    license_id UUID NOT NULL REFERENCES public.user_licenses (id) ON DELETE CASCADE,
    asset_type_slug TEXT NOT NULL REFERENCES public.asset_types (slug) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    -- Prevent duplicate asset types within the same license combination
    UNIQUE (license_id, asset_type_slug)
);

-- Performance indexes
CREATE INDEX user_licenses_user_id_idx ON public.user_licenses (user_id);

CREATE INDEX user_licenses_location_id_idx ON public.user_licenses (location_id);

CREATE INDEX user_licenses_licensed_idx ON public.user_licenses (licensed);

CREATE INDEX user_license_asset_types_license_id_idx ON public.user_license_asset_types (license_id);

CREATE INDEX user_license_asset_types_asset_type_slug_idx ON public.user_license_asset_types (asset_type_slug);

CREATE INDEX user_licenses_user_location_idx ON public.user_licenses (user_id, location_id);

CREATE INDEX user_licenses_user_licensed_idx ON public.user_licenses (user_id, licensed);

CREATE INDEX user_licenses_location_licensed_idx ON public.user_licenses (location_id, licensed);

-- Full composite for most specific queries
CREATE INDEX user_licenses_user_location_licensed_idx ON public.user_licenses (
    user_id,
    location_id,
    licensed
);

-- Triggers for updated_at
CREATE TRIGGER user_licenses_updated_at
    BEFORE UPDATE ON public.user_licenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- RLS Policies
ALTER TABLE public.user_licenses ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_license_asset_types ENABLE ROW LEVEL SECURITY;

-- License policies - users can only manage their own licenses
CREATE POLICY select_own_licenses ON public.user_licenses FOR
SELECT USING (auth.uid () = user_id);

-- Optimized view for licensed combinations
CREATE VIEW user_licensed_combinations AS
SELECT
    ul.id as license_id,
    ul.user_id,
    ul.location_id,
    ul.licensed,
    ARRAY_AGG(
        ulat.asset_type_slug
        ORDER BY ulat.asset_type_slug
    ) as asset_type_slugs,
    STRING_AGG(
        ulat.asset_type_slug,
        ','
        ORDER BY ulat.asset_type_slug
    ) as asset_types_key,
    COUNT(ulat.asset_type_slug) as asset_count,
    ul.created_at,
    ul.updated_at
FROM public.user_licenses ul
    LEFT JOIN public.user_license_asset_types ulat ON ul.id = ulat.license_id
GROUP BY
    ul.id,
    ul.user_id,
    ul.location_id,
    ul.licensed,
    ul.created_at,
    ul.updated_at;

-- View specifically for active licenses only
CREATE VIEW user_active_licenses AS
SELECT *
FROM user_licensed_combinations
WHERE
    licensed = true;

-- Helper function to check if a specific combo exists
CREATE OR REPLACE FUNCTION user_has_license_combo(
    p_user_id UUID, 
    p_location_id TEXT, 
    p_asset_types TEXT[]
) RETURNS BOOLEAN AS $$
DECLARE
    combo_key TEXT;
BEGIN
    -- Create sorted comma-separated string from array
    SELECT string_agg(unnest, ',' ORDER BY unnest) 
    INTO combo_key 
    FROM unnest(p_asset_types);
    
    RETURN EXISTS (
        SELECT 1 FROM user_licensed_combinations
        WHERE user_id = p_user_id 
        AND location_id = p_location_id
        AND asset_types_key = combo_key
        AND licensed = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;