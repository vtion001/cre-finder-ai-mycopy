import { createClient } from '@v1/supabase/server';
import type { 
  Property, 
  PropertyFormData, 
  PropertySearchParams, 
  PropertySearchResult,
  PropertyFilters 
} from '../types/properties';

export class PropertyManager {
  private supabase;
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
    this.supabase = createClient();
  }

  // Create a new property
  async createProperty(propertyData: PropertyFormData): Promise<{ success: boolean; propertyId?: string; error?: string }> {
    try {
      // Map PropertyFormData to database schema
      const dbData = {
        user_id: this.userId,
        title: propertyData.title,
        description: propertyData.description,
        property_type: propertyData.property_type,
        status: propertyData.status,
        price: propertyData.price,
        price_type: propertyData.price_type,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        square_feet: propertyData.square_feet,
        lot_size: propertyData.lot_size,
        address_line_1: propertyData.address_line_1,
        address_line_2: propertyData.address_line_2,
        city: propertyData.city,
        state: propertyData.state,
        zip_code: propertyData.zip_code,
        country: propertyData.country,
        latitude: propertyData.latitude,
        longitude: propertyData.longitude,
        year_built: propertyData.year_built,
        property_features: propertyData.property_features,
        images: propertyData.images,
        documents: propertyData.documents,
        contact_info: propertyData.contact_info as any, // Cast to Json type
        is_featured: propertyData.is_featured || false,
      };

      const { data, error } = await this.supabase
        .from('properties')
        .insert(dbData)
        .select()
        .single();

      if (error) {
        console.error('Error creating property:', error);
        return { success: false, error: error.message };
      }

      return { success: true, propertyId: data.id };
    } catch (error) {
      console.error('Error in createProperty:', error);
      return { success: false, error: 'Failed to create property' };
    }
  }

  // Get a property by ID
  async getProperty(propertyId: string): Promise<{ success: boolean; property?: Property; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .eq('user_id', this.userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: false, error: 'Property not found' };
        }
        console.error('Error fetching property:', error);
        return { success: false, error: error.message };
      }

      return { success: true, property: data as Property };
    } catch (error) {
      console.error('Error in getProperty:', error);
      return { success: false, error: 'Failed to fetch property' };
    }
  }

  // Get all properties for the current user
  async getUserProperties(): Promise<{ success: boolean; properties?: Property[]; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from('properties')
        .select('*')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user properties:', error);
        return { success: false, error: error.message };
      }

      return { success: true, properties: data as Property[] };
    } catch (error) {
      console.error('Error in getUserProperties:', error);
      return { success: false, error: 'Failed to fetch user properties' };
    }
  }

  // Update a property
  async updateProperty(propertyId: string, updates: Partial<PropertyFormData>): Promise<{ success: boolean; error?: string }> {
    try {
      // Map PropertyFormData to database schema
      const dbUpdates: any = {};
      
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.property_type !== undefined) dbUpdates.property_type = updates.property_type;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.price_type !== undefined) dbUpdates.price_type = updates.price_type;
      if (updates.bedrooms !== undefined) dbUpdates.bedrooms = updates.bedrooms;
      if (updates.bathrooms !== undefined) dbUpdates.bathrooms = updates.bathrooms;
      if (updates.square_feet !== undefined) dbUpdates.square_feet = updates.square_feet;
      if (updates.lot_size !== undefined) dbUpdates.lot_size = updates.lot_size;
      if (updates.address_line_1 !== undefined) dbUpdates.address_line_1 = updates.address_line_1;
      if (updates.address_line_2 !== undefined) dbUpdates.address_line_2 = updates.address_line_2;
      if (updates.city !== undefined) dbUpdates.city = updates.city;
      if (updates.state !== undefined) dbUpdates.state = updates.state;
      if (updates.zip_code !== undefined) dbUpdates.zip_code = updates.zip_code;
      if (updates.country !== undefined) dbUpdates.country = updates.country;
      if (updates.latitude !== undefined) dbUpdates.latitude = updates.latitude;
      if (updates.longitude !== undefined) dbUpdates.longitude = updates.longitude;
      if (updates.year_built !== undefined) dbUpdates.year_built = updates.year_built;
      if (updates.property_features !== undefined) dbUpdates.property_features = updates.property_features;
      if (updates.images !== undefined) dbUpdates.images = updates.images;
      if (updates.documents !== undefined) dbUpdates.documents = updates.documents;
      if (updates.contact_info !== undefined) dbUpdates.contact_info = updates.contact_info as any;
      if (updates.is_featured !== undefined) dbUpdates.is_featured = updates.is_featured;

      const { error } = await this.supabase
        .from('properties')
        .update(dbUpdates)
        .eq('id', propertyId)
        .eq('user_id', this.userId);

      if (error) {
        console.error('Error updating property:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in updateProperty:', error);
      return { success: false, error: 'Failed to update property' };
    }
  }

  // Delete a property
  async deleteProperty(propertyId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('properties')
        .delete()
        .eq('id', propertyId)
        .eq('user_id', this.userId);

      if (error) {
        console.error('Error deleting property:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deleteProperty:', error);
      return { success: false, error: 'Failed to delete property' };
    }
  }

  // Search properties with filters
  async searchProperties(params: PropertySearchParams): Promise<{ success: boolean; result?: PropertySearchResult; error?: string }> {
    try {
      let query = this.supabase
        .from('public_properties')
        .select('*', { count: 'exact' });

      // Apply text search
      if (params.query) {
        query = query.or(`title.ilike.%${params.query}%,description.ilike.%${params.query}%,city.ilike.%${params.query}%`);
      }

      // Apply filters
      if (params.filters) {
        query = this.applyFilters(query, params.filters);
      }

      // Apply sorting
      if (params.sort_by) {
        const order = params.sort_order || 'desc';
        query = query.order(params.sort_by, { ascending: order === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      const page = params.page || 1;
      const limit = params.limit || 20;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error searching properties:', error);
        return { success: false, error: error.message };
      }

      const total = count || 0;
      const total_pages = Math.ceil(total / limit);

      const result: PropertySearchResult = {
        properties: data as Property[],
        total,
        page,
        limit,
        total_pages,
      };

      return { success: true, result };
    } catch (error) {
      console.error('Error in searchProperties:', error);
      return { success: false, error: 'Failed to search properties' };
    }
  }

  // Get featured properties
  async getFeaturedProperties(limit: number = 6): Promise<{ success: boolean; properties?: Property[]; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from('public_properties')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching featured properties:', error);
        return { success: false, error: error.message };
      }

      return { success: true, properties: data as Property[] };
    } catch (error) {
      console.error('Error in getFeaturedProperties:', error);
      return { success: false, error: 'Failed to fetch featured properties' };
    }
  }

  // Toggle property featured status
  async toggleFeatured(propertyId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // First get the current featured status
      const { data: currentProperty, error: fetchError } = await this.supabase
        .from('properties')
        .select('is_featured')
        .eq('id', propertyId)
        .eq('user_id', this.userId)
        .single();

      if (fetchError) {
        console.error('Error fetching property for featured toggle:', fetchError);
        return { success: false, error: fetchError.message };
      }

      const newFeaturedStatus = !currentProperty.is_featured;

      const { error: updateError } = await this.supabase
        .from('properties')
        .update({ is_featured: newFeaturedStatus })
        .eq('id', propertyId)
        .eq('user_id', this.userId);

      if (updateError) {
        console.error('Error updating featured status:', updateError);
        return { success: false, error: updateError.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in toggleFeatured:', error);
      return { success: false, error: 'Failed to toggle featured status' };
    }
  }

  // Apply filters to query
  private applyFilters(query: any, filters: PropertyFilters): any {
    if (filters.property_type && filters.property_type.length > 0) {
      query = query.in('property_type', filters.property_type);
    }

    if (filters.status && filters.status.length > 0) {
      query = query.in('status', filters.status);
    }

    if (filters.min_price !== undefined) {
      query = query.gte('price', filters.min_price);
    }

    if (filters.max_price !== undefined) {
      query = query.lte('price', filters.max_price);
    }

    if (filters.price_type && filters.price_type.length > 0) {
      query = query.in('price_type', filters.price_type);
    }

    if (filters.min_bedrooms !== undefined) {
      query = query.gte('bedrooms', filters.min_bedrooms);
    }

    if (filters.max_bedrooms !== undefined) {
      query = query.lte('bedrooms', filters.max_bedrooms);
    }

    if (filters.min_bathrooms !== undefined) {
      query = query.gte('bathrooms', filters.min_bathrooms);
    }

    if (filters.max_bathrooms !== undefined) {
      query = query.lte('bathrooms', filters.max_bathrooms);
    }

    if (filters.min_square_feet !== undefined) {
      query = query.gte('square_feet', filters.min_square_feet);
    }

    if (filters.max_square_feet !== undefined) {
      query = query.lte('square_feet', filters.max_square_feet);
    }

    if (filters.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }

    if (filters.state) {
      query = query.ilike('state', `%${filters.state}%`);
    }

    if (filters.zip_code) {
      query = query.ilike('zip_code', `%${filters.zip_code}%`);
    }

    if (filters.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured);
    }

    return query;
  }
}

// Helper function to create a property manager instance
export function createPropertyManager(userId: string): PropertyManager {
  return new PropertyManager(userId);
}
