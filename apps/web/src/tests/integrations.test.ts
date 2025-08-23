import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createIntegrationManager } from '@v1/supabase/lib/integrations';

// Mock Supabase client for testing
const mockSupabase = {
  from: jest.fn(),
  auth: {
    getUser: jest.fn(),
  },
};

describe('Integrations System', () => {
  let integrationManager: ReturnType<typeof createIntegrationManager>;

  beforeEach(() => {
    integrationManager = createIntegrationManager('test-user-123');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('VAPI Integration', () => {
    it('should save VAPI configuration', async () => {
      const config = {
        apiKey: 'test_api_key',
        organization: 'test_org',
        assistantId: 'asst_test123',
        phoneNumber: '+1234567890',
        webhookUrl: 'https://webhook.example.com',
        customPrompt: 'Test prompt',
      };

      // Mock successful save
      mockSupabase.from.mockReturnValue({
        upsert: jest.fn().mockResolvedValue({ data: { id: 'vapi-config-123' }, error: null }),
      });

      const result = await integrationManager.saveVapiConfig(config);
      expect(result.success).toBe(true);
    });

    it('should retrieve VAPI configuration', async () => {
      const mockConfig = {
        id: 'vapi-config-123',
        api_key: 'test_api_key',
        organization: 'test_org',
        assistant_id: 'asst_test123',
        phone_number: '+1234567890',
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockConfig, error: null }),
          }),
        }),
      });

      const config = await integrationManager.getVapiConfig();
      expect(config).toEqual(mockConfig);
    });
  });

  describe('Twilio Integration', () => {
    it('should save Twilio configuration', async () => {
      const config = {
        accountSid: 'ACtest123',
        authToken: 'auth_token_test',
        phoneNumber: '+1234567890',
        messagingServiceSid: 'MGtest123',
        webhookUrl: 'https://webhook.example.com',
        customMessage: 'Test message',
      };

      mockSupabase.from.mockReturnValue({
        upsert: jest.fn().mockResolvedValue({ data: { id: 'twilio-config-123' }, error: null }),
      });

      const result = await integrationManager.saveTwilioConfig(config);
      expect(result.success).toBe(true);
    });
  });

  describe('SendGrid Integration', () => {
    it('should save SendGrid configuration', async () => {
      const config = {
        apiKey: 'SGtest123',
        fromEmail: 'test@example.com',
        fromName: 'Test Company',
        templateId: 'd-template123',
        webhookUrl: 'https://webhook.example.com',
        customSubject: 'Test Subject',
      };

      mockSupabase.from.mockReturnValue({
        upsert: jest.fn().mockResolvedValue({ data: { id: 'sendgrid-config-123' }, error: null }),
      });

      const result = await integrationManager.saveSendGridConfig(config);
      expect(result.success).toBe(true);
    });
  });

  describe('Integration Status', () => {
    it('should get integration statuses', async () => {
      const mockStatuses = [
        { integration_type: 'vapi', is_active: true, status_message: 'Active' },
        { integration_type: 'twilio', is_active: true, status_message: 'Active' },
        { integration_type: 'sendgrid', is_active: false, status_message: 'Inactive' },
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: mockStatuses, error: null }),
        }),
      });

      const statuses = await integrationManager.getIntegrationStatuses();
      expect(statuses).toHaveLength(3);
      expect(statuses[0].integration_type).toBe('vapi');
    });
  });
});
