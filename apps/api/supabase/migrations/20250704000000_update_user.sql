-- Create enum type for user roles
CREATE TYPE user_role AS ENUM ('investor', 'wholesaler', 'broker', 'admin');

-- Add CRM ID column for external CRM integration (Loops for now)
ALTER TABLE public.users ADD COLUMN crm_id TEXT;

-- Change the column type to use the enum with default fallback
ALTER TABLE public.users
ALTER COLUMN role TYPE user_role USING COALESCE(
    role::user_role,
    'investor'::user_role
);

-- Set a default value for the role column
ALTER TABLE public.users ALTER COLUMN role SET DEFAULT 'investor';

-- Add a constraint to ensure role is not null
ALTER TABLE public.users ALTER COLUMN role SET NOT NULL;

-- Create index on crm_id for faster lookups
CREATE INDEX idx_users_crm_id ON public.users (crm_id)
WHERE
    crm_id IS NOT NULL;