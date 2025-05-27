"use client";

import { IconInfoCircle } from "@tabler/icons-react";
import type { Database } from "@v1/supabase/types";
import { Alert, AlertDescription, AlertTitle } from "@v1/ui/alert";
import { Button } from "@v1/ui/button";
import { CreditCardIcon, WalletIcon } from "lucide-react";
import { useState } from "react";
import { TopUpDialog } from "./top-up-dialog";

interface CreditWarningProps {
  resultCount: number;
  creditData: Database["public"]["Functions"]["calculate_user_credit_usage"]["Returns"][0];
}

export function CreditWarning({ resultCount, creditData }: CreditWarningProps) {
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  const creditsNeeded = resultCount - creditData.remaining_credits;

  return (
    <>
      <div className="bg-primary/10 text-primary border-primary rounded-md p-4 flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <IconInfoCircle className="size-5" />
            <h2 className="text-lg font-semibold leading-3"> Almost there!</h2>
          </div>

          <div className="space-y-3 ml-7">
            <div className="text-sm">
              Just{" "}
              <span className="font-semibold">
                {creditsNeeded.toLocaleString()}
              </span>{" "}
              more credits needed to export all{" "}
              <span className="font-semibold">
                {resultCount.toLocaleString()}
              </span>{" "}
              properties.
            </div>
          </div>
        </div>

        <Button
          size="lg"
          onClick={() => setIsTopUpOpen(true)}
          className="flex items-center gap-1.5"
        >
          <CreditCardIcon className="h-3 w-3" />
          Top up
        </Button>
      </div>

      <TopUpDialog
        open={isTopUpOpen}
        onOpenChange={setIsTopUpOpen}
        amount={creditsNeeded}
      />
    </>
  );
}
