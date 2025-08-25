"use client";

import { useIsMobile } from "@v1/ui/use-mobile";
import { PreviewResults } from "./preview-results";
import { PreviewResultsSheet } from "./preview-results-sheet";

interface PropertyCount {
  resultCount: number;
  formattedLocation: string;
  assetTypeName: string;
  internalId: string;
}

interface PreviewResultsWrapperProps {
  data: PropertyCount[];
  isLoading: boolean;
  error?: string | null;
  onProceedToCheckout: () => void;
  showPreview: boolean;
  onClosePreview: () => void;
  className?: string;
}

export function PreviewResultsWrapper({
  data,
  isLoading,
  error,
  onProceedToCheckout,
  showPreview,
  onClosePreview,
  className,
}: PreviewResultsWrapperProps) {
  const isMobile = useIsMobile();

  // Don't render anything if preview shouldn't be shown
  if (!showPreview && !isLoading) {
    return null;
  }

  if (isMobile) {
    return (
      <PreviewResultsSheet
        open={showPreview || isLoading}
        onOpenChange={(open) => {
          if (!open) {
            onClosePreview();
          }
        }}
        data={data}
        isLoading={isLoading}
        error={error}
        onProceedToCheckout={onProceedToCheckout}
      />
    );
  }

  // Desktop: show inline
  return (
    <PreviewResults
      data={data}
      isLoading={isLoading}
      error={error}
      onProceedToCheckout={onProceedToCheckout}
      className={className}
    />
  );
}
