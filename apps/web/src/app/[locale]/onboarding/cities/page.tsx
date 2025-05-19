import { LocationSearch } from "@/components/location-search";
import { AssetTypeSelection } from "@/components/onboarding/asset-type-selection";
import { OnboardingLayout } from "@/components/onboarding/onboarding-layout";
import { getUser } from "@v1/supabase/cached-queries";
import { getUserAssetTypesQuery } from "@v1/supabase/queries";
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

  const { data: selectedAssetTypes } = await getUserAssetTypesQuery(
    supabase,
    cachedUser.data.id,
  );

  return (
    <OnboardingLayout
      nextButtonDisabled={
        !selectedAssetTypes ||
        selectedAssetTypes.length === 0 ||
        !selectedLocations ||
        selectedLocations.length === 0
      }
      user={cachedUser.data}
    >
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold">
                  Select Your Target Locations
                </h1>
                <p className="text-muted-foreground mt-2">
                  Choose the cities or counties where you want to search for
                  properties
                </p>
              </div>

              <div className="space-y-6">
                <AssetTypeSelection
                  assetTypes={assetTypes ?? []}
                  selectedAssetTypes={selectedAssetTypes ?? []}
                  maxSelections={plan.asset_type_count}
                />

                <LocationSearch
                  selectedLocations={selectedLocations ?? []}
                  maxSelections={plan.county_access === "Single county" ? 1 : 5}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </OnboardingLayout>
  );
}
