// Utility to serialize database results for Client Components
export function serializeForClient(data: any): any {
  // Handle null or undefined
  if (data === null || data === undefined) {
    return data;
  }
  
  // Handle dates
  if (data instanceof Date) {
    return data.toISOString();
  }
  
  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => serializeForClient(item));
  }
  
  // Handle objects
  if (typeof data === 'object') {
    // Convert to plain object
    const plainObject: Record<string, any> = {};
    
    for (const key in data) {
      // Skip non-enumerable properties
      if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
      
      // Skip functions
      if (typeof data[key] === 'function') continue;
      
      // Recursively serialize nested objects
      plainObject[key] = serializeForClient(data[key]);
    }
    
    return plainObject;
  }
  
  // Return primitives as-is
  return data;
}

// Specific serialization for VAPI configuration
export function serializeVAPIConfig(config: any) {
  if (!config) return null;
  
  return {
    id: config.id,
    apiKey: config.api_key,
    organization: config.organization,
    assistantId: config.assistant_id,
    phoneNumber: config.phone_number,
    webhookUrl: config.webhook_url,
    customPrompt: config.custom_prompt,
    isActive: config.is_active,
    createdAt: config.created_at,
    updatedAt: config.updated_at,
    isTestConfig: config.is_test_config || false
  };
}

// Specific serialization for Twilio configuration
export function serializeTwilioConfig(config: any) {
  if (!config) return null;
  
  return {
    id: config.id,
    accountSid: config.account_sid,
    authToken: config.auth_token,
    phoneNumber: config.phone_number,
    messagingServiceSid: config.messaging_service_sid,
    webhookUrl: config.webhook_url,
    customMessage: config.custom_message,
    isActive: config.is_active,
    createdAt: config.created_at,
    updatedAt: config.updated_at,
    isTestConfig: config.is_test_config || false
  };
}

// Specific serialization for integration status
export function serializeIntegrationStatus(status: any) {
  if (!status) return null;
  
  return {
    id: status.id,
    integrationType: status.integration_type,
    isConfigured: status.is_configured,
    lastTestedAt: status.last_tested_at,
    testStatus: status.test_status,
    errorMessage: status.error_message,
    createdAt: status.created_at,
    updatedAt: status.updated_at
  };
}

// Generic serialization for any database result
export function serializeDatabaseResult<T>(data: T): T {
  return serializeForClient(data) as T;
}
