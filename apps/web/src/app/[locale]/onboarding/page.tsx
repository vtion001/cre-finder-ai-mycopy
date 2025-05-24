import { productMetadataSchema } from "@/actions/schema";
import { OnboardingLayout } from "@/components/onboarding/onboarding-layout";
import { PricingSelection } from "@/components/onboarding/pricing-selection";
import { getSubscription, getUser } from "@v1/supabase/cached-queries";
import { createClient } from "@v1/supabase/client";
import { getProductsQuery } from "@v1/supabase/stripe";
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

  const [products, subscription] = await Promise.all([
    getProductsQuery(supabase),
    getSubscription(),
  ]);

  const parsedProducts = products?.map((product) => {
    const parsedMetadata = productMetadataSchema.parse(product.metadata);
    return {
      ...product,
      metadata: parsedMetadata,
    };
  });

  return (
    <OnboardingLayout
      showBackButton={false}
      nextButtonDisabled={!subscription}
      user={cachedUser.data}
    >
      <div className="max-w-screen-lg mx-auto p-6">
        <PricingSelection
          user={cachedUser.data}
          products={parsedProducts ?? []}
          subscription={subscription}
        />
      </div>
    </OnboardingLayout>
  );
}
