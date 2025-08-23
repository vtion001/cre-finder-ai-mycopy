-- Create integration configuration tables
-- Migration: 20250123000001_create_integration_tables.sql

-- VAPI Configuration Table
CREATE TABLE IF NOT EXISTS vapi_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    api_key TEXT NOT NULL,
    assistant_id TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    organization TEXT,
    webhook_url TEXT,
    custom_prompt TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Twilio Configuration Table
CREATE TABLE IF NOT EXISTS twilio_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_sid TEXT NOT NULL,
    auth_token TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    messaging_service_sid TEXT,
    webhook_url TEXT,
    custom_message TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SendGrid Configuration Table
CREATE TABLE IF NOT EXISTS sendgrid_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    api_key TEXT NOT NULL,
    from_email TEXT NOT NULL,
    from_name TEXT NOT NULL,
    webhook_url TEXT,
    custom_template TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default VAPI configuration
INSERT INTO vapi_configs (
    api_key,
    assistant_id,
    phone_number,
    organization,
    webhook_url,
    custom_prompt,
    is_active
) VALUES (
    'a4db3265-19ad-4bfd-845d-9cfbc03ec200',
    'ed68dbc7-19bd-4bab-852a-17fa11e9aa97',
    '+18643875469',
    'CRE Finder AI',
    'https://webhook.example.com/vapi',
    'You are a helpful real estate assistant for CRE Finder AI. Help qualify leads and provide property information.',
    true
) ON CONFLICT DO NOTHING;

-- Insert default Twilio configuration
INSERT INTO twilio_configs (
    account_sid,
    auth_token,
    phone_number,
    messaging_service_sid,
    webhook_url,
    custom_message,
    is_active
) VALUES (
    'AC3b1d6c487a62adb87700610e597e76db',
    'b5f3c1e4d56281fb4de1f0c9480dd68e',
    '+19787081782',
    '',
    'https://webhook.example.com/twilio',
    'Thank you for your interest in our properties. A CRE Finder AI representative will contact you soon.',
    true
) ON CONFLICT DO NOTHING;

-- Create RLS policies
ALTER TABLE vapi_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE twilio_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sendgrid_configs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all configs
CREATE POLICY "Allow authenticated users to read configs" ON vapi_configs
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read configs" ON twilio_configs
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read configs" ON sendgrid_configs
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert/update configs
CREATE POLICY "Allow authenticated users to insert configs" ON vapi_configs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update configs" ON vapi_configs
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert configs" ON twilio_configs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update configs" ON twilio_configs
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert configs" ON sendgrid_configs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update configs" ON sendgrid_configs
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vapi_configs_is_active ON vapi_configs(is_active);
CREATE INDEX IF NOT EXISTS idx_twilio_configs_is_active ON twilio_configs(is_active);
CREATE INDEX IF NOT EXISTS idx_sendgrid_configs_is_active ON sendgrid_configs(is_active);
