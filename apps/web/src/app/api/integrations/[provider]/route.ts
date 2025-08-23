import { getIntegrationConfig, upsertIntegrationConfig } from "@v1/supabase/cached-queries";
import { 
  validateConfigByProvider, 
  providerSchema,
  type Provider 
} from "@v1/supabase/validations/integrations";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const { provider } = params;

    // Validate provider using our schema
    const providerValidation = providerSchema.safeParse(provider);
    if (!providerValidation.success) {
      return NextResponse.json(
        { error: "Invalid provider" },
        { status: 400 }
      );
    }

    const result = await getIntegrationConfig(providerValidation.data);
    
    return NextResponse.json({
      config: result.data || {},
    });
  } catch (error) {
    console.error("Error fetching integration config:", error);
    return NextResponse.json(
      { error: "Failed to fetch configuration" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const { provider } = params;

    // Validate provider using our schema
    const providerValidation = providerSchema.safeParse(provider);
    if (!providerValidation.success) {
      return NextResponse.json(
        { error: "Invalid provider" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { config } = body;

    if (!config) {
      return NextResponse.json(
        { error: "Config is required" },
        { status: 400 }
      );
    }

    // Validate the config using our comprehensive validation
    const validationResult = validateConfigByProvider(providerValidation.data, config);

    if (!validationResult.success) {
      // Handle Zod validation errors vs custom errors
      const errorDetails = validationResult.error && typeof validationResult.error === 'object' && 'flatten' in validationResult.error
        ? validationResult.error.flatten().fieldErrors
        : validationResult.error;
        
      return NextResponse.json(
        {
          error: "Validation failed",
          details: errorDetails,
        },
        { status: 400 }
      );
    }

    // TypeScript guard to ensure we have validated data
    if (!('data' in validationResult)) {
      return NextResponse.json(
        { error: "Internal validation error" },
        { status: 500 }
      );
    }
    
    const result = await upsertIntegrationConfig(providerValidation.data, validationResult.data);

    if (!result.data) {
      return NextResponse.json(
        { error: "Failed to save configuration" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      config: result.data,
    });
  } catch (error) {
    console.error("Error saving integration config:", error);
    return NextResponse.json(
      { error: "Failed to save configuration" },
      { status: 500 }
    );
  }
}

// Add test endpoint
export async function PUT(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const { provider } = params;

    // Validate provider
    const providerValidation = providerSchema.safeParse(provider);
    if (!providerValidation.success) {
      return NextResponse.json(
        { error: "Invalid provider" },
        { status: 400 }
      );
    }

    // Get current config and validate it
    const result = await getIntegrationConfig(providerValidation.data);
    
    if (!result.data) {
      return NextResponse.json(
        { error: "No configuration found to test" },
        { status: 404 }
      );
    }

    const validationResult = validateConfigByProvider(providerValidation.data, result.data);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Configuration validation failed",
          details: validationResult.error,
        },
        { status: 400 }
      );
    }

    // TODO: Implement actual API testing for each provider
    return NextResponse.json({
      success: true,
      message: `${provider} configuration is valid`,
      tested_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error testing integration config:", error);
    return NextResponse.json(
      { error: "Failed to test configuration" },
      { status: 500 }
    );
  }
}
