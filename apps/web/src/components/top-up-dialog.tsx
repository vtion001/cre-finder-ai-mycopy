"use client";

import { createCreditCheckoutSession } from "@/app/actions/credit-checkout";
import { getStripe } from "@v1/stripe/client";
import { Button } from "@v1/ui/button";
import { cn } from "@v1/ui/cn";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@v1/ui/dialog";
import { Input } from "@v1/ui/input";
import { Label } from "@v1/ui/label";
import { useState } from "react";

interface TopUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRESET_AMOUNTS = [50, 100, 150, 200];

export function TopUpDialog({ open, onOpenChange }: TopUpDialogProps) {
  const [customAmount, setCustomAmount] = useState("50.00");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(50);
  const [isLoading, setIsLoading] = useState(false);

  const handlePresetSelect = (amount: number) => {
    setSelectedPreset(amount);
    setCustomAmount(amount.toFixed(2));
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedPreset(null);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handlePay = async () => {
    setIsLoading(true);

    try {
      const creditAmount = Math.round(Number.parseFloat(customAmount));

      if (creditAmount <= 0) {
        throw new Error("Please enter a valid amount");
      }

      // Create Stripe checkout session for credits
      const { sessionId } = await createCreditCheckoutSession(creditAmount);

      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      // Redirect to Stripe checkout
      const stripe = await getStripe();
      const { error } = (await stripe?.redirectToCheckout({ sessionId })) || {};

      if (error) {
        console.error("Stripe redirect error:", error);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setIsLoading(false);
      // You might want to show an error toast here
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add wallet funds
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Manual amount input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm text-muted-foreground">
              Enter amount manually*
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="pl-7 text-base"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Preset amounts */}
          <div className="space-y-3">
            <Label className="text-sm text-muted-foreground">Or Select</Label>
            <div className="grid grid-cols-4 gap-3">
              {PRESET_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => handlePresetSelect(amount)}
                  className={cn(
                    "h-12 text-base font-medium",
                    selectedPreset === amount &&
                      "border-primary bg-primary/5 text-primary",
                  )}
                >
                  ${amount}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1 h-12 text-base font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePay}
            disabled={isLoading}
            className="flex-1 h-12 text-base font-medium bg-muted text-muted-foreground hover:bg-muted/80"
          >
            {isLoading ? "Processing..." : "Pay"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
