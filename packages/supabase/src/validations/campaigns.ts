import { z } from "zod";

// Voice channel settings schema
export const voiceChannelSettingsSchema = z.object({
  enabled: z.boolean(),
  vapi_assistant_id: z.string().uuid().optional(),
  script_template: z.string().min(1, "Script template is required").optional(),
  max_duration: z.number().min(30).max(300).optional(),
  retry_count: z.number().min(0).max(5).default(3),
  timezone: z.string().optional(),
});

// SMS channel settings schema
export const smsChannelSettingsSchema = z.object({
  enabled: z.boolean(),
  message_template: z.string().min(1, "Message template is required").optional(),
  from_number: z.string().optional(),
  retry_count: z.number().min(0).max(5).default(3),
  delivery_time: z.string().optional(),
  timezone: z.string().optional(),
});

// Email channel settings schema
export const emailChannelSettingsSchema = z.object({
  enabled: z.boolean(),
  subject_template: z.string().min(1, "Subject template is required").optional(),
  body_template: z.string().min(1, "Body template is required").optional(),
  from_email: z.string().email("Invalid from email").optional(),
  from_name: z.string().optional(),
  reply_to: z.string().email("Invalid reply-to email").optional(),
  retry_count: z.number().min(0).max(5).default(3),
  delivery_time: z.string().optional(),
  timezone: z.string().optional(),
});

// Campaign channels schema
export const campaignChannelsSchema = z.object({
  voice: voiceChannelSettingsSchema.optional(),
  sms: smsChannelSettingsSchema.optional(),
  email: emailChannelSettingsSchema.optional(),
}).refine((data) => {
  // At least one channel must be enabled
  return Object.values(data).some(channel => channel?.enabled);
}, {
  message: "At least one channel must be enabled",
  path: ["channels"],
});

// Campaign creation schema
export const createCampaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required").max(100),
  description: z.string().max(500).optional(),
  channels: campaignChannelsSchema,
  record_ids: z.array(z.string()).min(1, "At least one record must be selected"),
  template_id: z.string().uuid().optional(),
  scheduled_at: z.date().optional(),
  campaign_type: z.enum(["manual", "scheduled", "automated"]).default("manual"),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  settings: z.record(z.any()).optional(),
});

// Campaign update schema
export const updateCampaignSchema = createCampaignSchema.partial().extend({
  id: z.string().uuid(),
});

// Campaign template schema
export const campaignTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required").max(100),
  description: z.string().max(500).optional(),
  channel: z.enum(["voice", "sms", "email"]),
  content: z.record(z.any()),
  variables: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
});

// Voice template content schema
export const voiceTemplateContentSchema = z.object({
  script: z.string().min(1, "Script is required"),
  variables: z.array(z.string()).default([]),
  tone: z.string().optional(),
  language: z.string().default("en"),
});

// SMS template content schema
export const smsTemplateContentSchema = z.object({
  message: z.string().min(1, "Message is required").max(1600),
  variables: z.array(z.string()).default([]),
  character_limit: z.number().min(1).max(1600).optional(),
});

// Email template content schema
export const emailTemplateContentSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200),
  body: z.string().min(1, "Body is required"),
  variables: z.array(z.string()).default([]),
  html: z.boolean().default(true),
});

// Campaign execution schema
export const campaignExecutionSchema = z.object({
  campaign_id: z.string().uuid(),
  channels: campaignChannelsSchema,
  template_id: z.string().uuid().optional(),
  scheduled_at: z.date().optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  settings: z.record(z.any()).optional(),
});

// Campaign result update schema
export const campaignResultUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "sent", "delivered", "failed", "responded"]),
  sent_at: z.date().optional(),
  delivered_at: z.date().optional(),
  response_data: z.record(z.any()).optional(),
  error_message: z.string().optional(),
  retry_count: z.number().min(0).optional(),
});

// Campaign filter schema
export const campaignFilterSchema = z.object({
  status: z.enum(["pending", "active", "paused", "completed", "cancelled", "failed"]).optional(),
  campaign_type: z.enum(["manual", "scheduled", "automated"]).optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
  channel: z.enum(["voice", "sms", "email"]).optional(),
  date_from: z.date().optional(),
  date_to: z.date().optional(),
  search: z.string().optional(),
});

// Campaign analytics filter schema
export const campaignAnalyticsFilterSchema = z.object({
  campaign_id: z.string().uuid().optional(),
  date_from: z.date().optional(),
  date_to: z.date().optional(),
  channel: z.enum(["voice", "sms", "email"]).optional(),
  status: z.enum(["pending", "sent", "delivered", "failed", "responded"]).optional(),
});
