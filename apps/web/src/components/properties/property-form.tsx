"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@v1/ui/button';
import { Input } from '@v1/ui/input';
import { Label } from '@v1/ui/label';
import { Textarea } from '@v1/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@v1/ui/select';
import { Checkbox } from '@v1/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card';
import { Badge } from '@v1/ui/badge';
import { X, Plus } from 'lucide-react';
import type { PropertyFormData, PropertyType, PropertyStatus, PriceType } from '@v1/supabase/types/properties';

// Validation schema
const propertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  property_type: z.enum(['single_family', 'multi_family', 'condo', 'townhouse', 'land', 'commercial', 'industrial', 'retail', 'office', 'mixed_use']),
  status: z.enum(['active', 'pending', 'sold', 'rented', 'inactive', 'under_contract', 'expired']),
  price: z.number().positive().optional().or(z.literal('')),
  price_type: z.enum(['sale', 'rent', 'lease', 'auction', 'negotiable']),
  bedrooms: z.number().int().positive().optional().or(z.literal('')),
  bathrooms: z.number().positive().optional().or(z.literal('')),
  square_feet: z.number().int().positive().optional().or(z.literal('')),
  lot_size: z.number().positive().optional().or(z.literal('')),
  address_line_1: z.string().min(1, 'Address is required'),
  address_line_2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip_code: z.string().min(1, 'ZIP code is required'),
  country: z.string(),
  year_built: z.number().int().positive().optional().or(z.literal('')),
  property_features: z.array(z.string()),
  images: z.array(z.string()),
  documents: z.array(z.string()),
  contact_info: z.object({
    contact_name: z.string().optional(),
    contact_email: z.string().email().optional().or(z.literal('')),
    contact_phone: z.string().optional(),
    contact_company: z.string().optional(),
    preferred_contact_method: z.enum(['email', 'phone', 'text']).optional(),
  }),
  is_featured: z.boolean(),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  initialData?: Partial<PropertyFormData>;
  onSubmit: (data: PropertyFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: 'single_family', label: 'Single Family' },
  { value: 'multi_family', label: 'Multi Family' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'retail', label: 'Retail' },
  { value: 'office', label: 'Office' },
  { value: 'mixed_use', label: 'Mixed Use' },
];

const propertyStatuses: { value: PropertyStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'sold', label: 'Sold' },
  { value: 'rented', label: 'Rented' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'under_contract', label: 'Under Contract' },
  { value: 'expired', label: 'Expired' },
];

const priceTypes: { value: PriceType; label: string }[] = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
  { value: 'lease', label: 'For Lease' },
  { value: 'auction', label: 'Auction' },
  { value: 'negotiable', label: 'Negotiable' },
];

const contactMethods: { value: 'email' | 'phone' | 'text'; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'text', label: 'Text' },
];

