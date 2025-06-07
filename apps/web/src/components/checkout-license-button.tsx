"use client";

import { getStripe } from "@v1/stripe/client";
import { Button } from "@v1/ui/button";
import { toast } from "@v1/ui/sonner";
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
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      // Create checkout session
      const response = await fetch("/api/checkout/license", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location,
          assetTypes,
          resultCount,
          redirectPath,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.sessionId) {
        // Redirect to Stripe checkout
        const stripe = await getStripe();
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({
            sessionId: data.sessionId,
          });

          if (error) {
            throw new Error(error.message);
          }
        } else {
          throw new Error("Stripe failed to load");
        }
      } else {
        throw new Error("No session ID returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to start checkout",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      {isLoading ? "Loading..." : "Get Access"}
    </Button>
  );
}
