import { unstable_cache } from "next/cache";
import { cache } from "react";
import { getUserQuery } from ".";
import { createClient } from "../clients/server";
import { getCreditTransactionsQuery, getUserCreditUsageQuery } from "./credits";
import { getRecentSearchActivityQuery, getSearchLogQuery } from "./history";
import {
  getAssetTypesQuery,
  getUserAssetTypesQuery,
  getUserLocationsQuery,
} from "./onboarding";
import { getPropertyRecordsBySearchLogQuery } from "./records";
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

export const getUserAssetTypes = async () => {
  const supabase = createClient();

  const user = await getUser();

  if (!user?.data) {
    throw new Error("unauthorized");
  }

  const userId = user.data.id;

  return unstable_cache(
    async () => {
      return getUserAssetTypesQuery(supabase, userId);
    },
    ["asset_types", userId],
    {
      tags: [`asset_types_${userId}`],
      revalidate: 180,
    },
    // @ts-expect-error
  )(userId);
};

export const getUserLocations = async () => {
  const supabase = createClient();

  const user = await getUser();

  if (!user?.data) {
    throw new Error("unauthorized");
  }

  const userId = user.data.id;

  return unstable_cache(
    async () => {
      return getUserLocationsQuery(supabase, userId);
    },
    ["user_locations", userId],
    {
      tags: [`user_locations_${userId}`],
      revalidate: 180,
    },
    // @ts-expect-error
  )(userId);
};

export const getSearchLog = async (searchLogId: string) => {
  const supabase = createClient();

  return unstable_cache(
    async () => {
      return getSearchLogQuery(supabase, searchLogId);
    },
    ["search_log", searchLogId],
    {
      tags: [`search_log_${searchLogId}`],
      revalidate: 180,
    },
    // @ts-expect-error
  )(searchLogId);
};

export const getRecentSearchActivity = async () => {
  const supabase = createClient();

  const user = await getUser();

  if (!user?.data) {
    throw new Error("unauthorized");
  }

  const userId = user.data.id;

  return unstable_cache(
    async () => {
      return getRecentSearchActivityQuery(supabase, userId);
    },
    ["recent_search_activity", userId],
    {
      tags: [`search_history_${userId}`],
      revalidate: 180,
    },
    // @ts-expect-error
  )(userId);
};

export const getUserCreditUsage = async () => {
  const supabase = createClient();

  const user = await getUser();

  if (!user?.data) {
    throw new Error("unauthorized");
  }

  const userId = user.data.id;

  return unstable_cache(
    async () => {
      return getUserCreditUsageQuery(supabase);
    },
    ["credit_usage", userId],
    {
      tags: [`credit_usage_${userId}`, `search_history_${userId}`],
      revalidate: 1, // Shorter revalidation time for credit usage
    },
    // @ts-expect-error
  )(userId);
};

export const getCreditTransactions = async () => {
  const supabase = createClient();

  const user = await getUser();

  if (!user?.data) {
    throw new Error("unauthorized");
  }

  const userId = user.data.id;

  return unstable_cache(
    async () => {
      return getCreditTransactionsQuery(supabase);
    },
    ["credit_transactions", userId],
    {
      tags: [`credit_usage_${userId}`],
      revalidate: 60, // Cache for 1 minute
    },
    // @ts-expect-error
  )(userId);
};

export const getSubscription = async () => {
  const supabase = createClient();
  const user = await getUser();

  if (!user?.data) {
    return null;
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

export const getPropertyRecordsBySearchLog = async () => {
  const supabase = createClient();

  const user = await getUser();

  if (!user?.data) {
    throw new Error("unauthorized");
  }

  const userId = user.data.id;

  return unstable_cache(
    async () => {
      return getPropertyRecordsBySearchLogQuery(supabase, userId);
    },
    ["property_records_by_search_log", userId],
    {
      tags: [
        `property_records_by_search_log_${userId}`,
        `property_records_${userId}`,
        `search_history_${userId}`,
      ],
      revalidate: 180,
    },
    // @ts-expect-error
  )(userId);
};
