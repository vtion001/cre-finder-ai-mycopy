import { CustomerPortalForm } from "@/components/customer-portal";
import { SiteHeader } from "@/components/site-header";
import { getSubscription } from "@v1/supabase/cached-queries";

export const metadata = {
  title: "Billing | Orben",
};

export default async function Page() {
  const subscription = await getSubscription();

  return (
    <>
      <SiteHeader title="Account Settings" />
      <div className="space-y-6 p-6 pb-16">
        <CustomerPortalForm subscription={subscription} />
      </div>
    </>
  );
}
