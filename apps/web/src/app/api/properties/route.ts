import { NextRequest, NextResponse } from 'next/server';
import { createPropertyManager } from '@v1/supabase/lib/properties';
import { createClient } from '@v1/supabase/server';
import { z } from 'zod';

// Validation schema for property creation
const createPropertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  property_type: z.enum(['single_family', 'multi_family', 'condo', 'townhouse', 'land', 'commercial', 'industrial', 'retail', 'office', 'mixed_use']),
  status: z.enum(['active', 'pending', 'sold', 'rented', 'inactive', 'under_contract', 'expired']).default('active'),
  price: z.number().positive().optional(),
  price_type: z.enum(['sale', 'rent', 'lease', 'auction', 'negotiable']).default('sale'),
  bedrooms: z.number().int().positive().optional(),
  bathrooms: z.number().positive().optional(),
  square_feet: z.number().int().positive().optional(),
  lot_size: z.number().positive().optional(),
  address_line_1: z.string().min(1, 'Address is required'),
  address_line_2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip_code: z.string().min(1, 'ZIP code is required'),
  country: z.string().default('USA'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  year_built: z.number().int().positive().optional(),
  property_features: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
  documents: z.array(z.string().url()).optional(),
  contact_info: z.object({
    contact_name: z.string().optional(),
    contact_email: z.string().email().optional(),
    contact_phone: z.string().optional(),
    contact_company: z.string().optional(),
    preferred_contact_method: z.enum(['email', 'phone', 'text']).optional(),
  }).optional(),
  is_featured: z.boolean().default(false),
});

// GET /api/properties - Get user's properties
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const propertyManager = createPropertyManager(user.id);
    const result = await propertyManager.getUserProperties();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch properties' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      properties: result.properties || [],
    });
  } catch (error) {
    console.error('Error in GET /api/properties:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create a new property
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    const validationResult = createPropertySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const propertyData = validationResult.data;
    const propertyManager = createPropertyManager(user.id);
    const result = await propertyManager.createProperty(propertyData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create property' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      propertyId: result.propertyId,
      message: 'Property created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/properties:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
