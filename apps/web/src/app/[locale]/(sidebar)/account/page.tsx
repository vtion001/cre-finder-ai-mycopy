import { AccountSettings } from "@/components/account-settings";
import { SiteHeader } from "@/components/site-header";
import { getUser } from "@v1/supabase/cached-queries";
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

  return (
    <>
      <SiteHeader title="Account Settings" />
      <div className="p-6 pb-16">
        <AccountSettings user={cachedUser.data} />
      </div>
    </>
  );
}
