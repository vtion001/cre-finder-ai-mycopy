"use client";

import { Button } from "@v1/ui/button";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h3 className="text-lg font-medium">Almost there!</h3>
      <p className="text-muted-foreground mt-1 max-w-md">
        We're preparing your property records. If you don't see anything in a
        few minutes, please refresh the page.
      </p>
      <Button
        className="mt-4"
        variant="outline"
        onClick={() => window.location.reload()}
      >
        Refresh
      </Button>
    </div>
  );
}

export function NoResults() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h3 className="text-lg font-medium">No properties found</h3>
      <p className="text-muted-foreground mt-1 max-w-md">
        No properties match your current search criteria. Try adjusting your
        location selection.
      </p>
    </div>
  );
}
