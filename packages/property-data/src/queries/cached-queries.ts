import { createClient } from "@v1/supabase/server";
import { unstable_cache } from "next/cache";
import { getPropertyCountQuery } from ".";
import type { GetPropertySearchParams } from "../providers/realestateapi/types";

export async function getPropertyCount(
  asset_type_slug: string,
  location: string,
  params?: GetPropertySearchParams | null,
) {
  const supabase = createClient();

  return unstable_cache(
    async () => {
      return getPropertyCountQuery(supabase, asset_type_slug, location, params);
    },
    ["property-count", asset_type_slug, location, JSON.stringify(params)],
    {
      tags: ["property-count"],
      revalidate: 180,
    },
    // @ts-expect-error
  )(asset_type_slug, location);
}
