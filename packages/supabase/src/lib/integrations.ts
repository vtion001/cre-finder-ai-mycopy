import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type {
  VapiConfig,
  TwilioConfig,
  SendGridConfig,
  IntegrationStatus,
  VapiConfigFormData,
  TwilioConfigFormData,
  SendGridConfigFormData,
  IntegrationType,
  INTEGRATION_TABLES,
} from '../types/integrations';

// Integration configuration management class
export class IntegrationManager {
  private userId: string;
  private supabase: SupabaseClient;

  constructor(userId: string, supabaseClient: SupabaseClient) {
    this.userId = userId;
    this.supabase = supabaseClient;
  }

  // VAPI Configuration Methods
  async getVapiConfig(): Promise<VapiConfig | null> {
    try {
      const { data, error } = await this.supabase
        .from('vapi_configs')
        .select('*')
        .eq('user_id', this.userId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching VAPI config:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getVapiConfig:', error);
      return null;
    }
  }

  async saveVapiConfig(config: VapiConfigFormData): Promise<{ success: boolean; configId?: string; error?: string }> {
    try {
      console.log('=== IntegrationManager.saveVapiConfig Debug ===');
      console.log('1. Input config:', { ...config, apiKey: config.apiKey ? '***' : 'undefined' });
      
      // Map camelCase to snake_case for database
      const dbConfig = {
        api_key: config.apiKey,
        organization: config.organization,
        assistant_id: config.assistantId,
        phone_number: config.phoneNumber,
        webhook_url: config.webhookUrl || null,
        custom_prompt: config.customPrompt || null,
      };
      
      console.log('2. Mapped dbConfig:', { ...dbConfig, api_key: dbConfig.api_key ? '***' : 'undefined' });
      console.log('3. User ID:', this.userId);

      // Use UPSERT to handle both create and update scenarios
      console.log('4. About to upsert to database with data:', {
        user_id: this.userId,
        ...dbConfig,
        updated_at: new Date().toISOString(),
        api_key: '***' // Mask for security
      });
      
      const { data, error } = await this.supabase
        .from('vapi_configs')
        .upsert(
          {
            user_id: this.userId,
            ...dbConfig,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id',
            ignoreDuplicates: false
          }
        )
        .select()
        .single();
      
      console.log('5. Database operation result:', { success: !error, data: data ? 'Data returned' : 'No data', error: error?.message });

      if (error) {
        console.error('Error upserting VAPI config:', error);
        return { success: false, error: error.message };
      }

      // Update integration status
      await this.updateIntegrationStatus('vapi', true);
      
      return { success: true, configId: data.id };
    } catch (error) {
      console.error('Error in saveVapiConfig:', error);
      return { success: false, error: 'Failed to save VAPI configuration' };
    }
  }

  // Twilio Configuration Methods
  async getTwilioConfig(): Promise<TwilioConfig | null> {
    try {
      const { data, error } = await this.supabase
        .from('twilio_configs')
        .select('*')
        .eq('user_id', this.userId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching Twilio config:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getTwilioConfig:', error);
      return null;
    }
  }

  async saveTwilioConfig(config: TwilioConfigFormData): Promise<{ success: boolean; configId?: string; error?: string }> {
    try {
      // Map camelCase to snake_case for database
      const dbConfig = {
        account_sid: config.accountSid,
        auth_token: config.authToken,
        phone_number: config.phoneNumber,
        messaging_service_sid: config.messagingServiceSid || null,
        webhook_url: config.webhookUrl || null,
        custom_message: config.customMessage || null,
      };

      // Use UPSERT pattern with admin client to bypass RLS
      const { data, error } = await this.supabase
        .from('twilio_configs')
        .upsert(
          { 
            user_id: this.userId, 
            ...dbConfig, 
            updated_at: new Date().toISOString() 
          },
          { 
            onConflict: 'user_id', 
            ignoreDuplicates: false 
          }
        )
        .select()
        .single();

      if (error) {
        console.error('Error upserting Twilio config:', error);
        return { success: false, error: error.message };
      }

      // Update integration status
      await this.updateIntegrationStatus('twilio', true);
      
      return { success: true, configId: data.id };
    } catch (error) {
      console.error('Error in saveTwilioConfig:', error);
      return { success: false, error: 'Failed to save Twilio configuration' };
    }
  }

  // SendGrid Configuration Methods
  async getSendGridConfig(): Promise<SendGridConfig | null> {
    try {
      const { data, error } = await this.supabase
        .from('sendgrid_configs')
        .select('*')
        .eq('user_id', this.userId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching SendGrid config:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getSendGridConfig:', error);
      return null;
    }
  }

  async saveSendGridConfig(config: SendGridConfigFormData): Promise<{ success: boolean; configId?: string; error?: string }> {
    try {
      // Map camelCase to snake_case for database
      const dbConfig = {
        api_key: config.apiKey,
        from_email: config.fromEmail,
        from_name: config.fromName,
        template_id: config.templateId || null,
        webhook_url: config.webhookUrl || null,
        custom_subject: config.customSubject || null,
      };

      // Check if config already exists
      const existingConfig = await this.getSendGridConfig();

      if (existingConfig) {
        // Update existing config
        const { data, error } = await this.supabase
          .from('sendgrid_configs')
          .update({
            ...dbConfig,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', this.userId)
          .select()
          .single();

        if (error) {
          console.error('Error updating SendGrid config:', error);
          return { success: false, error: error.message };
        }

        // Update integration status
        await this.updateIntegrationStatus('sendgrid', true);
        
        return { success: true, configId: data.id };
      } else {
        // Create new config
        const { data, error } = await this.supabase
          .from('sendgrid_configs')
          .insert({
            user_id: this.userId,
            ...dbConfig,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating SendGrid config:', error);
          return { success: false, error: error.message };
        }

        // Create integration status
        await this.updateIntegrationStatus('sendgrid', true);
        
        return { success: true, configId: data.id };
      }
    } catch (error) {
      console.error('Error in saveSendGridConfig:', error);
      return { success: false, error: 'Failed to save SendGrid configuration' };
    }
  }

  // Integration Status Methods
  async getIntegrationStatuses(): Promise<IntegrationStatus[]> {
    try {
      console.log('Getting integration statuses for user:', this.userId);
      
      // First ensure all integration types have status entries
      await this.ensureStatusEntriesExist();
      
      const { data, error } = await this.supabase
        .from('integration_status')
        .select('*')
        .eq('user_id', this.userId);

      if (error) {
        console.error('Error fetching integration statuses:', error);
        return [];
      }

      console.log('Fetched integration statuses:', data);
      return data || [];
    } catch (error) {
      console.error('Error in getIntegrationStatuses:', error);
      return [];
    }
  }

  private async ensureStatusEntriesExist(): Promise<void> {
    try {
      const integrationTypes: IntegrationType[] = ['vapi', 'twilio', 'sendgrid'];
      
      for (const type of integrationTypes) {
        await this.supabase
          .from('integration_status')
          .upsert({
            user_id: this.userId,
            integration_type: type,
            is_configured: false,
            test_status: 'never',
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,integration_type',
            ignoreDuplicates: true
          });
      }
    } catch (error) {
      console.error('Error ensuring status entries exist:', error);
    }
  }

  async updateIntegrationStatus(type: IntegrationType, isConfigured: boolean, testStatus: 'success' | 'failed' | 'never' = 'never'): Promise<void> {
    try {
      console.log(`=== Updating Integration Status ===`);
      console.log(`Type: ${type}`);
      console.log(`User ID: ${this.userId}`);
      console.log(`Is Configured: ${isConfigured}`);
      console.log(`Test Status: ${testStatus}`);
      
      const { data, error } = await this.supabase
        .from('integration_status')
        .upsert({
          user_id: this.userId,
          integration_type: type,
          is_configured: isConfigured,
          test_status: testStatus,
          last_tested_at: testStatus !== 'never' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .select();

      if (error) {
        console.error('Error updating integration status:', error);
      } else {
        console.log(`✅ Integration status updated successfully:`, data);
      }
    } catch (error) {
      console.error('Error in updateIntegrationStatus:', error);
    }
  }

  async testIntegration(type: IntegrationType, success: boolean, errorMessage?: string): Promise<void> {
    try {
      const testStatus: 'success' | 'failed' = success ? 'success' : 'failed';
      
      const { error } = await this.supabase
        .from('integration_status')
        .upsert({
          user_id: this.userId,
          integration_type: type,
          is_configured: true,
          test_status: testStatus,
          last_tested_at: new Date().toISOString(),
          error_message: errorMessage || null,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error updating integration test status:', error);
      }
    } catch (error) {
      console.error('Error in testIntegration:', error);
    }
  }

  // Utility Methods
  async getAllConfigurations() {
    try {
      const [vapiConfig, twilioConfig, sendGridConfig, statuses] = await Promise.all([
        this.getVapiConfig(),
        this.getTwilioConfig(),
        this.getSendGridConfig(),
        this.getIntegrationStatuses(),
      ]);

      return {
        vapi: vapiConfig,
        twilio: twilioConfig,
        sendgrid: sendGridConfig,
        statuses,
      };
    } catch (error) {
      console.error('Error fetching all configurations:', error);
      return {
        vapi: null,
        twilio: null,
        sendgrid: null,
        statuses: [],
      };
    }
  }

  async deleteConfiguration(type: IntegrationType): Promise<{ success: boolean; error?: string }> {
    try {
      let tableName: string;
      
      switch (type) {
        case 'vapi':
          tableName = 'vapi_configs';
          break;
        case 'twilio':
          tableName = 'twilio_configs';
          break;
        case 'sendgrid':
          tableName = 'sendgrid_configs';
          break;
        default:
          return { success: false, error: 'Invalid integration type' };
      }

      const { error } = await this.supabase
        .from(tableName)
        .delete()
        .eq('user_id', this.userId);

      if (error) {
        console.error(`Error deleting ${type} configuration:`, error);
        return { success: false, error: error.message };
      }

      // Update integration status
      await this.updateIntegrationStatus(type, false);

      return { success: true };
    } catch (error) {
      console.error(`Error in deleteConfiguration for ${type}:`, error);
      return { success: false, error: 'Failed to delete configuration' };
    }
  }
}

// Factory function to create IntegrationManager instance
export function createIntegrationManager(userId: string, supabaseClient: SupabaseClient): IntegrationManager {
  return new IntegrationManager(userId, supabaseClient);
}
