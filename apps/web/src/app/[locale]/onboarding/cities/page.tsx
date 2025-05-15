import { LocationSelection } from "@/components/onboarding/location-selection";
import { OnboardingLayout } from "@/components/onboarding/onboarding-layout";
import { getUser } from "@v1/supabase/cached-queries";
import { createClient } from "@v1/supabase/server";
import { Card, CardContent } from "@v1/ui/card";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Select Locations - CRE Finder AI",
  description:
    "Choose the cities or counties where you want to search for properties",
};

export default async function LocationsPage() {
  const cachedUser = await getUser();

  if (!cachedUser?.data) {
    redirect("/login");
  }

  const selectedPlan = cachedUser.data.subscription_plan_id;

  if (!selectedPlan) {
    redirect("/onboarding");
  }

  const supabase = createClient();

  const { data: plan } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("id", selectedPlan)
    .single();

  if (!plan) {
    redirect("/onboarding");
  }

  const { data: assetTypes } = await supabase
    .from("asset_types")
    .select("*")
    .order("name");

  const { data: selectedLocations } = await supabase
    .from("user_locations")
    .select("*")
    .eq("user_id", cachedUser.data.id);

  const selectedAssetType = cachedUser.data.selected_asset_type_id;

  return (
    <OnboardingLayout
      nextButtonDisabled={!selectedAssetType || selectedLocations?.length === 0}
      user={cachedUser.data}
    >
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardContent className="p-6">
            <LocationSelection
              plan={plan}
              assetTypes={assetTypes ?? []}
              selectedAssetType={selectedAssetType}
              selectedLocations={selectedLocations ?? []}
            />
          </CardContent>
        </Card>
      </div>
    </OnboardingLayout>
  );
}
