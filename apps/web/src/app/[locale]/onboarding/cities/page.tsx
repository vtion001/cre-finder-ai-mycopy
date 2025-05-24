import { productMetadataSchema } from "@/actions/schema";
import { LocationSearch } from "@/components/location-search";
import { AssetTypeSelection } from "@/components/onboarding/asset-type-selection";
import { OnboardingLayout } from "@/components/onboarding/onboarding-layout";
import {
  getAssetTypes,
  getSubscription,
  getUser,
  getUserAssetTypes,
  getUserLocations,
} from "@v1/supabase/cached-queries";
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

  const subscription = await getSubscription();

  if (!subscription) {
    redirect("/onboarding");
  }

  const metadata = productMetadataSchema.parse(
    subscription.prices?.products?.metadata,
  );

  const { data: assetTypes } = await getAssetTypes();
  const { data: selectedLocations } = await getUserLocations();
  const { data: selectedAssetTypes } = await getUserAssetTypes();

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
                  maxSelections={metadata.asset_type_count}
                />

                <LocationSearch
                  selectedLocations={selectedLocations ?? []}
                  maxSelections={
                    metadata.county_access === "Single county" ? 1 : 5
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </OnboardingLayout>
  );
}
