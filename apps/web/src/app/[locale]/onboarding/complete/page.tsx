import { OnboardingComplete } from "@/components/onboarding/onboarding-complete";
import { OnboardingLayout } from "@/components/onboarding/onboarding-layout";
import {
  getUser,
  getUserAssetTypes,
  getUserLocations,
} from "@v1/supabase/cached-queries";
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

  const [{ data: assetTypes }, { data: locations }] = await Promise.all([
    getUserAssetTypes(),
    getUserLocations(),
  ]);

  const hasCompletedOnboarding = assetTypes?.length && locations?.length;

  if (!hasCompletedOnboarding) {
    redirect("/onboarding");
  }

  return (
    <OnboardingLayout showNextButton={false} user={cachedUser.data}>
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