export function PropertyForm({ initialData, onSubmit, onCancel, isLoading = false }: PropertyFormProps) {
  const [newFeature, setNewFeature] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newDocument, setNewDocument] = useState('');

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      property_type: initialData?.property_type || 'single_family',
      status: initialData?.status || 'active',
      price: initialData?.price || '',
      price_type: initialData?.price_type || 'sale',
      bedrooms: initialData?.bedrooms || '',
      bathrooms: initialData?.bathrooms || '',
      square_feet: initialData?.square_feet || '',
      lot_size: initialData?.lot_size || '',
      address_line_1: initialData?.address_line_1 || '',
      address_line_2: initialData?.address_line_2 || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      zip_code: initialData?.zip_code || '',
      country: initialData?.country || 'USA',
      year_built: initialData?.year_built || '',
      property_features: initialData?.property_features || [],
      images: initialData?.images || [],
      documents: initialData?.documents || [],
      contact_info: {
        contact_name: initialData?.contact_info?.contact_name || '',
        contact_email: initialData?.contact_info?.contact_email || '',
        contact_phone: initialData?.contact_info?.contact_phone || '',
        contact_company: initialData?.contact_info?.contact_company || '',
        preferred_contact_method: initialData?.contact_info?.preferred_contact_method || 'email',
      },
      is_featured: initialData?.is_featured || false,
    },
  });

  const handleSubmit = async (data: PropertyFormValues) => {
    // Convert empty strings to undefined for optional number fields
    const processedData = {
      ...data,
      price: data.price === '' ? undefined : data.price,
      bedrooms: data.bedrooms === '' ? undefined : data.bedrooms,
      bathrooms: data.bathrooms === '' ? undefined : data.bathrooms,
      square_feet: data.square_feet === '' ? undefined : data.square_feet,
      lot_size: data.lot_size === '' ? undefined : data.lot_size,
      year_built: data.year_built === '' ? undefined : data.year_built,
      contact_info: {
        ...data.contact_info,
        contact_email: data.contact_info.contact_email === '' ? undefined : data.contact_info.contact_email,
      },
    };

    await onSubmit(processedData);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      const currentFeatures = form.getValues('property_features');
      form.setValue('property_features', [...currentFeatures, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues('property_features');
    form.setValue('property_features', currentFeatures.filter((_, i) => i !== index));
  };

  const addImage = () => {
    if (newImage.trim()) {
      const currentImages = form.getValues('images');
      form.setValue('images', [...currentImages, newImage.trim()]);
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues('images');
    form.setValue('images', currentImages.filter((_, i) => i !== index));
  };

  const addDocument = () => {
    if (newDocument.trim()) {
      const currentDocuments = form.getValues('documents');
      form.setValue('documents', [...currentDocuments, newDocument.trim()]);
      setNewDocument('');
    }
  };

  const removeDocument = (index: number) => {
    const currentDocuments = form.getValues('documents');
    form.setValue('documents', currentDocuments.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Enter the basic details about the property</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="e.g., Modern Downtown Condo"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="property_type">Property Type *</Label>
              <Select
                value={form.watch('property_type')}
                onValueChange={(value) => form.setValue('property_type', value as PropertyType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={form.watch('status')}
                onValueChange={(value) => form.setValue('status', value as PropertyStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {propertyStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_type">Price Type *</Label>
              <Select
                value={form.watch('price_type')}
                onValueChange={(value) => form.setValue('price_type', value as PriceType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select price type" />
                </SelectTrigger>
                <SelectContent>
                  {priceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...form.register('price', { valueAsNumber: true })}
                placeholder="e.g., 450000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                {...form.register('bedrooms', { valueAsNumber: true })}
                placeholder="e.g., 3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                step="0.5"
                {...form.register('bathrooms', { valueAsNumber: true })}
                placeholder="e.g., 2.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="square_feet">Square Feet</Label>
              <Input
                id="square_feet"
                type="number"
                {...form.register('square_feet', { valueAsNumber: true })}
                placeholder="e.g., 2000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year_built">Year Built</Label>
              <Input
                id="year_built"
                type="number"
                {...form.register('year_built', { valueAsNumber: true })}
                placeholder="e.g., 2020"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Describe the property..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
          <CardDescription>Enter the property location details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address_line_1">Street Address *</Label>
            <Input
              id="address_line_1"
              {...form.register('address_line_1')}
              placeholder="e.g., 123 Main Street"
            />
            {form.formState.errors.address_line_1 && (
              <p className="text-sm text-red-500">{form.formState.errors.address_line_1.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line_2">Address Line 2</Label>
            <Input
              id="address_line_2"
              {...form.register('address_line_2')}
              placeholder="e.g., Apt 4B"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                {...form.register('city')}
                placeholder="e.g., San Francisco"
              />
              {form.formState.errors.city && (
                <p className="text-sm text-red-500">{form.formState.errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                {...form.register('state')}
                placeholder="e.g., CA"
              />
              {form.formState.errors.state && (
                <p className="text-sm text-red-500">{form.formState.errors.state.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip_code">ZIP Code *</Label>
              <Input
                id="zip_code"
                {...form.register('zip_code')}
                placeholder="e.g., 94105"
              />
              {form.formState.errors.zip_code && (
                <p className="text-sm text-red-500">{form.formState.errors.zip_code.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              {...form.register('country')}
              placeholder="e.g., USA"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Property Features</CardTitle>
          <CardDescription>Add features and amenities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Property Features</Label>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="e.g., Balcony, City View"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.watch('property_features').map((feature, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(index)}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Images</Label>
            <div className="flex gap-2">
              <Input
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="e.g., https://example.com/image.jpg"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
              />
              <Button type="button" onClick={addImage} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.watch('images').map((image, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  Image {index + 1}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeImage(index)}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Documents</Label>
            <div className="flex gap-2">
              <Input
                value={newDocument}
                onChange={(e) => setNewDocument(e.target.value)}
                placeholder="e.g., https://example.com/document.pdf"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDocument())}
              />
              <Button type="button" onClick={addDocument} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.watch('documents').map((document, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  Document {index + 1}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDocument(index)}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Add contact details for the property</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_name">Contact Name</Label>
              <Input
                id="contact_name"
                {...form.register('contact_info.contact_name')}
                placeholder="e.g., John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                {...form.register('contact_info.contact_email')}
                placeholder="e.g., john@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                {...form.register('contact_info.contact_phone')}
                placeholder="e.g., +1 (555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_company">Company</Label>
              <Input
                id="contact_company"
                {...form.register('contact_info.contact_company')}
                placeholder="e.g., Real Estate Co."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferred_contact_method">Preferred Contact Method</Label>
            <Select
              value={form.watch('contact_info.preferred_contact_method')}
              onValueChange={(value) => form.setValue('contact_info.preferred_contact_method', value as 'email' | 'phone' | 'text')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select contact method" />
              </SelectTrigger>
              <SelectContent>
                {contactMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Configure property display options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_featured"
              checked={form.watch('is_featured')}
              onCheckedChange={(checked) => form.setValue('is_featured', checked as boolean)}
            />
            <Label htmlFor="is_featured">Feature this property</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Property'}
        </Button>
      </div>
    </form>
  );
}
