// TODO: Import database types when available
// import type { Database } from "./database";

// export type Campaign = Database["public"]["Tables"]["campaigns"]["Row"];
// export type CampaignInsert = Database["public"]["Tables"]["campaigns"]["Insert"];
// export type CampaignUpdate = Database["public"]["Tables"]["campaigns"]["Update"];

// export type CampaignTemplate = Database["public"]["Tables"]["campaign_templates"]["Row"];
// export type CampaignTemplateInsert = Database["public"]["Tables"]["campaign_templates"]["Insert"];
// export type CampaignTemplateUpdate = Database["public"]["Tables"]["campaign_templates"]["Update"];

// export type CampaignResult = Database["public"]["Tables"]["campaign_results"]["Row"];
// export type CampaignResultInsert = Database["public"]["Tables"]["campaign_results"]["Insert"];
// export type CampaignResultUpdate = Database["public"]["Tables"]["campaign_results"]["Update"];

// Campaign status types
export type CampaignStatus = "pending" | "active" | "paused" | "completed" | "cancelled" | "failed";
export type CampaignType = "manual" | "scheduled" | "automated";
export type CampaignPriority = "low" | "normal" | "high" | "urgent";

// Channel types
export type CampaignChannel = "voice" | "sms" | "email";
export type ChannelStatus = "pending" | "sent" | "delivered" | "failed" | "responded";

// Campaign channel settings
export interface VoiceChannelSettings {
  enabled: boolean;
  vapi_assistant_id?: string;
  script_template?: string;
  max_duration?: number;
  retry_count?: number;
  timezone?: string;
}

export interface SMSChannelSettings {
  enabled: boolean;
  message_template?: string;
  from_number?: string;
  retry_count?: number;
  delivery_time?: string;
  timezone?: string;
}

export interface EmailChannelSettings {
  enabled: boolean;
  subject_template?: string;
  body_template?: string;
  from_email?: string;
  from_name?: string;
  reply_to?: string;
  retry_count?: number;
  delivery_time?: string;
  timezone?: string;
}

export interface CampaignChannels {
  voice?: VoiceChannelSettings;
  sms?: SMSChannelSettings;
  email?: EmailChannelSettings;
}

// Campaign template content
export interface VoiceTemplateContent {
  script: string;
  variables: string[];
  tone?: string;
  language?: string;
}

export interface SMSTemplateContent {
  message: string;
  variables: string[];
  character_limit?: number;
}

export interface EmailTemplateContent {
  subject: string;
  body: string;
  variables: string[];
  html?: boolean;
}

export type TemplateContent = VoiceTemplateContent | SMSTemplateContent | EmailTemplateContent;

// Campaign execution options
export interface CampaignExecutionOptions {
  channels: CampaignChannels;
  template_id?: string;
  scheduled_at?: Date;
  priority?: CampaignPriority;
  settings?: Record<string, any>;
}

// Campaign result tracking
export interface CampaignResultTracking {
  campaign_id: string;
  record_id: string;
  channel: CampaignChannel;
  status: ChannelStatus;
  sent_at?: Date;
  delivered_at?: Date;
  response_data?: Record<string, any>;
  error_message?: string;
  retry_count: number;
}

// Campaign analytics
export interface CampaignAnalytics {
  total_records: number;
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  responded_count: number;
  success_rate: number;
  response_rate: number;
  average_response_time?: number;
}

// Campaign creation form data
export interface CreateCampaignData {
  name: string;
  description?: string;
  channels: CampaignChannels;
  record_ids: string[];
  template_id?: string;
  scheduled_at?: Date;
  campaign_type: CampaignType;
  priority: CampaignPriority;
  settings?: Record<string, any>;
}
