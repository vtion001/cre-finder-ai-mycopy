-- Create asset_types table
CREATE TABLE public.asset_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create a trigger to update the updated_at column for asset_types
CREATE TRIGGER asset_types_updated_at
BEFORE UPDATE ON public.asset_types
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Enable row level security for all tables

ALTER TABLE public.asset_types ENABLE ROW LEVEL SECURITY;

-- Create policies for asset_types
CREATE POLICY select_asset_types ON public.asset_types FOR
SELECT USING (true);

-- Insert default asset types
INSERT INTO
    public.asset_types (name, description)
VALUES (
        'Residential',
        'Single-family homes, condos, townhouses, and multi-family properties up to 4 units'
    ),
    (
        'Multi-Family',
        'Apartment buildings with 5+ units'
    ),
    (
        'Office',
        'Commercial office buildings and spaces'
    ),
    (
        'Retail',
        'Retail stores, shopping centers, and malls'
    ),
    (
        'Industrial',
        'Warehouses, manufacturing facilities, and distribution centers'
    ),
    (
        'Land',
        'Vacant land and development sites'
    ),
    (
        'Hospitality',
        'Hotels, motels, and resorts'
    ),
    (
        'Storage Unit',
        'Self-storage facilities and storage unit complexes'
    ),
    (
        'Mixed-Use',
        'Properties with multiple uses (e.g., retail on ground floor, residential above)'
    );