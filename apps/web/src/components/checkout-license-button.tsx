"use client";

import { checkoutLicenseAction } from "@/actions/checkout";
import { getStripe } from "@v1/stripe/client";
import { Button } from "@v1/ui/button";
import { toast } from "@v1/ui/sonner";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";

interface CheckoutLicenseButtonProps {
  location: string;
  assetTypes: string[];
  resultCount: number;
  redirectPath?: string;
}

export function CheckoutLicenseButton({
  location,
  assetTypes,
  resultCount,
  redirectPath = "/dashboard/search",
}: CheckoutLicenseButtonProps) {
  const { isPending } = useAction(checkoutLicenseAction);

  const handleCheckout = async () => {
    const result = await checkoutLicenseAction({
      locationId: location,
      assetTypeSlugs: assetTypes,
      resultCount,
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

  return (
    <Button
      onClick={handleCheckout}
      disabled={isPending}
      className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      {isPending ? "Loading..." : "Get Access"}
    </Button>
  );
}
