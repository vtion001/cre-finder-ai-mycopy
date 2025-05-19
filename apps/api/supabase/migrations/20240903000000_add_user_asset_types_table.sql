-- Create user_asset_types table
CREATE TABLE public.user_asset_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    asset_type_id UUID NOT NULL REFERENCES public.asset_types(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, asset_type_id)
);

-- Create a trigger to update the updated_at column for user_asset_types
CREATE TRIGGER user_asset_types_updated_at
BEFORE UPDATE ON public.user_asset_types
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Enable row level security for user_asset_types
ALTER TABLE public.user_asset_types ENABLE ROW LEVEL SECURITY;

-- Create policies for user_asset_types
CREATE POLICY select_own_asset_types ON public.user_asset_types
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY insert_own_asset_types ON public.user_asset_types
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY update_own_asset_types ON public.user_asset_types
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY delete_own_asset_types ON public.user_asset_types
FOR DELETE USING (auth.uid() = user_id);


