import { getPropertyCountQuery } from "@v1/property-data/queries";
import type { GetPropertySearchParams } from "@v1/property-data/types";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import {
  type GetPropertyRecordsParams,
  getAssetTypeQuery,
  getAssetTypesQuery,
  getPropertyRecordsQuery,
  getUserQuery,
} from ".";
import { createClient } from "../clients/server";
import {
  getAllLicensesQuery,
  getAssetTypeLicensesQuery,
  getLicenseAvailabilityQuery,
  getUserLicensesByAssetTypeQuery,
} from "./licenses";
import { getSubscriptionQuery } from "./stripe";

export const getSession = cache(async () => {
  const supabase = createClient();

  return supabase.auth.getSession();
});

export const getUser = async () => {
  const {
    data: { session },
  } = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const supabase = createClient();

  return unstable_cache(
    async () => {
      return getUserQuery(supabase, userId);
    },
    ["user", userId],
    {
      tags: [`user_${userId}`],
      revalidate: 180,
    },
    // @ts-expect-error
  )(userId);
};

export const getAssetTypes = async () => {
  const supabase = createClient();

  return unstable_cache(
    async () => {
      return getAssetTypesQuery(supabase);
    },
    ["asset_types"],
    {
      tags: ["asset_types"],
      revalidate: 180,
    },
  )();
};

export const getAssetType = async (slug: string) => {
  const supabase = createClient();

  return unstable_cache(
    async () => {
      return getAssetTypeQuery(supabase, slug);
    },
    ["asset_type", slug],
    {
      tags: ["asset_type"],
      revalidate: 3600,
    },
  )();
};

export const getSubscription = async () => {
  const supabase = createClient();
  const user = await getUser();

  if (!user?.data) {
    return { data: null };
  }

  return unstable_cache(
    async () => {
      return getSubscriptionQuery(supabase);
    },
    ["subscriptions", user.data.id],
    {
      tags: [`subscriptions_${user.data.id}`],
      revalidate: 3600,
    },
  )();
};

export async function getUserLicensesByAssetType() {
  const supabase = createClient();

  const user = await getUser();

  if (!user?.data) {
    return { data: null };
  }

  const userId = user.data.id;

  return unstable_cache(
    async () => {
      return getUserLicensesByAssetTypeQuery(supabase, userId);
    },
    ["user_licenses_by_asset_type", userId],
    {
      tags: [`licenses_${userId}`],
      revalidate: 180,
    },
  )();
}

export async function getAllLicenses() {
  const supabase = createClient();

  const user = await getUser();

  if (!user?.data) {
    return { data: null };
  }

  const userId = user.data.id;

  return unstable_cache(
    async () => {
      return getAllLicensesQuery(supabase, userId);
    },
    ["licenses", userId],
    {
      tags: [`licenses_${userId}`],
      revalidate: 180,
    },
  )();
}

export async function getAssetTypeLicenses(assetTypeSlug: string) {
  const supabase = createClient();

  return unstable_cache(
    async () => {
      return getAssetTypeLicensesQuery(supabase, assetTypeSlug);
    },
    ["licenses", assetTypeSlug],
    {
      tags: [`licenses_${assetTypeSlug}`],
      revalidate: 180,
    },
  )();
}

export async function getPropertyRecords(params: GetPropertyRecordsParams) {
  const supabase = createClient();

  return unstable_cache(
    async () => {
      return getPropertyRecordsQuery(supabase, params);
    },
    ["property_records", params.assetLicenseId],
    {
      tags: [`property_records_${params.assetLicenseId}`],
      revalidate: 180,
    },
    // @ts-expect-error
  )(params);
}

export async function getPropertyCount(
  asset_type: {
    slug: string;
    allowed_use_codes: number[];
  },
  location: string,
  params?: GetPropertySearchParams | null,
) {
  const supabase = createClient();

  const { data: assetType } = await supabase
    .from("asset_types")
    .select("*")
    .eq("slug", asset_type.slug)
    .single();

  if (!assetType || !assetType.slug) {
    throw new Error("Asset type not found");
  }

  const filteredUseCodes =
    asset_type.allowed_use_codes.length > 0
      ? assetType.use_codes?.filter((code) =>
          asset_type.allowed_use_codes.includes(code),
        )
      : assetType.use_codes;

  return unstable_cache(
    async () => {
      return getPropertyCountQuery(
        {
          slug: assetType.slug!,
          name: assetType.name,
          use_codes: filteredUseCodes || [],
        },
        location,
        params,
      );
    },
    ["property-count", location, JSON.stringify({ asset_type, params })],
    {
      tags: ["property-count"],
      revalidate: 180,
    },
    // @ts-expect-error
  )(asset_type, location);
}

export async function getLicenseAvailability(
  assetTypeSlug: string,
  locationInternalIds: string[],
) {
  const supabase = createClient();

  return unstable_cache(
    async () => {
      return getLicenseAvailabilityQuery(
        supabase,
        assetTypeSlug,
        locationInternalIds,
      );
    },
    ["licenses", assetTypeSlug, JSON.stringify(locationInternalIds)],
    {
      tags: [`licenses_${assetTypeSlug}`],
      revalidate: 180,
    },
    // @ts-expect-error
  )(assetTypeSlug, locationInternalIds);
}
