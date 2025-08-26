"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import PropertyList from '@/components/dashboard/PropertyList';
import type { Property } from '@/types/property';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    location: ''
  });

  const sampleProperties: Property[] = [
    {
      id: 1,
      address: "935 12th St, Vero Beach, FL 32960",
      owner: "Wise Guy Ventures Llc",
      contactInfo: "Contact Available",
      phone: "+1 (864) 477-4757",
      type: "Commercial",
      sqFt: "5,532",
      assessedValue: "$286.3K"
    },
    {
      id: 2,
      address: "1234 Ocean Dr, Vero Beach, FL 32963",
      owner: "Seaside Properties Inc",
      contactInfo: "Contact Available",
      phone: "+1 (772) 234-5678",
      type: "Residential",
      sqFt: "3,210",
      assessedValue: "$425.7K"
    },
    {
      id: 3,
      address: "567 Palm Ave, Vero Beach, FL 32960",
      owner: "Beachfront Holdings LLC",
      contactInfo: "Contact Available",
      phone: "+1 (772) 345-6789",
      type: "Commercial",
      sqFt: "7,850",
      assessedValue: "$1.2M"
    },
    {
      id: 4,
      address: "891 River Rd, Vero Beach, FL 32968",
      owner: "Riverside Investments",
      contactInfo: "Contact Available",
      phone: "+1 (772) 456-7890",
      type: "Residential",
      sqFt: "2,450",
      assessedValue: "$312.5K"
    },
    {
      id: 5,
      address: "246 Beach Blvd, Vero Beach, FL 32963",
      owner: "Coastal Ventures Group",
      contactInfo: "Contact Available",
      phone: "+1 (772) 567-8901",
      type: "Commercial",
      sqFt: "4,120",
      assessedValue: "$578.9K"
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching with:', { searchQuery, filters });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Property Search</h1>
        <p className="text-muted-foreground">
          Find your perfect property with our advanced search tools
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Properties
          </CardTitle>
          <CardDescription>
            Enter keywords or use filters to find properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <Input
                id="search-query"
                name="searchQuery"
                aria-label="Search query"
                placeholder="Search by location, property type, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Search</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label htmlFor="property-type" className="text-sm font-medium">Property Type</label>
                <Select name="propertyType" value={filters.propertyType} onValueChange={(value) => setFilters({...filters, propertyType: value})}>
                  <SelectTrigger id="property-type">
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="min-price" className="text-sm font-medium">Min Price</label>
                <Input
                  id="min-price"
                  name="minPrice"
                  type="number"
                  placeholder="Min price"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                />
              </div>
              
              <div>
                <label htmlFor="max-price" className="text-sm font-medium">Max Price</label>
                <Input
                  id="max-price"
                  name="maxPrice"
                  type="number"
                  placeholder="Max price"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                />
              </div>
              
              <div>
                <label htmlFor="bedrooms" className="text-sm font-medium">Bedrooms</label>
                <Select name="bedrooms" value={filters.bedrooms} onValueChange={(value) => setFilters({...filters, bedrooms: value})}>
                  <SelectTrigger id="bedrooms">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="location" className="text-sm font-medium">Location</label>
                <Input
                  id="location"
                  name="location"
                  placeholder="City or ZIP"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <PropertyList properties={sampleProperties} />
    </div>
  );
}

