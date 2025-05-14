"use client";

import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import { cn } from "@v1/ui/cn";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@v1/ui/collapsible";
import { ArrowLeftIcon, RefreshCwIcon } from "lucide-react";
import { useState } from "react";

import { PlacesCombobox } from "./places-combobox";

export function PropertySearchInterface() {
  const [searchQuery, setSearchQuery] = useState("");

  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  const [activeFilterCount, setActiveFilterCount] = useState(0);

  return (
    <div className="flex flex-col space-y-6 p-6 bg-gray-50">
      <Collapsible
        open={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
        className="w-full"
      >
        <div className="flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="p-0 flex items-center gap-2 hover:bg-transparent"
            >
              <h2 className="text-lg font-medium">Filters & search criteria</h2>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={cn(
                  "transform transition-transform",
                  isFiltersOpen ? "rotate-180" : "",
                )}
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </CollapsibleTrigger>
        </div>

        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <span>Properties in the city of</span>
          {searchQuery && (
            <Badge
              variant="outline"
              className="ml-2 bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200"
            >
              {searchQuery} {activeFilterCount > 0 && `+${activeFilterCount}`}
            </Badge>
          )}
        </div>

        <CollapsibleContent className="mt-4">
          <div className="bg-white rounded-md p-4 shadow-sm border">
            <PlacesCombobox />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
