'use client';

import { useState } from 'react';
import type { Property } from '@/types/property';
import PropertyDialog from './PropertyDialog';
import { Phone } from 'lucide-react';

interface PropertyListProps {
  properties: Property[];
}

export default function PropertyList({ properties }: PropertyListProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Property Listings</h2>
        <div className="text-sm text-gray-500">
          {properties.length} properties found
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b text-sm font-medium text-gray-500">
          <div className="col-span-1">Select</div>
          <div className="col-span-3">Address</div>
          <div className="col-span-2">Owner</div>
          <div className="col-span-2">Phone</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-1">Sq Ft</div>
          <div className="col-span-1 text-right">Value</div>
        </div>
        
        <div className="divide-y">
          {properties.map((property) => (
            <div 
              key={property.id} 
              className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50"
            >
              <div className="col-span-1">
                <input
                  type="radio"
                  name="property"
                  id={`property-${property.id}`}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  onChange={() => handlePropertySelect(property)}
                />
              </div>
              <div className="col-span-3">
                <label 
                  htmlFor={`property-${property.id}`}
                  className="font-medium cursor-pointer hover:text-blue-600"
                >
                  {property.address}
                </label>
              </div>
              <div className="col-span-2 text-gray-600">{property.owner}</div>
              <div className="col-span-2 text-gray-600 flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                {property.phone}
              </div>
              <div className="col-span-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {property.type}
                </span>
              </div>
              <div className="col-span-1 text-gray-600">{property.sqFt}</div>
              <div className="col-span-1 text-right font-medium">{property.assessedValue}</div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedProperty && (
        <PropertyDialog
          property={selectedProperty}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </div>
  );
}


