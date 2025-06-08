"use client";

import { checkoutLicenseAction } from "@/actions/checkout";
import { getPropertyCountsAction } from "@/actions/property-count";
import type { locationSchema } from "@/actions/schema";
import { IconCurrencyDollar, IconMapPin } from "@tabler/icons-react";
import { getStripe } from "@v1/stripe/client";
import { Button } from "@v1/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@v1/ui/dialog";
import { Skeleton } from "@v1/ui/skeleton";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import type { z } from "zod";
import { MultiLocationCombobox } from "./multi-location-combobox";

type Location = z.infer<typeof locationSchema>;

interface AddLocationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetType: string;
  assetTypeName: string;
  existingLocationIds: string[];
}

type PropertyCount = {
  resultCount: number;
  formattedLocation: string;
  assetTypeName: string;
  internalId: string;
};

export function AddLocationsDialog({
  open,
  onOpenChange,
  assetType,
  assetTypeName,
  existingLocationIds,
}: AddLocationsDialogProps) {
  const [selected, setSelected] = useState<Location[]>([]);
  const [propertyCounts, setPropertyCounts] = useState<PropertyCount[]>([]);
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);

  const { isPending, executeAsync } = useAction(checkoutLicenseAction);
  const { executeAsync: getPropertyCounts } = useAction(
    getPropertyCountsAction,
  );

  // Fetch property counts when selected locations change
  useEffect(() => {
    if (selected.length === 0) {
      setPropertyCounts([]);
      return;
    }

    const fetchPropertyCounts = async () => {
      setIsLoadingCounts(true);
      try {
        const result = await getPropertyCounts({
          locations: selected.map((loc) => loc.internal_id),
          assetType,
        });

        if (result?.data) {
          setPropertyCounts(result.data);
        }
      } catch (error) {
        console.error("Error fetching property counts:", error);
        setPropertyCounts([]);
      } finally {
        setIsLoadingCounts(false);
      }
    };

    fetchPropertyCounts();
  }, [selected, assetType, getPropertyCounts]);

  const totalPropertyCount = propertyCounts.reduce(
    (sum, count) => sum + count.resultCount,
    0,
  );
  const totalCost = totalPropertyCount * 1; // $1 per property

  // Validation logic
  const hasSelectedLocations = selected.length > 0;
  const hasLoadedCounts =
    !isLoadingCounts && propertyCounts.length === selected.length;
  const hasValidResults = totalPropertyCount > 0;
  const canCheckout =
    hasSelectedLocations && hasLoadedCounts && hasValidResults;

  const handleCheckout = async () => {
    const result = await executeAsync({
      locations: selected.map((loc) => loc.internal_id),
      assetType,
      isAddingLocations: true,
    });

    if (!result?.data?.sessionId) {
      throw new Error("Failed to create checkout session");
    }

    const stripe = await getStripe();
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        sessionId: result.data.sessionId,
      });

      if (error) {
        throw new Error(error.message);
      }
    }
  };

  const handleClose = () => {
    setSelected([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Locations to {assetTypeName}</DialogTitle>
          <DialogDescription>
            Search and select additional locations to add to your{" "}
            {assetTypeName.toLowerCase()} license.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Location Selection */}
          <div>
            <MultiLocationCombobox
              value={selected}
              onValueChange={setSelected}
              placeholder="Search for cities or counties..."
              className="h-12"
            />
          </div>

          {/* Property Count Preview */}
          {selected.length > 0 && (
            <div className="space-y-4">
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Preview Results
              </div>

              {/* Location List with Counts */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selected.map((location) => {
                  const propertyCount = propertyCounts.find(
                    (count) => count.internalId === location.internal_id,
                  );

                  return (
                    <div
                      key={location.internal_id}
                      className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/30 border border-border/50"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary/60" />
                        <span className="text-sm font-medium text-foreground">
                          {location.display_name}
                        </span>
                      </div>
                      <div className="text-xs font-medium">
                        {isLoadingCounts ? (
                          <Skeleton className="h-5 w-16" />
                        ) : propertyCount ? (
                          propertyCount.resultCount > 0 ? (
                            <div className="text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
                              {propertyCount.resultCount.toLocaleString()}{" "}
                              results
                            </div>
                          ) : (
                            <div className="text-warning bg-warning/10 px-2 py-1 rounded border border-warning/20">
                              No results
                            </div>
                          )
                        ) : (
                          <div className="text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                            Loading...
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Validation Info Message */}
              {!isLoadingCounts && hasLoadedCounts && !hasValidResults && (
                <div className="border-t pt-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center mt-0.5">
                        <IconMapPin className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground mb-2">
                          No properties available in selected locations
                        </div>
                        <div className="text-xs text-muted-foreground leading-relaxed">
                          We couldn't find any properties matching your search
                          criteria in these locations. Try selecting different
                          areas for better results.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {selected.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                Select locations to see property counts and pricing
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleCheckout} disabled={isPending || !canCheckout}>
            {isPending ? "Processing..." : "Add Locations"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
