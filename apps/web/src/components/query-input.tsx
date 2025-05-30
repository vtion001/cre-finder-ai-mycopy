"use client";

import { Input } from "@v1/ui/input";
import { useQueryState } from "nuqs";
import { IconSearch } from "@tabler/icons-react";

export function QueryInput({ placeholder }: { placeholder?: string }) {
  const [q, setQ] = useQueryState("q");

  return (
    <div className="relative">
      <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={q ?? undefined}
        onChange={(e) => setQ(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
