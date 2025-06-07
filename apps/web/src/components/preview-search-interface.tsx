"use client";

import type { propertySearchSchema } from "@/actions/schema";
import { PropertySearchForm } from "@/components/forms/property-search-form";
import { parseLocationCode } from "@/lib/format";
import { parsers } from "@/lib/nuqs/property-search-params";
import { IconArrowRight } from "@tabler/icons-react";
import type { Tables } from "@v1/supabase/types";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import type { z } from "zod";

type PropertySearchFormValues = z.infer<typeof propertySearchSchema>;

interface PreviewSearchInterfaceProps {
  assetTypes: Tables<"asset_types">[];
  combos: Tables<"user_licensed_combinations">[];
}

export function PreviewSearchInterface({
  assetTypes,
  combos,
}: PreviewSearchInterfaceProps) {
  const [_, setState] = useQueryStates(parsers);

  const handleSubmit = (values: PropertySearchFormValues) => {
    setState(
      {
        locations: values.locations.map((loc) => loc.internal_id),
        asset_type: values.asset_type_slug,
      },
      { shallow: false },
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-foreground mb-3">
          Find commercial real estate, faster.
        </h1>
      </div>

      {/* Search Form */}
      <PropertySearchForm
        assetTypes={assetTypes}
        onSubmit={handleSubmit}
        className="space-y-4"
      />

      {/* Recent Searches Section */}
      {combos.length > 0 && (
        <div className="mt-8 text-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            RECENT SEARCHES
          </h3>
          <div className="space-y-2 w-max mx-auto">
            {combos.map((combo) => {
              const l = parseLocationCode(combo.location_id!);
              const formattedLocation = `${l.city || l.county}, ${l.state}`;

              const href = `/dashboard/search?locations=${combo.location_id}&asset_type=${combo.asset_type_slugs?.[0]}`;

              return (
                <Link href={href} key={combo.license_id}>
                  <div className="group hover:underline text-sm text-muted-foreground flex items-center gap-1.5 ">
                    {formattedLocation} | {combo.asset_type_names?.[0]}
                    <IconArrowRight className="h-4 w-4 hidden group-hover:block" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
