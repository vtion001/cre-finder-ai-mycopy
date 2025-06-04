import { AccountSettings } from "@/components/account-settings";
import { SiteHeader } from "@/components/site-header";
import {
  getUser,
  getUserAssetTypes,
  getUserLocations,
} from "@v1/supabase/cached-queries";
import { Separator } from "@v1/ui/separator";
import type { Metadata } from "next";

import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Account Settings - CRE Finder AI",
  description: "Manage your account settings and preferences.",
};

export default async function Account() {
  const cachedUser = await getUser();

  if (!cachedUser?.data) {
    redirect("/login");
  }

  const [{ data: assetTypes }, { data: locations }] = await Promise.all([
    getUserAssetTypes(),
    getUserLocations(),
  ]);

  const hasCompletedOnboarding = assetTypes?.length && locations?.length;

  if (!hasCompletedOnboarding) {
    redirect("/onboarding");
  }

  return (
    <>
      <SiteHeader title="Account Settings" />
      <div className="space-y-6 p-6 pb-16">
        <div>
          <p className="text-muted-foreground">
            Manage your account settings and set your email preferences.
          </p>
        </div>
        <Separator />
        <AccountSettings user={cachedUser.data} />
      </div>
    </>
  );
}
