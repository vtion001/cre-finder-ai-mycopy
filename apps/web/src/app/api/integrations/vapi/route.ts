import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@v1/supabase/server";
import { createIntegrationManager } from "@v1/supabase/lib/integrations";
import { vapiConfigSchema } from "@v1/supabase/validations/integrations";

// Helper function to get authenticated user
async function getAuthenticatedUser() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.log('Auth failed - no valid session found');
      return null;
    }
    
    console.log('Authenticated user found:', user.id);
    return user;
  } catch (error) {
    console.log('Auth error:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('=== VAPI GET Debug ===');
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    // Get authenticated user
    const user = await getAuthenticatedUser();
    if (!user) {
      console.log('No authenticated user found - returning 401');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    console.log('Authenticated user:', user ? `ID: ${user.id}` : 'None');
    const userId = user.id;
    
    // Create authenticated Supabase client
    const supabase = createClient();
    
    // Create integration manager and get configuration
    const integrationManager = createIntegrationManager(userId, supabase);
    console.log('Integration manager created for user:', userId);
    
    const config = await integrationManager.getVapiConfig();
    console.log('Retrieved config via integration manager:', config ? 'Found' : 'Not found');

    if (!config) {
      console.log('No config found, returning empty state');
      return NextResponse.json(
        { 
          isConfigured: false,
          message: "No VAPI configuration found"
        },
        { status: 200 }
      );
    }

    // Return configuration with sensitive data masked
    const safeConfig = {
      id: config.id,
      apiKey: config.api_key.substring(0, 8) + "...", // Mask for security
      assistantId: config.assistant_id,
      organization: config.organization || "",
      phoneNumber: config.phone_number || "",
      webhookUrl: config.webhook_url || "",
      customPrompt: config.custom_prompt || "",
      isConfigured: true,
      createdAt: config.created_at,
      updatedAt: config.updated_at,
    };

    console.log('Returning safe config via integration manager');
    return NextResponse.json(safeConfig, { status: 200 });

  } catch (error) {
    console.error("Error retrieving VAPI configuration:", error);
    
    if (error instanceof Error && error.message === "Authentication required") {
      console.log('Authentication failed - returning 401');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== VAPI POST Debug ===');
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    // Get authenticated user
    const user = await getAuthenticatedUser();
    if (!user) {
      console.log('No authenticated user found - returning 401');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    console.log('Authenticated user:', user ? `ID: ${user.id}` : 'None');
    
    const body = await request.json();
    console.log('=== VAPI API Route Debug ===');
    console.log('1. Raw request body received:', body);
    console.log('2. Request body keys:', Object.keys(body));
    console.log('3. Assistant ID present:', !!body.assistantId);

    // Derive required fields for minimal setup
    const userId = user.id;
    console.log('Using user ID:', userId);
    const supabase = createClient();

    // Provided public key
    const providedApiKey = 'a4db3265-19ad-4bfd-845d-9cfbc03ec200';

    // Derive organization (string). Prefer users.organization if present, else fallback to userId
    let organization = '' as string;
    try {
      const { data: userRow } = await supabase
        .from('users')
        .select('organization')
        .eq('id', userId)
        .single();
      organization = (userRow as any)?.organization || userId;
    } catch {
      organization = userId;
    }

    // Derive phone number from Twilio config for this user
    let phoneNumber = '' as string;
    try {
      const { data: twilio } = await supabase
        .from('twilio_configs')
        .select('phone_number')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();
      phoneNumber = (twilio as any)?.phone_number || '';
    } catch {
      phoneNumber = '';
    }

    if (!body.assistantId) {
      return NextResponse.json(
        { error: 'Assistant ID is required' },
        { status: 400 }
      );
    }

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Twilio phone number not found. Please configure Twilio first.' },
        { status: 400 }
      );
    }

    // Build full config for persistence using existing validation & manager
    const configToSave = {
      apiKey: providedApiKey,
      assistantId: String(body.assistantId),
      organization,
      phoneNumber,
      webhookUrl: body.webhookUrl || '',
      customPrompt: body.customPrompt || '',
    };

    // Validate with existing schema to keep behavior consistent
    const validation = vapiConfigSchema.safeParse(configToSave);
    if (!validation.success) {
      console.log('Validation failed:', validation.error.errors);
      return NextResponse.json(
        { error: "Invalid configuration data", details: validation.error.errors },
        { status: 400 }
      );
    }

    const integrationManager = createIntegrationManager(userId, supabase);
    console.log('Integration manager created for user:', userId);
    const result = await integrationManager.saveVapiConfig(validation.data);
    console.log('Save result:', result);

    if (!result.success) {
      console.log('Save failed:', result.error);
      return NextResponse.json(
        { error: result.error || "Failed to save configuration" },
        { status: 500 }
      );
    }

    console.log('Save successful, config ID:', result.configId);
    return NextResponse.json(
      { 
        success: true, 
        message: "VAPI configuration saved successfully",
        configId: result.configId
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error saving VAPI configuration:", error);
    
    if (error instanceof Error && error.message === "Authentication required") {
      console.log('Authentication failed - returning 401');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser();
    if (!user) {
      console.log('No authenticated user found - returning 401');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate request body
    const validation = vapiConfigSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid configuration data", details: validation.error.errors },
        { status: 400 }
      );
    }

    const config = validation.data;
    const userId = user.id;
    
    // Create authenticated Supabase client
    const supabase = createClient();
    
    // Create integration manager and update configuration
    const integrationManager = createIntegrationManager(userId, supabase);
    const result = await integrationManager.saveVapiConfig(config);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to update configuration" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "VAPI configuration updated successfully",
        configId: result.configId
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating VAPI configuration:", error);
    
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser();
    if (!user) {
      console.log('No authenticated user found - returning 401');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const userId = user.id;
    
    // Create authenticated Supabase client
    const supabase = createClient();
    
    // Create integration manager and delete configuration
    const integrationManager = createIntegrationManager(userId, supabase);
    const result = await integrationManager.deleteConfiguration('vapi');

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to delete configuration" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "VAPI configuration deleted successfully"
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting VAPI configuration:", error);
    
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
