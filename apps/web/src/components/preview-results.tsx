"use client";

import { Button } from "@v1/ui/button";
import { Card, CardContent, CardHeader } from "@v1/ui/card";
import { Skeleton } from "@v1/ui/skeleton";

import { cn } from "@v1/ui/cn";
import { ArrowRightIcon } from "lucide-react";
import { LocationPreviewList } from "./location-preview-list";

interface PropertyCount {
  resultCount: number;
  formattedLocation: string;
  assetTypeName: string;
  internalId: string;
}

interface PreviewResultsProps {
  data: PropertyCount[];
  isLoading: boolean;
  error?: string | null;
  onProceedToCheckout: () => void;
  className?: string;
}

export function PreviewResults({
  data,
  isLoading,
  error,
  onProceedToCheckout,
  className,
}: PreviewResultsProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-4 p-4", className)}>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p>Error loading preview: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-6 p-6", className)}>
      {/* Location Breakdown */}
      <LocationPreviewList locationCounts={data} />

      {/* Call to Action */}
      <div className="pt-4 border-t">
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Ready to access the full property details with owner contact
            information?
          </p>
          <Button
            onClick={onProceedToCheckout}
            size="lg"
            className="w-full sm:w-auto"
          >
            Get Full Results
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
