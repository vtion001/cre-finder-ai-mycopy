-- Create subscription_plans table
CREATE TABLE public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    description TEXT,
    features JSONB,
    max_searches INTEGER NOT NULL,
    max_skip_trace INTEGER NOT NULL,
    county_access TEXT NOT NULL,
    asset_type_count INTEGER NOT NULL,
    is_enterprise BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create asset_types table
CREATE TABLE public.asset_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TYPE public.location_type AS ENUM ('city', 'county');

-- Create user_locations table
CREATE TABLE public.user_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    internal_id TEXT NOT NULL,
    title TEXT NOT NULL,
    state_code TEXT NOT NULL,
    type public.location_type NOT NULL,
    display_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, internal_id)
);

-- Add subscription related fields to users table
ALTER TABLE public.users
ADD COLUMN subscription_plan_id UUID REFERENCES public.subscription_plans(id),
ADD COLUMN subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN subscription_start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN subscription_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN selected_asset_type_id UUID REFERENCES public.asset_types(id);

-- Create a trigger to update the updated_at column for subscription_plans
CREATE TRIGGER subscription_plans_updated_at
BEFORE UPDATE ON public.subscription_plans
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Create a trigger to update the updated_at column for asset_types
CREATE TRIGGER asset_types_updated_at
BEFORE UPDATE ON public.asset_types
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Create a trigger to update the updated_at column for user_locations
CREATE TRIGGER user_locations_updated_at
BEFORE UPDATE ON public.user_locations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Enable row level security for all tables
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;

-- Create policies for subscription_plans
CREATE POLICY select_subscription_plans ON public.subscription_plans
FOR SELECT USING (true);

-- Create policies for asset_types
CREATE POLICY select_asset_types ON public.asset_types
FOR SELECT USING (true);

-- Create policies for user_locations
CREATE POLICY select_own_cities ON public.user_locations
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY insert_own_cities ON public.user_locations
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY update_own_cities ON public.user_locations
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY delete_own_cities ON public.user_locations
FOR DELETE USING (auth.uid() = user_id);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, price, description, features, max_searches, max_skip_trace, county_access, asset_type_count, is_enterprise)
VALUES
('Standard', '$499/month', 'Perfect for individual investors and small teams.',
 '["Up to 500 property searches per month", "Skip-trace up to 500 properties", "Single county access", "1 asset type", "Email support", "Data export (CSV,Excel)"]'::jsonb,
 500, 500, 'Single county', 1, false),

('Professional', '$999/month', 'For active investors and mid-sized investment firms.',
 '["Up to 1000 property searches per month", "Skip-trace up to 1000 properties", "Single county access", "1 asset type", "Email support", "Data export (CSV,Excel)"]'::jsonb,
 1000, 1000, 'Single county', 1, false),

('Enterprise', 'Contact Us', 'For large investment firms and institutional investors.',
 '["Multiple county access", "Multiple asset types", "All Professional features", "Dedicated account manager", "Phone & email support", "First access to AI outbound marketing system"]'::jsonb,
 5000, 5000, 'Multiple counties', 5, true);

-- Insert default asset types
INSERT INTO public.asset_types (name, description)
VALUES
('Residential', 'Single-family homes, condos, townhouses, and multi-family properties up to 4 units'),
('Multi-Family', 'Apartment buildings with 5+ units'),
('Office', 'Commercial office buildings and spaces'),
('Retail', 'Retail stores, shopping centers, and malls'),
('Industrial', 'Warehouses, manufacturing facilities, and distribution centers'),
('Land', 'Vacant land and development sites'),
('Hospitality', 'Hotels, motels, and resorts'),
('Storage Unit', 'Self-storage facilities and storage unit complexes'),
('Mixed-Use', 'Properties with multiple uses (e.g., retail on ground floor, residential above)');
