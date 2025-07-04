"use client";

import { Button } from "@v1/ui/button";
import { CheckIcon, XIcon } from "lucide-react";

interface FilterActionsProps {
  onApply?: () => void;
  onReset?: () => void;
  showApply?: boolean;
  showReset?: boolean;
  className?: string;
}

export function FilterActions({
  onApply,
  onReset,
  showApply = true,
  showReset = true,
  className = "",
}: FilterActionsProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {showApply && (
        <Button type="button" onClick={onApply}>
          <CheckIcon className="!size-2.5" />
          Apply
        </Button>
      )}
      {showReset && (
        <Button type="button" variant="ghost" onClick={onReset}>
          <XIcon className="!size-3" />
          Reset
        </Button>
      )}
    </div>
  );
}
