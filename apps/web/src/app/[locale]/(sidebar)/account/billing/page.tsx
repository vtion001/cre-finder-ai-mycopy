import { LicensesOverview } from "@/components/licenses-overview";
import { getUserLicensesWithDetails } from "@v1/supabase/cached-queries";

export const metadata = {
  title: "Billing | Orben",
};

export default async function Page() {
  const { data: licenses } = await getUserLicensesWithDetails();

  return (
    <>
      <div className="space-y-6 p-6 pb-16">
        <LicensesOverview licenses={licenses} />
      </div>
    </>
  );
}
