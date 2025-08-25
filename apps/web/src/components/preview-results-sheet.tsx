"use client";

import { Button } from "@v1/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@v1/ui/sheet";
import { Skeleton } from "@v1/ui/skeleton";

import { ArrowRightIcon, CheckCircleIcon } from "lucide-react";
import { LocationPreviewList } from "./location-preview-list";

interface PropertyCount {
  resultCount: number;
  formattedLocation: string;
  assetTypeName: string;
  internalId: string;
}

interface PreviewResultsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: PropertyCount[];
  isLoading: boolean;
  error?: string | null;
  onProceedToCheckout: () => void;
}

export function PreviewResultsSheet({
  open,
  onOpenChange,
  data,
  isLoading,
  error,
  onProceedToCheckout,
}: PreviewResultsSheetProps) {
  const totalProperties =
    data?.reduce((sum, item) => sum + item.resultCount, 0) || 0;

  const handleProceedToCheckout = () => {
    onProceedToCheckout();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-green-600" />
            Search Preview Results
          </SheetTitle>
          <SheetDescription>
            Preview of properties found matching your search criteria
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
              <Skeleton className="h-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">
              <p>Error loading preview: {error}</p>
            </div>
          ) : data && data.length > 0 ? (
            <>
              {/* Location Breakdown */}
              <LocationPreviewList locationCounts={data} />

              {/* Call to Action */}
              <div className="pt-4 border-t space-y-4">
                <div className="text-center space-y-3">
                  <Button
                    onClick={handleProceedToCheckout}
                    size="lg"
                    className="w-full"
                  >
                    Get Full Results
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No results found for your search criteria.</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
