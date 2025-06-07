-- Create asset_types table with all columns included from the start
CREATE TABLE public.asset_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    use_codes INTEGER[] DEFAULT '{}',
    slug TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE public.asset_types ENABLE ROW LEVEL SECURITY;

-- Create trigger to update the updated_at column
CREATE TRIGGER asset_types_updated_at
BEFORE UPDATE ON public.asset_types
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Create trigger to generate slug from name
CREATE TRIGGER generate_asset_type_slug 
BEFORE INSERT ON public.asset_types 
FOR EACH ROW 
EXECUTE FUNCTION public.generate_slug_from_name();

-- Create policies for asset_types
CREATE POLICY select_asset_types ON public.asset_types FOR
SELECT USING (true);