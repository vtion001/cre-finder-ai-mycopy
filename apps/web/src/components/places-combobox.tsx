"use client";

import { getPlacesAction } from "@/actions/get-places-action";
import type { placeSuggestionSchema } from "@/actions/schema";

import { useDebounce } from "@v1/ui/use-debounce";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@v1/ui/command";
import { DeleteIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import type React from "react";
import { useEffect, useState } from "react";
import type { z } from "zod";
type PlaceSuggestion = z.infer<typeof placeSuggestionSchema>;

export function PlacesCombobox() {
  const router = useRouter();
  const [_, setPlace] = useQueryState("place");
  const [query, setQuery] = useState<string | undefined>();
  const [selectedOption, setSelectedOption] =
    useState<PlaceSuggestion | null>();

  const {
    execute,
    isPending: isLoading,
    result: { data },
  } = useAction(getPlacesAction);

  const debounced = useDebounce(query, 500);

  useEffect(() => {
    if (debounced?.trim()) {
      execute({ query: debounced, countryCode: "US" });
    }
  }, [debounced]);

  const handleClear = () => {
    setQuery("");
    setSelectedOption(null);
  };

  const [open, setOpen] = useState(false);

  return selectedOption ? (
    <div className="flex items-center border-b px-3 rounded-md border relative">
      <div className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50">
        {selectedOption.description}
      </div>
      <button
        type="reset"
        onClick={handleClear}
        className="shrink-0 size-9 absolute right-0 flex items-center justify-center hover:opacity-60"
      >
        <DeleteIcon className="size-4" />
      </button>
    </div>
  ) : (
    <Command
      shouldFilter={false}
      className="overflow-visible relative [&_[cmdk-input-wrapper]]:rounded-md [&_[cmdk-input-wrapper]]:border"
    >
      <CommandInput
        value={query}
        onValueChange={setQuery}
        onBlur={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        placeholder="Enter address or MLS Number"
      />

      {open && (
        <div className="relative animate-in fade-in-0 zoom-in-95 h-auto">
          <CommandList>
            <div className="absolute top-1.5 z-50 w-full">
              <CommandGroup className="relative h-auto z-50 min-w-[8rem] overflow-hidden rounded-md border shadow-md bg-background">
                {isLoading && !data ? (
                  <div className="flex items-center flex-col justify-center space-y-2 py-4">
                    Searching...
                  </div>
                ) : (
                  data?.map((prediction) => (
                    <CommandItem
                      value={prediction.description}
                      onSelect={() => {
                        setQuery(prediction.description);
                        setSelectedOption(prediction);
                      }}
                      className="flex select-text flex-col cursor-pointer gap-0.5 h-max p-2 px-3 rounded-md aria-selected:bg-accent aria-selected:text-accent-foreground hover:bg-accent hover:text-accent-foreground items-start"
                      key={prediction.place_id}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {prediction.description}
                    </CommandItem>
                  ))
                )}

                {!isLoading && data?.length === 0 && (
                  <CommandEmpty className="h-12 py-4 flex items-center justify-center">
                    {query === ""
                      ? "Please enter an address"
                      : "No address found"}
                  </CommandEmpty>
                )}
              </CommandGroup>
            </div>
          </CommandList>
        </div>
      )}
    </Command>
  );
}
