import { createClient } from "@v1/supabase/client";
import { createClient as createServerClient } from "@v1/supabase/server";

// VAPI Authentication Utilities
export async function authenticateVAPI(apiKey: string, assistantId: string) {
  try {
    // Validate API key with VAPI
    const response = await fetch('https://api.vapi.ai/assistants', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Invalid API key');
    }
    
    // Store credentials securely
    await storeVAPICredentials({
      apiKey,
      assistantId
    });
    
    return { success: true, message: "VAPI authentication successful" };
  } catch (error) {
    console.error("VAPI authentication failed:", error);
    return { 
      success: false, 
      message: `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

// Function to check if VAPI is authenticated
export async function isVAPIAuthenticated() {
  try {
    const credentials = await getStoredVAPICredentials();
    if (!credentials) return false;
    
    // Verify credentials are still valid
    const response = await fetch('https://api.vapi.ai/assistants', {
      headers: {
        'Authorization': `Bearer ${credentials.apiKey}`
      }
    });
    
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Twilio Authentication Utilities
export async function authenticateTwilio(credentials: {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
}) {
  try {
    // Validate credentials with Twilio API
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${credentials.accountSid}`, {
      headers: {
        'Authorization': `Basic ${btoa(`${credentials.accountSid}:${credentials.authToken}`)}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Invalid Twilio credentials');
    }
    
    // Store credentials securely
    await storeTwilioCredentials(credentials);
    
    return { success: true, message: "Twilio authentication successful" };
  } catch (error) {
    console.error("Twilio authentication failed:", error);
    return { 
      success: false, 
      message: `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

// Function to check if Twilio is authenticated
export async function isTwilioAuthenticated() {
  try {
    const credentials = await getStoredTwilioCredentials();
    if (!credentials) return false;
    
    // Verify credentials are still valid
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${credentials.accountSid}`, {
      headers: {
        'Authorization': `Basic ${btoa(`${credentials.accountSid}:${credentials.authToken}`)}`
      }
    });
    
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Test Data Setup Functions
export async function setupAllTestData() {
  const results = {
    propertyRecords: false,
    integrations: false,
    campaigns: false,
    searchData: false,
    vapiConfig: false,
    twilioConfig: false
  };
  
  try {
    // Setup Property Records
    results.propertyRecords = await setupPropertyRecordsTestData();
    
    // Setup Integrations
    results.integrations = await setupIntegrationsTestData();
    
    // Setup Campaigns
    results.campaigns = await setupCampaignsTestData();
    
    // Setup Search Data
    results.searchData = await setupSearchDataTestData();
    
    // Setup VAPI Test Configuration
    results.vapiConfig = await setupVAPITestConfig();
    
    // Setup Twilio Test Configuration
    results.twilioConfig = await setupTwilioTestConfig();
    
    return { success: true, results };
  } catch (error) {
    console.error("Failed to setup test data:", error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error', results };
  }
}

// VAPI Test Configuration
async function setupVAPITestConfig() {
  try {
    const supabase = createClient();
    
    // Check if VAPI test config exists
    const { data: existingConfig } = await supabase
      .from('vapi_configs')
      .select('*')
      .eq('is_test_config', true)
      .single();
    
    if (existingConfig) return true;
    
    // Create test VAPI configuration
    const { error } = await supabase
      .from('vapi_configs')
      .insert({
        api_key: "test_vapi_key",
        organization: "Test Organization",
        assistant_id: "test_assistant_id",
        phone_number: "+1234567890",
        is_test_config: true,
        name: "Test VAPI Configuration"
      });
    
    return !error;
  } catch (error) {
    console.error("Failed to setup VAPI test config:", error);
    return false;
  }
}

// Twilio Test Configuration
async function setupTwilioTestConfig() {
  try {
    const supabase = createClient();
    
    // Check if Twilio test config exists
    const { data: existingConfig } = await supabase
      .from('twilio_configs')
      .select('*')
      .eq('is_test_config', true)
      .single();
    
    if (existingConfig) return true;
    
    // Create test Twilio configuration
    const { error } = await supabase
      .from('twilio_configs')
      .insert({
        account_sid: "test_account_sid",
        auth_token: "test_auth_token",
        phone_number: "+1234567890",
        is_test_config: true,
        name: "Test Twilio Configuration"
      });
    
    return !error;
  } catch (error) {
    console.error("Failed to setup Twilio test config:", error);
    return false;
  }
}

// Database Connection Test Utility
export async function testDatabaseConnection() {
  try {
    const supabase = createClient();
    
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (error) {
      return {
        success: false,
        message: `Database connection failed: ${error.message}`
      };
    }
    
    // Test each table that's needed for VAPI and Twilio tests
    const tables = [
      'vapi_configs',
      'twilio_configs',
      'properties',
      'campaigns'
    ];
    
    for (const table of tables) {
      try {
        const { error: tableError } = await supabase
          .from(table)
          .select('id')
          .limit(1);
        
        if (tableError) {
          console.error(`Table ${table} is not accessible:`, tableError);
          return {
            success: false,
            message: `Database table ${table} is not accessible`
          };
        }
      } catch (error) {
        console.error(`Error testing table ${table}:`, error);
        return {
          success: false,
          message: `Database table ${table} test failed`
        };
      }
    }
    
    return { success: true, message: "Database connection successful" };
  } catch (error) {
    console.error("Database connection failed:", error);
    return { 
      success: false, 
      message: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

// Test Data Status Checker
export async function checkTestDataStatus() {
  const status = {
    propertyRecords: false,
    integrations: false,
    campaigns: false,
    searchData: false,
    vapiConfig: false,
    twilioConfig: false
  };
  
  try {
    const supabase = createClient();
    
    // Check Property Records
    const { data: propertyRecords } = await supabase
      .from('properties')
      .select('id')
      .eq('is_test_record', true)
      .limit(1);
    status.propertyRecords = (propertyRecords?.length || 0) > 0;
    
    // Check Integrations
    const { data: integrations } = await supabase
      .from('vapi_configs')
      .select('id')
      .limit(1);
    status.integrations = (integrations?.length || 0) > 0;
    
    // Check Campaigns
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('id')
      .eq('is_test_record', true)
      .limit(1);
    status.campaigns = (campaigns?.length || 0) > 0;
    
    // Check Search Data
    const { data: searchData } = await supabase
      .from('properties')
      .select('id')
      .limit(1);
    status.searchData = (searchData?.length || 0) > 0;
    
    // Check VAPI Config
    const { data: vapiConfig } = await supabase
      .from('vapi_configs')
      .select('id')
      .eq('is_test_config', true)
      .limit(1);
    status.vapiConfig = (vapiConfig?.length || 0) > 0;
    
    // Check Twilio Config
    const { data: twilioConfig } = await supabase
      .from('twilio_configs')
      .select('id')
      .eq('is_test_config', true)
      .limit(1);
    status.twilioConfig = (twilioConfig?.length || 0) > 0;
    
    return status;
  } catch (error) {
    console.error("Error checking test data status:", error);
    return status;
  }
}

// Helper functions for storing credentials (in a real app, these would use secure storage)
async function storeVAPICredentials(credentials: { apiKey: string; assistantId: string }) {
  // In a real app, store in secure storage or database
  localStorage.setItem('vapi_credentials', JSON.stringify(credentials));
}

async function getStoredVAPICredentials() {
  try {
    const stored = localStorage.getItem('vapi_credentials');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

async function storeTwilioCredentials(credentials: { accountSid: string; authToken: string; phoneNumber: string }) {
  // In a real app, store in secure storage or database
  localStorage.setItem('twilio_credentials', JSON.stringify(credentials));
}

async function getStoredTwilioCredentials() {
  try {
    const stored = localStorage.getItem('twilio_credentials');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// Placeholder functions for test data setup
async function setupPropertyRecordsTestData() {
  // Implementation would create test property records
  return true;
}

async function setupIntegrationsTestData() {
  // Implementation would create test integration records
  return true;
}

async function setupCampaignsTestData() {
  // Implementation would create test campaign records
  return true;
}

async function setupSearchDataTestData() {
  // Implementation would create test search data
  return true;
}
