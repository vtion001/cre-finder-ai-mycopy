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
CREATE OR REPLACE VIEW user_licensed_combinations AS
SELECT
    ul.id as license_id,
    ul.user_id,
    ul.location_id,
    ul.licensed,
    ARRAY_AGG(
        ulat.asset_type_slug
        ORDER BY ulat.asset_type_slug
    ) as asset_type_slugs,
    ARRAY_AGG(
        at.name
        ORDER BY ulat.asset_type_slug
    ) as asset_type_names,
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

-- Procedure to insert or update user license with asset types
CREATE OR REPLACE FUNCTION insert_user_license(
    p_user_id UUID,
    p_location_id TEXT,
    p_asset_type_slugs TEXT[],
    p_licensed BOOLEAN DEFAULT true
) RETURNS UUID AS $$
DECLARE
    v_license_id UUID;
    v_asset_slug TEXT;
    v_existing_license_id UUID;
BEGIN
    -- Input validation
    IF p_user_id IS NULL THEN
        RAISE EXCEPTION 'user_id cannot be null';
    END IF;
    
    IF p_location_id IS NULL OR trim(p_location_id) = '' THEN
        RAISE EXCEPTION 'location_id cannot be null or empty';
    END IF;
    
    IF p_asset_type_slugs IS NULL OR array_length(p_asset_type_slugs, 1) IS NULL THEN
        RAISE EXCEPTION 'asset_type_slugs cannot be null or empty';
    END IF;
    
    -- Check if user exists
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = p_user_id) THEN
        RAISE EXCEPTION 'User with id % does not exist', p_user_id;
    END IF;
    
    -- Validate all asset type slugs exist
    FOR v_asset_slug IN SELECT unnest(p_asset_type_slugs)
    LOOP
        IF NOT EXISTS (SELECT 1 FROM public.asset_types WHERE slug = v_asset_slug) THEN
            RAISE EXCEPTION 'Asset type with slug % does not exist', v_asset_slug;
        END IF;
    END LOOP;
    
    -- Check if license already exists for this user-location combination
    SELECT id INTO v_existing_license_id
    FROM public.user_licenses
    WHERE user_id = p_user_id AND location_id = p_location_id;
    
    IF v_existing_license_id IS NOT NULL THEN
        -- Update existing license
        UPDATE public.user_licenses
        SET 
            licensed = p_licensed,
            updated_at = now()
        WHERE id = v_existing_license_id;
        
        -- Remove existing asset types for this license
        DELETE FROM public.user_license_asset_types
        WHERE license_id = v_existing_license_id;
        
        v_license_id := v_existing_license_id;
        
        RAISE NOTICE 'Updated existing license % for user % at location %', 
            v_license_id, p_user_id, p_location_id;
    ELSE
        -- Insert new license
        INSERT INTO public.user_licenses (user_id, location_id, licensed)
        VALUES (p_user_id, p_location_id, p_licensed)
        RETURNING id INTO v_license_id;
        
        RAISE NOTICE 'Created new license % for user % at location %', 
            v_license_id, p_user_id, p_location_id;
    END IF;
    
    -- Insert asset types for the license
    FOR v_asset_slug IN SELECT unnest(p_asset_type_slugs)
    LOOP
        INSERT INTO public.user_license_asset_types (license_id, asset_type_slug)
        VALUES (v_license_id, v_asset_slug);
    END LOOP;
    
    RAISE NOTICE 'Added % asset types to license %', 
        array_length(p_asset_type_slugs, 1), v_license_id;
    
    RETURN v_license_id;
    
EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'Duplicate asset type detected in the provided list';
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION 'Foreign key constraint violation - check user_id and asset_type_slugs';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error inserting user license: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;