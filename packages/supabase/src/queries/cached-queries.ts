import { unstable_cache } from "next/cache";
import { cache } from "react";
import { getAssetTypeQuery, getAssetTypesQuery, getUserQuery } from ".";
import { createClient } from "../clients/server";
import {
  getAssetTypeLicensesQuery,
  getUserLicensesByAssetTypeQuery,
  getUserLicensesQuery,
  getUserLicensesWithDetailsQuery,
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
      revalidate: 180,
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

export async function getUserLicenses(assetTypeSlug: string) {
  const supabase = createClient();

  const user = await getUser();

  if (!user?.data) {
    return { data: null };
  }

  const userId = user.data.id;

  return unstable_cache(
    async () => {
      return getUserLicensesQuery(supabase, userId, assetTypeSlug);
    },
    ["user_licenses", userId, assetTypeSlug],
    {
      tags: [`licenses_${userId}`],
      revalidate: 180,
    },
  )();
}

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

export async function getUserLicensesWithDetails() {
  const supabase = createClient();

  const user = await getUser();

  if (!user?.data) {
    return { data: null };
  }

  const userId = user.data.id;

  return unstable_cache(
    async () => {
      return getUserLicensesWithDetailsQuery(supabase, userId);
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
