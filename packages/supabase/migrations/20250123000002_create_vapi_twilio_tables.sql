-- Create VAPI and Twilio configuration tables
-- Migration: 20250123000002_create_vapi_twilio_tables.sql

-- VAPI Configuration Table
CREATE TABLE IF NOT EXISTS public.vapi_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    api_key TEXT NOT NULL,
    organization TEXT NOT NULL,
    assistant_id TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    webhook_url TEXT,
    custom_prompt TEXT,
    name TEXT,
    is_test_config BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Twilio Configuration Table
CREATE TABLE IF NOT EXISTS public.twilio_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    account_sid TEXT NOT NULL,
    auth_token TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    messaging_service_sid TEXT,
    webhook_url TEXT,
    custom_message TEXT,
    name TEXT,
    is_test_config BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SendGrid Configuration Table
CREATE TABLE IF NOT EXISTS public.sendgrid_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    api_key TEXT NOT NULL,
    from_email TEXT NOT NULL,
    from_name TEXT NOT NULL,
    template_id TEXT,
    webhook_url TEXT,
    custom_subject TEXT,
    name TEXT,
    is_test_config BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integration Status Table
CREATE TABLE IF NOT EXISTS public.integration_statuses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    integration_type TEXT NOT NULL CHECK (integration_type IN ('vapi', 'twilio', 'sendgrid')),
    is_configured BOOLEAN DEFAULT false,
    last_tested_at TIMESTAMP WITH TIME ZONE,
    test_status TEXT DEFAULT 'never' CHECK (test_status IN ('success', 'failed', 'never')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, integration_type)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vapi_configs_user_id ON public.vapi_configs(user_id);
CREATE INDEX IF NOT EXISTS idx_twilio_configs_user_id ON public.twilio_configs(user_id);
CREATE INDEX IF NOT EXISTS idx_sendgrid_configs_user_id ON public.sendgrid_configs(user_id);
CREATE INDEX IF NOT EXISTS idx_integration_statuses_user_id ON public.integration_statuses(user_id);

-- Enable RLS
ALTER TABLE public.vapi_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.twilio_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sendgrid_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_statuses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for VAPI configs
CREATE POLICY "Users can view own vapi configs" ON public.vapi_configs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vapi configs" ON public.vapi_configs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vapi configs" ON public.vapi_configs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vapi configs" ON public.vapi_configs
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Twilio configs
CREATE POLICY "Users can view own twilio configs" ON public.twilio_configs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own twilio configs" ON public.twilio_configs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own twilio configs" ON public.twilio_configs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own twilio configs" ON public.twilio_configs
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for SendGrid configs
CREATE POLICY "Users can view own sendgrid configs" ON public.sendgrid_configs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sendgrid configs" ON public.sendgrid_configs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sendgrid configs" ON public.sendgrid_configs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sendgrid configs" ON public.sendgrid_configs
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Integration statuses
CREATE POLICY "Users can view own integration statuses" ON public.integration_statuses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own integration statuses" ON public.integration_statuses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own integration statuses" ON public.integration_statuses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own integration statuses" ON public.integration_statuses
    FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS trg_vapi_configs_updated_at ON public.vapi_configs;
CREATE TRIGGER trg_vapi_configs_updated_at
    BEFORE UPDATE ON public.vapi_configs
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_twilio_configs_updated_at ON public.twilio_configs;
CREATE TRIGGER trg_twilio_configs_updated_at
    BEFORE UPDATE ON public.twilio_configs
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_sendgrid_configs_updated_at ON public.sendgrid_configs;
CREATE TRIGGER trg_sendgrid_configs_updated_at
    BEFORE UPDATE ON public.sendgrid_configs
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_integration_statuses_updated_at ON public.integration_statuses;
CREATE TRIGGER trg_integration_statuses_updated_at
    BEFORE UPDATE ON public.integration_statuses
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
