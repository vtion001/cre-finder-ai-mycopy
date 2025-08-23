import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@v1/supabase/server";
import { createIntegrationManager } from "@v1/supabase/lib/integrations";
import { twilioConfigSchema } from "@v1/supabase/validations/integrations";

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

export async function POST(request: NextRequest) {
  try {
    console.log('=== Twilio POST Debug ===');
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
    console.log('Request body received:', { ...body, authToken: body.authToken ? '***' : 'undefined' });
    
    // Validate request body
    const validation = twilioConfigSchema.safeParse(body);
    if (!validation.success) {
      console.log('Validation failed:', validation.error.errors);
      return NextResponse.json(
        { error: "Invalid configuration data", details: validation.error.errors },
        { status: 400 }
      );
    }

    const config = validation.data;
    
    // Use real authenticated user ID
    const userId = user.id;
    console.log('Using user ID:', userId);
    
    // Create authenticated Supabase client
    const supabase = createClient();
    
    // Create integration manager with authenticated client
    const integrationManager = createIntegrationManager(userId, supabase);
    console.log('Integration manager created for user:', userId);
    
    const result = await integrationManager.saveTwilioConfig(config);
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
        message: "Twilio configuration saved successfully",
        configId: result.configId
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error saving Twilio configuration:", error);
    
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

export async function GET(request: NextRequest) {
  try {
    console.log('=== Twilio GET Debug ===');
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
    
    const config = await integrationManager.getTwilioConfig();
    console.log('Retrieved config via integration manager:', config ? 'Found' : 'Not found');

    if (!config) {
      console.log('No config found, returning empty state');
      return NextResponse.json(
        { 
          isConfigured: false,
          message: "No Twilio configuration found"
        },
        { status: 200 }
      );
    }

    // Return configuration with sensitive data masked
    const safeConfig = {
      id: config.id,
      accountSid: config.account_sid.substring(0, 8) + "...", // Mask for security
      authToken: config.auth_token.substring(0, 8) + "...", // Mask for security
      phoneNumber: config.phone_number,
      messagingServiceSid: config.messaging_service_sid || "",
      webhookUrl: config.webhook_url || "",
      customMessage: config.custom_message || "",
      isConfigured: true,
      createdAt: config.created_at,
      updatedAt: config.updated_at,
    };

    console.log('Returning safe config via integration manager');
    return NextResponse.json(safeConfig, { status: 200 });

  } catch (error) {
    console.error("Error retrieving Twilio configuration:", error);
    
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
    const validation = twilioConfigSchema.safeParse(body);
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
    const result = await integrationManager.saveTwilioConfig(config);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to update configuration" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Twilio configuration updated successfully",
        configId: result.configId
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating Twilio configuration:", error);
    
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
    const result = await integrationManager.deleteConfiguration('twilio');

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to delete configuration" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Twilio configuration deleted successfully"
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting Twilio configuration:", error);
    
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
