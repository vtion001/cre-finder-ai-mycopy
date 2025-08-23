import type { Client } from "../types";
import { validateConfigByProvider, type Provider } from "../validations/integrations";

export async function getIntegrationConfigQuery(
  supabase: Client,
  userId: string,
  provider: string,
) {
  const { data, error } = await supabase
    .from("integration_configs")
    .select("config, created_at, updated_at")
    .eq("user_id", userId)
    .eq("provider", provider)
    .single();

  return { data: data?.config ?? null, error, metadata: data ? { created_at: data.created_at, updated_at: data.updated_at } : null };
}

export async function getAllIntegrationConfigsQuery(
  supabase: Client,
  userId: string,
) {
  const { data, error } = await supabase
    .from("integration_configs")
    .select("provider, config, created_at, updated_at")
    .eq("user_id", userId)
    .order("provider");

  return { data: data ?? [], error };
}

export async function upsertIntegrationConfigQuery(
  supabase: Client,
  userId: string,
  provider: Provider,
  config: Record<string, unknown>,
) {
  // Validate config before saving
  const validation = validateConfigByProvider(provider, config);
  if (!validation.success) {
    return { 
      data: null, 
      error: { 
        message: "Validation failed", 
        details: validation.error 
      } 
    };
  }

  // At this point validation.success is true, so validation.data exists
  const validatedConfig = 'data' in validation ? validation.data : null;
  if (!validatedConfig) {
    return { 
      data: null, 
      error: { 
        message: "Validation failed", 
        details: "No data in validation result" 
      } 
    };
  }

  const { data, error } = await supabase
    .from("integration_configs")
    .upsert(
      { 
        user_id: userId, 
        provider, 
        config: validatedConfig as any 
      }, 
      { onConflict: "user_id,provider" }
    )
    .select("config, created_at, updated_at")
    .single();

  return { 
    data: data?.config ?? null, 
    error,
    metadata: data ? { created_at: data.created_at, updated_at: data.updated_at } : null
  };
}

export async function deleteIntegrationConfigQuery(
  supabase: Client,
  userId: string,
  provider: string,
) {
  const { error } = await supabase
    .from("integration_configs")
    .delete()
    .eq("user_id", userId)
    .eq("provider", provider);

  return { success: !error, error };
}

export async function testIntegrationConfigQuery(
  supabase: Client,
  userId: string,
  provider: Provider,
) {
  // Get the configuration
  const { data: config, error } = await getIntegrationConfigQuery(supabase, userId, provider);
  
  if (error || !config) {
    return { success: false, error: error || { message: "No configuration found" } };
  }

  // Validate the configuration
  const validation = validateConfigByProvider(provider, config);
  if (!validation.success) {
    return { 
      success: false, 
      error: { 
        message: "Configuration validation failed", 
        details: validation.error 
      } 
    };
  }

  // TODO: Implement actual API testing for each provider
  // For now, just return success if validation passes
  return { 
    success: true, 
    message: `${provider} configuration is valid`,
    config: validation.data
  };
}


