import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@v1/supabase/server";
import { createIntegrationManager } from "@v1/supabase/lib/integrations";

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
    console.log('=== Integration Status GET Debug ===');
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    // Get authenticated user
    const user = await getAuthenticatedUser();
    
    let userId: string;
    
    if (!user) {
      // TEMPORARY: Allow mock user for testing
      // TODO: Remove this when proper authentication is set up
      console.log('Auth failed, using mock user for testing');
      userId = "aec53558-767e-4408-b4d6-1c1e6f17ffe5";
    } else {
      userId = user.id;
    }
    
    console.log('Using user ID:', userId);

    // Create authenticated Supabase client
    const supabase = createClient();

    // Create integration manager and get statuses
    const integrationManager = createIntegrationManager(userId, supabase);
    console.log('Integration manager created for user:', userId);
    
    const statuses = await integrationManager.getIntegrationStatuses();
    console.log('Retrieved statuses count:', statuses?.length || 0);
    console.log('Retrieved statuses data:', statuses);

    if (!statuses) {
      console.log('No statuses found - returning 500');
      return NextResponse.json(
        { error: "Failed to retrieve integration statuses" },
        { status: 500 }
      );
    }

    console.log('Returning statuses successfully');
    return NextResponse.json(
      { 
        success: true, 
        statuses,
        userId 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error retrieving integration statuses:", error);
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
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { integrationType, isActive, statusMessage, errorCount } = body;

    if (!integrationType) {
      return NextResponse.json(
        { error: "Integration type is required" },
        { status: 400 }
      );
    }

    // Create authenticated Supabase client
    const supabase = createClient();

    // Create integration manager and update status
    const integrationManager = createIntegrationManager(user.id, supabase);
    await integrationManager.updateIntegrationStatus(
      integrationType,
      isActive, // isConfigured
      'success' // testStatus
    );

    return NextResponse.json(
      { 
        success: true, 
        message: "Integration status updated successfully" 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating integration status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
