import type { GetPropertySearchParams } from "@/lib/realestateapi";
import { createClient } from "@v1/supabase/server";
import { unstable_cache } from "next/cache";
import { getPropertyCount } from ".";

export async function getPropertyCountCache(
  asset_type_slug: string,
  location: string,
  params: GetPropertySearchParams,
) {
  const supabase = createClient();

  return unstable_cache(
    async () => {
      return getPropertyCount(supabase, asset_type_slug, location, params);
    },
    ["search_preview", asset_type_slug, location, JSON.stringify(params)],
    {
      tags: ["search_preview"],
      revalidate: 180,
    },
    // @ts-expect-error
  )(asset_type_slug, location);
}
