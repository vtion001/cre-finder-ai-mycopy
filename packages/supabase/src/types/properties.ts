export interface Property {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  property_type: PropertyType;
  status: PropertyStatus;
  price?: number;
  price_type: PriceType;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  lot_size?: number;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
  year_built?: number;
  property_features?: string[];
  images?: string[];
  documents?: string[];
  contact_info?: PropertyContactInfo;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyFormData {
  title: string;
  description?: string;
  property_type: PropertyType;
  status: PropertyStatus;
  price?: number;
  price_type: PriceType;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  lot_size?: number;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
  year_built?: number;
  property_features?: string[];
  images?: string[];
  documents?: string[];
  contact_info?: PropertyContactInfo;
  is_featured?: boolean;
}

export interface PropertyContactInfo {
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_company?: string;
  preferred_contact_method?: 'email' | 'phone' | 'text';
}

export type PropertyType = 
  | 'single_family'
  | 'multi_family'
  | 'condo'
  | 'townhouse'
  | 'land'
  | 'commercial'
  | 'industrial'
  | 'retail'
  | 'office'
  | 'mixed_use';

export type PropertyStatus = 
  | 'active'
  | 'pending'
  | 'sold'
  | 'rented'
  | 'inactive'
  | 'under_contract'
  | 'expired';

export type PriceType = 
  | 'sale'
  | 'rent'
  | 'lease'
  | 'auction'
  | 'negotiable';

export interface PropertyFilters {
  property_type?: PropertyType[];
  status?: PropertyStatus[];
  min_price?: number;
  max_price?: number;
  price_type?: PriceType[];
  min_bedrooms?: number;
  max_bedrooms?: number;
  min_bathrooms?: number;
  max_bathrooms?: number;
  min_square_feet?: number;
  max_square_feet?: number;
  city?: string;
  state?: string;
  zip_code?: string;
  features?: string[];
  is_featured?: boolean;
}

export interface PropertySearchParams {
  query?: string;
  filters?: PropertyFilters;
  sort_by?: 'price' | 'created_at' | 'updated_at' | 'square_feet' | 'bedrooms';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PropertySearchResult {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Database table names
export const PROPERTY_TABLES = {
  PROPERTIES: 'properties',
  PUBLIC_PROPERTIES: 'public_properties',
} as const;
