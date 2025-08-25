'use client';

import type { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PropertyDialogProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export default function PropertyDialog({ property, isOpen, onClose }: PropertyDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Property Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Property Image</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              <p className="font-medium">{property.address}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Owner</h3>
              <p className="font-medium">{property.owner}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Contact Info</h3>
              <p className="font-medium">{property.contactInfo}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Type</h3>
              <p className="font-medium">{property.type}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Sq Ft</h3>
              <p className="font-medium">{property.sqFt}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Assessed Value</h3>
              <p className="font-medium">{property.assessedValue}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Outbound System</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>SMS</span>
                <span className="font-medium">$1.23</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>Voicemail Call</span>
                <span className="font-medium">$1.37</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>Email Campaign</span>
                <span className="font-medium">$0.85</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>Direct Mail</span>
                <span className="font-medium">$2.70</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <span className="font-semibold">Total</span>
              <span className="font-semibold text-lg">$6.15</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Send Campaign
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


