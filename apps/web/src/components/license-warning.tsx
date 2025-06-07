import { parseLocationCode } from "@/lib/format";
import { searchParamsCache } from "@/lib/nuqs/property-search-params";
import { getPropertyCount } from "@/queries";
import { getPropertyCountCache } from "@/queries/cached";
import { IconArrowLeft } from "@tabler/icons-react";
import { buttonVariants } from "@v1/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { CheckoutLicenseButton } from "./checkout-license-button";

export async function LicenseWarning() {
  const assetType = searchParamsCache.get("asset_type");
  const locations = searchParamsCache.get("locations");

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center space-y-6 px-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold max-w-3xl">Expand Your Search</h1>
        </div>

        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
          Get access to 100x more properties by expanding your search to
          surrounding counties.
        </p>

        <LocationSearchPreviewList />

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/dashboard/search"
            className={buttonVariants({
              variant: "ghost",
              className: "h-12 px-8",
            })}
          >
            <IconArrowLeft className="h-4 w-4" />
            Go Back
          </Link>

          <CheckoutLicenseButton locations={locations} assetType={assetType!} />
        </div>
      </div>
    </div>
  );
}

async function LocationSearchPreviewServer({
  assetType,
  location,
}: {
  assetType: string;
  location: string;
}) {
  const { resultCount, formattedLocation } = await getPropertyCountCache(
    assetType,
    location,
  );

  return (
    <div>
      {formattedLocation} - {resultCount} results
    </div>
  );
}

function LocationSearchPreview({
  assetType,
  location,
}: {
  assetType: string;
  location: string;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LocationSearchPreviewServer assetType={assetType} location={location} />
    </Suspense>
  );
}

async function LocationSearchPreviewList() {
  const assetType = searchParamsCache.get("asset_type");
  const locations = searchParamsCache.get("locations");

  if (!assetType || locations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {locations.map((location) => (
        <LocationSearchPreview
          key={location}
          assetType={assetType}
          location={location}
        />
      ))}
    </div>
  );
}
