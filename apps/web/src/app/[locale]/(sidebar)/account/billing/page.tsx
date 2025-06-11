import { LicensesOverview } from "@/components/licenses-overview";
import { getAllLicenses } from "@v1/supabase/cached-queries";

export const metadata = {
  title: "Billing | Orben",
};

export default async function Page() {
  const { data } = await getAllLicenses();

  return (
    <>
      <div className="space-y-4 md:space-y-6 p-4 sm:p-6 pb-16">
        {/* @ts-expect-error  */}
        <LicensesOverview licenses={data} />
      </div>
    </>
  );
}
