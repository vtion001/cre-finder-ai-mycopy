import type { PropertyFormData } from '@v1/supabase/types/properties';

/**
 * Test Properties for Vercel Deployment
 * These properties will be used to demonstrate the system capabilities
 */

export const testProperties: PropertyFormData[] = [
  {
    title: 'Downtown Office Building - Premium Space',
    description: 'Exceptional office building in the heart of downtown Greenville. This premium commercial property features modern amenities, excellent accessibility, and professional appeal. Perfect for established businesses seeking a prestigious address with all the conveniences of downtown living.',
    property_type: 'commercial',
    status: 'active',
    price: 2500000,
    price_type: 'sale',
    bedrooms: 0,
    bathrooms: 8,
    square_feet: 15000,
    lot_size: 0.5,
    address_line_1: '123 Business District Blvd',
    address_line_2: 'Suite 200',
    city: 'Greenville',
    state: 'SC',
    zip_code: '29601',
    country: 'USA',
    year_built: 2018,
    property_features: [
      'Modern HVAC System',
      'Fiber Optic Internet',
      'Conference Rooms',
      'Parking Garage',
      'Security System',
      'Elevator Access',
      'Break Room',
      'Fitness Center',
      '24/7 Building Access',
      'Professional Reception'
    ],
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop'
    ],
    documents: [
      'https://example.com/property-flyer.pdf',
      'https://example.com/floor-plan.pdf',
      'https://example.com/financial-analysis.pdf'
    ],
          contact_info: {
        contact_name: 'John Smith',
        contact_email: 'john.smith@crefinder.com',
        contact_phone: '(864) 477-4757', // Client contact number for receiving calls
        contact_company: 'CRE Finder AI',
        preferred_contact_method: 'phone'
      },
    is_featured: true
  },
  {
    title: 'Modern Downtown Condo - Investment Opportunity',
    description: 'Beautiful 2-bedroom condo in the heart of downtown with city views and modern amenities. This investment property offers excellent rental potential and is perfect for young professionals or as a short-term rental property.',
    property_type: 'condo',
    status: 'active',
    price: 450000,
    price_type: 'sale',
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1200,
    lot_size: 0,
    address_line_1: '456 Main Street',
    address_line_2: 'Unit 4B',
    city: 'Greenville',
    state: 'SC',
    zip_code: '29601',
    country: 'USA',
    year_built: 2020,
    property_features: [
      'Balcony with City View',
      'Modern Kitchen',
      'In-Unit Laundry',
      'Hardwood Floors',
      'Walk-in Closet',
      'Underground Parking',
      'Rooftop Terrace',
      'Fitness Center'
    ],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop'
    ],
    documents: [
      'https://example.com/condo-flyer.pdf',
      'https://example.com/hoa-documents.pdf'
    ],
          contact_info: {
        contact_name: 'Sarah Johnson',
        contact_email: 'sarah.johnson@crefinder.com',
        contact_phone: '(864) 477-4757', // Client contact number for receiving calls
        contact_company: 'CRE Finder AI',
        preferred_contact_method: 'email'
      },
    is_featured: false
  },
  {
    title: 'Family Home in Suburbs - Perfect for Growing Families',
    description: 'Spacious 4-bedroom family home with large backyard and excellent school district. This well-maintained property offers the perfect balance of suburban tranquility and modern convenience, making it ideal for growing families.',
    property_type: 'single_family',
    status: 'active',
    price: 850000,
    price_type: 'sale',
    bedrooms: 4,
    bathrooms: 3.5,
    square_feet: 2800,
    lot_size: 0.75,
    address_line_1: '789 Oak Avenue',
    address_line_2: '',
    city: 'Greenville',
    state: 'SC',
    zip_code: '29607',
    country: 'USA',
    year_built: 2015,
    property_features: [
      'Large Backyard',
      '2-Car Garage',
      'Fireplace',
      'Hardwood Floors',
      'Granite Countertops',
      'Stainless Steel Appliances',
      'Walk-in Pantry',
      'Master Suite',
      'Bonus Room',
      'Covered Patio'
    ],
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop'
    ],
    documents: [
      'https://example.com/home-flyer.pdf',
      'https://example.com/inspection-report.pdf'
    ],
          contact_info: {
        contact_name: 'Mike Davis',
        contact_email: 'mike.davis@crefinder.com',
        contact_phone: '(864) 477-4757', // Client contact number for receiving calls
        contact_company: 'CRE Finder AI',
        preferred_contact_method: 'phone'
      },
    is_featured: true
  },
  {
    title: 'Industrial Warehouse - Prime Location',
    description: 'Large industrial warehouse space with excellent transportation access and loading facilities. This property is perfect for manufacturing, distribution, or storage operations with its high ceilings and ample parking.',
    property_type: 'industrial',
    status: 'active',
    price: 1800000,
    price_type: 'sale',
    bedrooms: 0,
    bathrooms: 2,
    square_feet: 25000,
    lot_size: 2.5,
    address_line_1: '321 Industrial Parkway',
    address_line_2: '',
    city: 'Greenville',
    state: 'SC',
    zip_code: '29605',
    country: 'USA',
    year_built: 2010,
    property_features: [
      'High Ceilings (24ft)',
      'Loading Docks',
      'Heavy Duty Flooring',
      'Office Space',
      'Ample Parking',
      'Security System',
      'Climate Control',
      'Forklift Access',
      'Rail Access',
      'Expansion Potential'
    ],
    images: [
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1581094794329-8c5c0b8f9f8f?w=800&h=600&fit=crop'
    ],
    documents: [
      'https://example.com/warehouse-flyer.pdf',
      'https://example.com/floor-plan.pdf'
    ],
          contact_info: {
        contact_name: 'Lisa Chen',
        contact_email: 'lisa.chen@crefinder.com',
        contact_phone: '(864) 477-4757', // Client contact number for receiving calls
        contact_company: 'CRE Finder AI',
        preferred_contact_method: 'text'
      },
    is_featured: false
  }
];

/**
 * Get test property by index
 */
export function getTestProperty(index: number): PropertyFormData | null {
  return testProperties[index] || null;
}

/**
 * Get all test properties
 */
export function getAllTestProperties(): PropertyFormData[] {
  return testProperties;
}

/**
 * Get featured test properties
 */
export function getFeaturedTestProperties(): PropertyFormData[] {
  return testProperties.filter(property => property.is_featured);
}

/**
 * Get test properties by type
 */
export function getTestPropertiesByType(type: string): PropertyFormData[] {
  return testProperties.filter(property => property.property_type === type);
}
