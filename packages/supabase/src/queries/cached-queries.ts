import { unstable_cache } from "next/cache";
import { cache } from "react";
import { getUserQuery } from ".";
import { createClient } from "../clients/server";
import {
  type GetSearchHistoryParams,
  getFavoriteSearchesQuery,
  getSearchHistoryQuery,
  getSearchLogQuery,
} from "./history";
import {
  getAssetTypesQuery,
  getPlansQuery,
  getUserAssetTypesQuery,
  getUserLocationsQuery,
} from "./onboarding";

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

export const getPlans = async () => {
  const supabase = createClient();

  return unstable_cache(
    async () => {
      return getPlansQuery(supabase);
    },
    ["subscription_plans"],
    {
      tags: ["subscription_plans"],
      revalidate: 180,
    },
  )();
};

export const getSearchHistory = async (params: GetSearchHistoryParams) => {
  const supabase = createClient();

  const user = await getUser();

  if (!user?.data) {
    throw new Error("unauthorized");
  }

  const userId = user.data.id;

  return unstable_cache(
    async () => {
      return getSearchHistoryQuery(supabase, userId, params);
    },
    ["search_history", userId],
    {
      tags: [`search_history_${userId}`],
      revalidate: 180,
    },
    // @ts-expect-error
  )(userId, params);
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

export const getFavoriteSearches = async () => {
  const supabase = createClient();

  const user = await getUser();

  if (!user?.data) {
    throw new Error("unauthorized");
  }

  const userId = user.data.id;

  return unstable_cache(
    async () => {
      return getFavoriteSearchesQuery(supabase, userId);
    },
    ["favorite_searches", userId],
    {
      tags: [`favorite_searches_${userId}`],
      revalidate: 180,
    },
    // @ts-expect-error
  )(userId);
};
