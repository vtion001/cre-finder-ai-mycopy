"use client";

import { checkoutLicenseAction } from "@/actions/checkout";
import type { locationSchema } from "@/actions/schema";
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
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
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

export function AddLocationsDialog({
  open,
  onOpenChange,
  assetType,
  assetTypeName,
  existingLocationIds,
}: AddLocationsDialogProps) {
  const [selected, setSelected] = useState<Location[]>([]);

  const { isPending, executeAsync } = useAction(checkoutLicenseAction);

  const handleCheckout = async () => {
    const result = await executeAsync({
      locations: selected.map((loc) => loc.internal_id),
      assetType,
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
      <DialogContent className="sm:max-w-md ">
        <DialogHeader>
          <DialogTitle>Add Locations to {assetTypeName}</DialogTitle>
          <DialogDescription>
            Search and select additional locations to add to your{" "}
            {assetTypeName.toLowerCase()} license.
          </DialogDescription>
        </DialogHeader>

        <div className="py-10">
          <MultiLocationCombobox
            value={selected}
            onValueChange={setSelected}
            placeholder="Search for cities or counties..."
            className="h-12"
          />
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleCheckout}
            disabled={isPending || selected.length === 0}
          >
            {isPending ? "Processing..." : "Add Locations"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
