// Integration configuration types for the database schema

export interface VapiConfig {
  id: string;
  user_id: string;
  api_key: string;
  organization: string;
  assistant_id: string;
  phone_number: string;
  webhook_url?: string | null;
  custom_prompt?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TwilioConfig {
  id: string;
  user_id: string;
  account_sid: string;
  auth_token: string;
  phone_number: string;
  messaging_service_sid?: string | null;
  webhook_url?: string | null;
  custom_message?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SendGridConfig {
  id: string;
  user_id: string;
  api_key: string;
  from_email: string;
  from_name: string;
  template_id?: string | null;
  webhook_url?: string | null;
  custom_subject?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IntegrationStatus {
  id: string;
  user_id: string;
  integration_type: 'vapi' | 'twilio' | 'sendgrid';
  is_configured: boolean;
  last_tested_at?: string | null;
  test_status: 'success' | 'failed' | 'never';
  error_message?: string | null;
  created_at: string;
  updated_at: string;
}

// Form data types (without sensitive fields for frontend)
export interface VapiConfigFormData {
  apiKey: string;
  organization?: string;
  assistantId: string;
  phoneNumber?: string;
  webhookUrl?: string;
  customPrompt?: string;
}

export interface TwilioConfigFormData {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
  messagingServiceSid?: string;
  webhookUrl?: string;
  customMessage?: string;
}

export interface SendGridConfigFormData {
  apiKey: string;
  fromEmail: string;
  fromName?: string;
  templateId?: string;
  webhookUrl?: string;
  customSubject?: string;
}

// API response types
export interface IntegrationConfigResponse {
  success: boolean;
  message: string;
  configId?: string;
  config?: VapiConfig | TwilioConfig | SendGridConfig;
  error?: string;
  details?: any;
}

export interface IntegrationStatusResponse {
  success: boolean;
  statuses: IntegrationStatus[];
  error?: string;
}

// Integration summary for UI display
export interface IntegrationSummary {
  type: 'vapi' | 'twilio' | 'sendgrid';
  is_configured: boolean;
  test_status: 'success' | 'failed' | 'never';
  last_tested_at?: string | null;
  error_message?: string | null;
}

// Database table names
export const INTEGRATION_TABLES = {
  VAPI_CONFIGS: 'vapi_configs',
  TWILIO_CONFIGS: 'twilio_configs',
  SENDGRID_CONFIGS: 'sendgrid_configs',
  INTEGRATION_STATUS: 'integration_status',
} as const;

// Integration types enum
export const INTEGRATION_TYPES = {
  VAPI: 'vapi',
  TWILIO: 'twilio',
  SENDGRID: 'sendgrid',
} as const;

export type IntegrationType = typeof INTEGRATION_TYPES[keyof typeof INTEGRATION_TYPES];
