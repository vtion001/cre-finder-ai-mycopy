import { OnboardingComplete } from "@/components/onboarding/onboarding-complete";
import { OnboardingLayout } from "@/components/onboarding/onboarding-layout";
import { getUser } from "@v1/supabase/cached-queries";
import { Card, CardContent } from "@v1/ui/card";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Setup Complete - CRE Finder AI",
  description: "Your account has been successfully set up",
};

export default async function CompletePage() {
  const cachedUser = await getUser();

  if (!cachedUser?.data) {
    redirect("/login");
  }

  const selectedPlan = cachedUser.data.subscription_plan_id;

  // Check if user has a subscription plan and selected cities
  if (!selectedPlan) {
    redirect("/onboarding");
  }

  return (
    <OnboardingLayout showNextButton={false}>
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardContent className="p-6">
            <OnboardingComplete />
          </CardContent>
        </Card>
      </div>
    </OnboardingLayout>
  );
}
