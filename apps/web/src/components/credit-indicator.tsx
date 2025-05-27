"use client";

import type { Database } from "@v1/supabase/types";
import { Button } from "@v1/ui/button";
import { cn } from "@v1/ui/cn";
import { PlusIcon, WalletIcon } from "lucide-react";
import { useState } from "react";
import { TopUpDialog } from "./top-up-dialog";

export function CreditIndicator({
  credits,
}: {
  credits: Database["public"]["Functions"]["calculate_user_credit_usage"]["Returns"][0];
}) {
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  const isLowCredits = credits.remaining_credits < 100;

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Credit display */}
        <div className="flex items-center gap-2 border bg-background text-sm h-10 rounded-md px-4 py-2">
          <WalletIcon className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {credits.remaining_credits.toLocaleString()}
          </span>
        </div>

        {/* Add funds button */}
        <Button
          variant={isLowCredits ? "default" : "outline"}
          size="lg"
          onClick={() => setIsTopUpOpen(true)}
          className={cn("flex items-center gap-1.5")}
        >
          <PlusIcon className="h-3 w-3" />
          {isLowCredits ? "Add funds" : ""}
        </Button>
      </div>

      <TopUpDialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen} />
    </>
  );
}
