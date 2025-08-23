-- Create integrations schema and tables
-- This migration creates the necessary tables for storing user integration configurations

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create VAPI configurations table
CREATE TABLE IF NOT EXISTS public.vapi_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    api_key TEXT NOT NULL,
    organization TEXT NOT NULL,
    assistant_id TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    webhook_url TEXT,
    custom_prompt TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one config per user
    UNIQUE(user_id)
);

-- Create Twilio configurations table
CREATE TABLE IF NOT EXISTS public.twilio_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    account_sid TEXT NOT NULL,
    auth_token TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    messaging_service_sid TEXT,
    webhook_url TEXT,
    custom_message TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one config per user
    UNIQUE(user_id)
);

-- Create SendGrid configurations table
CREATE TABLE IF NOT EXISTS public.sendgrid_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    api_key TEXT NOT NULL,
    from_email TEXT NOT NULL,
    from_name TEXT NOT NULL,
    template_id TEXT,
    webhook_url TEXT,
    custom_subject TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one config per user
    UNIQUE(user_id)
);

-- Create integration status table for tracking configuration and testing status
CREATE TABLE IF NOT EXISTS public.integration_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    integration_type TEXT NOT NULL CHECK (integration_type IN ('vapi', 'twilio', 'sendgrid')),
    is_configured BOOLEAN DEFAULT false,
    last_tested_at TIMESTAMP WITH TIME ZONE,
    test_status TEXT CHECK (test_status IN ('success', 'failed', 'never')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one status record per user per integration
    UNIQUE(user_id, integration_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vapi_configs_user_id ON public.vapi_configs(user_id);
CREATE INDEX IF NOT EXISTS idx_twilio_configs_user_id ON public.twilio_configs(user_id);
CREATE INDEX IF NOT EXISTS idx_sendgrid_configs_user_id ON public.sendgrid_configs(user_id);
CREATE INDEX IF NOT EXISTS idx_integration_status_user_id ON public.integration_status(user_id);
CREATE INDEX IF NOT EXISTS idx_integration_status_type ON public.integration_status(integration_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_vapi_configs_updated_at 
    BEFORE UPDATE ON public.vapi_configs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_twilio_configs_updated_at 
    BEFORE UPDATE ON public.twilio_configs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sendgrid_configs_updated_at 
    BEFORE UPDATE ON public.sendgrid_configs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integration_status_updated_at 
    BEFORE UPDATE ON public.integration_status 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.vapi_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.twilio_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sendgrid_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_status ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vapi_configs
CREATE POLICY "Users can view their own VAPI configs" ON public.vapi_configs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own VAPI configs" ON public.vapi_configs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own VAPI configs" ON public.vapi_configs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own VAPI configs" ON public.vapi_configs
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for twilio_configs
CREATE POLICY "Users can view their own Twilio configs" ON public.twilio_configs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own Twilio configs" ON public.twilio_configs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Twilio configs" ON public.twilio_configs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own Twilio configs" ON public.twilio_configs
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for sendgrid_configs
CREATE POLICY "Users can view their own SendGrid configs" ON public.sendgrid_configs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own SendGrid configs" ON public.sendgrid_configs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SendGrid configs" ON public.sendgrid_configs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own SendGrid configs" ON public.sendgrid_configs
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for integration_status
CREATE POLICY "Users can view their own integration status" ON public.integration_status
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own integration status" ON public.integration_status
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own integration status" ON public.integration_status
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own integration status" ON public.integration_status
    FOR DELETE USING (auth.uid() = user_id);

-- Insert initial integration status records for existing users (optional)
-- This can be run manually if needed for existing users
