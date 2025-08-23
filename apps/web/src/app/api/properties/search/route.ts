import { NextRequest, NextResponse } from 'next/server';
import { createPropertyManager } from '@v1/supabase/lib/properties';
import { createClient } from '@v1/supabase/server';
import { z } from 'zod';

// Validation schema for search parameters
const searchParamsSchema = z.object({
  query: z.string().optional(),
  filters: z.object({
    property_type: z.array(z.enum(['single_family', 'multi_family', 'condo', 'townhouse', 'land', 'commercial', 'industrial', 'retail', 'office', 'mixed_use'])).optional(),
    status: z.array(z.enum(['active', 'pending', 'sold', 'rented', 'inactive', 'under_contract', 'expired'])).optional(),
    min_price: z.number().positive().optional(),
    max_price: z.number().positive().optional(),
    price_type: z.array(z.enum(['sale', 'rent', 'lease', 'auction', 'negotiable'])).optional(),
    min_bedrooms: z.number().int().positive().optional(),
    max_bedrooms: z.number().int().positive().optional(),
    min_bathrooms: z.number().positive().optional(),
    max_bathrooms: z.number().positive().optional(),
    min_square_feet: z.number().int().positive().optional(),
    max_square_feet: z.number().int().positive().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip_code: z.string().optional(),
    features: z.array(z.string()).optional(),
    is_featured: z.boolean().optional(),
  }).optional(),
  sort_by: z.enum(['price', 'created_at', 'updated_at', 'square_feet', 'bedrooms']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().min(1).max(100).optional(),
});

// GET /api/properties/search - Search public properties
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

    // Parse search parameters from URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || undefined;
    const sort_by = searchParams.get('sort_by') as any || undefined;
    const sort_order = searchParams.get('sort_order') as any || undefined;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    // Parse filters from URL parameters
    const filters: any = {};
    
    // Property type filter
    const propertyType = searchParams.get('property_type');
    if (propertyType) {
      filters.property_type = propertyType.split(',').map(t => t.trim());
    }

    // Status filter
    const status = searchParams.get('status');
    if (status) {
      filters.status = status.split(',').map(s => s.trim());
    }

    // Price filters
    const minPrice = searchParams.get('min_price');
    if (minPrice) {
      filters.min_price = parseFloat(minPrice);
    }

    const maxPrice = searchParams.get('max_price');
    if (maxPrice) {
      filters.max_price = parseFloat(maxPrice);
    }

    // Price type filter
    const priceType = searchParams.get('price_type');
    if (priceType) {
      filters.price_type = priceType.split(',').map(p => p.trim());
    }

    // Bedroom filters
    const minBedrooms = searchParams.get('min_bedrooms');
    if (minBedrooms) {
      filters.min_bedrooms = parseInt(minBedrooms);
    }

    const maxBedrooms = searchParams.get('max_bedrooms');
    if (maxBedrooms) {
      filters.max_bedrooms = parseInt(maxBedrooms);
    }

    // Bathroom filters
    const minBathrooms = searchParams.get('min_bathrooms');
    if (minBathrooms) {
      filters.min_bathrooms = parseFloat(minBathrooms);
    }

    const maxBathrooms = searchParams.get('max_bathrooms');
    if (maxBathrooms) {
      filters.max_bathrooms = parseFloat(maxBathrooms);
    }

    // Square feet filters
    const minSquareFeet = searchParams.get('min_square_feet');
    if (minSquareFeet) {
      filters.min_square_feet = parseInt(minSquareFeet);
    }

    const maxSquareFeet = searchParams.get('max_square_feet');
    if (maxSquareFeet) {
      filters.max_square_feet = parseInt(maxSquareFeet);
    }

    // Location filters
    const city = searchParams.get('city');
    if (city) {
      filters.city = city;
    }

    const state = searchParams.get('state');
    if (state) {
      filters.state = state;
    }

    const zipCode = searchParams.get('zip_code');
    if (zipCode) {
      filters.zip_code = zipCode;
    }

    // Features filter
    const features = searchParams.get('features');
    if (features) {
      filters.features = features.split(',').map(f => f.trim());
    }

    // Featured filter
    const isFeatured = searchParams.get('is_featured');
    if (isFeatured) {
      filters.is_featured = isFeatured === 'true';
    }

    // Validate search parameters
    const searchParamsData = {
      query,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
      sort_by,
      sort_order,
      page,
      limit,
    };

    const validationResult = searchParamsSchema.safeParse(searchParamsData);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid search parameters', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const validatedParams = validationResult.data;
    const propertyManager = createPropertyManager(user.id);
    const result = await propertyManager.searchProperties(validatedParams);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to search properties' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      result: result.result,
    });
  } catch (error) {
    console.error('Error in GET /api/properties/search:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
