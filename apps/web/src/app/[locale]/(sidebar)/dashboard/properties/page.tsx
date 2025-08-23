"use client";

import { useState, useEffect } from 'react';
import { Button } from '@v1/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card';
import { Badge } from '@v1/ui/badge';
import { Plus, Search, Filter, MapPin, Home, DollarSign, Bed, Bath, Square } from 'lucide-react';
import { PropertyForm } from '@/components/properties/property-form';
import type { Property, PropertyFormData } from '@v1/supabase/types/properties';

// Mock data for now - will be replaced with real API calls
const mockProperties: Property[] = [
  {
    id: '1',
    user_id: 'user-1',
    title: 'Modern Downtown Condo',
    description: 'Beautiful 2-bedroom condo in the heart of downtown with city views and modern amenities.',
    property_type: 'condo',
    status: 'active',
    price: 450000,
    price_type: 'sale',
    bedrooms: 2,
    bathrooms: 2,
    square_feet: 1200,
    address_line_1: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94105',
    country: 'USA',
    property_features: ['Balcony', 'City View', 'Modern Kitchen', 'In-Unit Laundry'],
    images: [],
    documents: [],
    contact_info: {},
    is_featured: true,
    is_active: true,
    created_at: '2025-01-23T00:00:00Z',
    updated_at: '2025-01-23T00:00:00Z',
  },
  {
    id: '2',
    user_id: 'user-1',
    title: 'Family Home in Suburbs',
    description: 'Spacious 4-bedroom family home with large backyard and excellent school district.',
    property_type: 'single_family',
    status: 'active',
    price: 850000,
    price_type: 'sale',
    bedrooms: 4,
    bathrooms: 3.5,
    square_feet: 2800,
    address_line_1: '456 Oak Avenue',
    city: 'Palo Alto',
    state: 'CA',
    zip_code: '94301',
    country: 'USA',
    property_features: ['Large Backyard', 'Garage', 'Fireplace', 'Hardwood Floors'],
    images: [],
    documents: [],
    contact_info: {},
    is_featured: false,
    is_active: true,
    created_at: '2025-01-23T00:00:00Z',
    updated_at: '2025-01-23T00:00:00Z',
  },
];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateProperty = async (data: PropertyFormData) => {
    setIsLoading(true);
    try {
      // TODO: Replace with real API call
      console.log('Creating property:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add mock property
      const newProperty: Property = {
        id: Date.now().toString(),
        user_id: 'user-1',
        ...data,
        is_featured: data.is_featured || false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setProperties([newProperty, ...properties]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating property:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'rented': return 'bg-purple-100 text-purple-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'under_contract': return 'bg-orange-100 text-orange-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'single_family': return <Home className="h-4 w-4" />;
      case 'condo': return <Home className="h-4 w-4" />;
      case 'multi_family': return <Home className="h-4 w-4" />;
      case 'commercial': return <Home className="h-4 w-4" />;
      default: return <Home className="h-4 w-4" />;
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Price on request';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (showForm) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Add New Property</h1>
          <Button variant="outline" onClick={() => setShowForm(false)}>
            Cancel
          </Button>
        </div>
        <PropertyForm
          onSubmit={handleCreateProperty}
          onCancel={() => setShowForm(false)}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="text-gray-600">Manage your real estate listings</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getPropertyTypeIcon(property.property_type)}
                  <Badge variant="outline" className="text-xs">
                    {property.property_type.replace('_', ' ')}
                  </Badge>
                </div>
                <Badge className={`text-xs ${getStatusColor(property.status)}`}>
                  {property.status.replace('_', ' ')}
                </Badge>
              </div>
              <CardTitle className="text-lg">{property.title}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="h-3 w-3" />
                {property.city}, {property.state}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {property.description}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Price</span>
                  <span className="font-semibold text-lg">{formatPrice(property.price)}</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {property.bedrooms && (
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      <span>{property.bedrooms} beds</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      <span>{property.bathrooms} baths</span>
                    </div>
                  )}
                  {property.square_feet && (
                    <div className="flex items-center gap-1">
                      <Square className="h-4 w-4" />
                      <span>{property.square_feet} sq ft</span>
                    </div>
                  )}
                </div>
                
                {property.property_features && property.property_features.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {property.property_features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {property.property_features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{property.property_features.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? 'Try adjusting your search terms' : 'Get started by adding your first property'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
