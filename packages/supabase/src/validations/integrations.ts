import { z } from "zod";

// VAPI Configuration Schema
export const vapiConfigSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
  assistantId: z.string().min(1, "Assistant ID is required"),
  organization: z.string().optional(),
  phoneNumber: z.string().optional(),
  webhookUrl: z.string().url("Invalid webhook URL").optional().or(z.literal("")),
  customPrompt: z.string().optional(),
});

// Twilio Configuration Schema
export const twilioConfigSchema = z.object({
  accountSid: z.string().min(1, "Account SID is required").startsWith("AC", "Account SID must start with 'AC'"),
  authToken: z.string().min(1, "Auth Token is required"),
  phoneNumber: z.string().min(1, "Phone Number is required"),
  messagingServiceSid: z.string().startsWith("MG", "Messaging Service SID must start with 'MG'").optional(),
  webhookUrl: z.string().url("Invalid webhook URL").optional().or(z.literal("")),
  customMessage: z.string().optional(),
});

// SendGrid Configuration Schema
export const sendGridConfigSchema = z.object({
  apiKey: z.string().min(1, "API Key is required").startsWith("SG.", "SendGrid API key must start with 'SG.'"),
  fromEmail: z.string().email("Invalid from email address"),
  fromName: z.string().optional(),
  replyToEmail: z.string().email("Invalid reply-to email address").optional(),
  templateId: z.string().optional(),
  webhookUrl: z.string().url("Invalid webhook URL").optional(),
});

// Union type for all integration configs
export const integrationConfigSchema = z.discriminatedUnion("provider", [
  z.object({ provider: z.literal("vapi"), config: vapiConfigSchema }),
  z.object({ provider: z.literal("twilio"), config: twilioConfigSchema }),
  z.object({ provider: z.literal("sendgrid"), config: sendGridConfigSchema }),
]);

// Type exports
export type VapiConfig = z.infer<typeof vapiConfigSchema>;
export type TwilioConfig = z.infer<typeof twilioConfigSchema>;
export type SendGridConfig = z.infer<typeof sendGridConfigSchema>;
export type IntegrationConfig = z.infer<typeof integrationConfigSchema>;

// Provider validation
export const providerSchema = z.enum(["vapi", "twilio", "sendgrid"]);
export type Provider = z.infer<typeof providerSchema>;

// Helper function to validate config by provider
export function validateConfigByProvider(provider: Provider, config: unknown) {
  switch (provider) {
    case "vapi":
      return vapiConfigSchema.safeParse(config);
    case "twilio":
      return twilioConfigSchema.safeParse(config);
    case "sendgrid":
      return sendGridConfigSchema.safeParse(config);
    default:
      return { success: false as const, error: { message: "Unknown provider" } };
  }
}
