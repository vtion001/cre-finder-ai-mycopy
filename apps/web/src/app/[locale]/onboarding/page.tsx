import { OnboardingLayout } from "@/components/onboarding/onboarding-layout";
import { PricingSelection } from "@/components/onboarding/pricing-selection";
import { getUser } from "@v1/supabase/cached-queries";
import { createClient } from "@v1/supabase/client";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Choose Your Plan - CRE Finder AI",
  description: "Select a subscription plan that fits your investment needs",
};

export default async function OnboardingPage() {
  const cachedUser = await getUser();

  if (!cachedUser?.data) {
    redirect("/login");
  }

  const supabase = createClient();

  const { data } = await supabase
    .from("subscription_plans")
    .select("*")
    .order("max_searches");

  const selectedPlan = cachedUser.data.subscription_plan_id;

  return (
    <OnboardingLayout showBackButton={false} nextButtonDisabled={!selectedPlan}>
      <div className="max-w-screen-lg mx-auto p-6">
        <PricingSelection plans={data ?? []} selectedPlan={selectedPlan} />
      </div>
    </OnboardingLayout>
  );
}
