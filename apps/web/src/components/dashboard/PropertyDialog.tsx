'use client';

import { useState } from 'react';
import type { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CheckCircle, XCircle, AlertCircle, Phone } from 'lucide-react';

interface PropertyDialogProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export default function PropertyDialog({ property, isOpen, onClose }: PropertyDialogProps) {
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<null | {
    vapi: { success: boolean; message: string };
    twilio: { success: boolean; message: string };
    overallSuccess: boolean;
  }>(null);

  const handleSendCampaign = async () => {
    setIsSending(true);
    setResult(null);
    try {
      const res = await fetch('/api/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property }),
      });
      const data = await res.json();
      setResult(data);
      if (data?.overallSuccess) {
        setTimeout(() => {
          onClose();
          setIsSending(false);
          setResult(null);
        }, 2500);
      } else {
        setIsSending(false);
      }
    } catch (e) {
      setResult({
        vapi: { success: false, message: 'Failed to send campaign' },
        twilio: { success: false, message: 'Failed to send campaign' },
        overallSuccess: false,
      });
      setIsSending(false);
    }
  };

  const Icon = ({ ok }: { ok: boolean }) => ok ? (
    <CheckCircle className="h-5 w-5 text-green-500" />
  ) : (
    <XCircle className="h-5 w-5 text-red-500" />
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Property Details</DialogTitle>
          <DialogDescription>
            View property information and send outreach via VAPI calls and Twilio SMS.
          </DialogDescription>
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
              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
              <p className="font-medium flex items-center"><Phone className="h-4 w-4 mr-1" />{property.phone}</p>
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

          {result && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold">Campaign Results</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon ok={result.vapi.success} />
                    <span>VAPI Call</span>
                  </div>
                  <span className="text-sm text-gray-600">{result.vapi.message}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon ok={result.twilio.success} />
                    <span>Twilio SMS</span>
                  </div>
                  <span className="text-sm text-gray-600">{result.twilio.message}</span>
                </div>
                {!result.overallSuccess && (
                  <div className="flex items-center space-x-2 text-amber-600">
                    <AlertCircle className="h-5 w-5" />
                    <span>Campaign failed. Please check your configuration.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isSending}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSendCampaign} disabled={isSending}>
              {isSending ? 'Sending...' : 'Send Campaign'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


