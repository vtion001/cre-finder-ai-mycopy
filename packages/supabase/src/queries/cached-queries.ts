import { unstable_cache } from "next/cache";
import { cache } from "react";
import { getAssetTypesQuery, getUserQuery } from ".";
import { createClient } from "../clients/server";
import { checkUserLicenseComboQuery, getLicensedCombosQuery } from "./licenses";
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

export async function checkUserLicenseCombo(
  locationId: string,
  assetTypes: string[],
) {
  const supabase = createClient();

  const user = await getUser();

  if (!user?.data) {
    throw new Error("unauthorized");
  }

  const userId = user.data.id;

  return unstable_cache(
    async () => {
      return checkUserLicenseComboQuery(
        supabase,
        userId,
        locationId,
        assetTypes,
      );
    },
    ["licenses", userId],
    {
      tags: [`licenses_${userId}`],
      revalidate: 180,
    },
    // @ts-expect-error
  )(userId, locationId, assetTypes);
}

export async function getLicensedCombos() {
  const supabase = createClient();

  const user = await getUser();

  if (!user?.data) {
    throw new Error("unauthorized");
  }

  const userId = user.data.id;

  return unstable_cache(
    async () => {
      return getLicensedCombosQuery(supabase, userId);
    },
    ["licenses", userId],
    {
      tags: [`licenses_${userId}`],
      revalidate: 180,
    },
    // @ts-expect-error
  )(userId);
}
