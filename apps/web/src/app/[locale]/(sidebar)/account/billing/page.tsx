import { LicensesOverview } from "@/components/licenses-overview";
import { SiteHeader } from "@/components/site-header";
import {
  getAllLicenses,
  getUser,
  getUserLicensesByAssetType,
} from "@v1/supabase/cached-queries";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Billing | Orben",
};

export default async function Page() {
  const { data } = await getAllLicenses();
  const cachedUser = await getUser();

  if (!cachedUser?.data) {
    redirect("/login");
  }

  const { data: licenses } = await getUserLicensesByAssetType();

  return (
    <>
      <SiteHeader
        title="Billing"
        user={cachedUser.data}
        licenses={licenses || []}
        showMobileDrawer={true}
      />
      <div className="space-y-4 md:space-y-6 p-4 sm:p-6 pb-16">
        {/* @ts-expect-error  */}
        <LicensesOverview licenses={data} />
      </div>
    </>
  );
}
