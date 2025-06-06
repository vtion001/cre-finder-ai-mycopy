import { getPreview } from "@/lib/search";
import { Skeleton } from "@v1/ui/skeleton";
import { Suspense } from "react";

interface LicenseWarningProps {
  location: string;
  asset_types: string[];
}

async function LicenseWarningServer({
  location,
  asset_types,
}: LicenseWarningProps) {
  const { resultCount, formattedLocation, assetTypes } = await getPreview(
    asset_types,
    location,
  );

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center space-y-4 px-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            {resultCount} {assetTypes?.join(", ") || "Asset"} Properties Found
            in {formattedLocation}
          </h1>
          <h2 className="text-xl font-semibold text-destructive">
            License Required
          </h2>
        </div>

        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
          You need a license to search properties in this location with the
          selected asset types.
        </p>
      </div>
    </div>
  );
}

function LicenseWarningSkeleton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center space-y-4 px-6">
        <div className="space-y-3">
          <Skeleton className="h-9 w-48 mx-auto" />
          <Skeleton className="h-6 w-32 mx-auto" />
        </div>
        <Skeleton className="h-12 w-64 mx-auto" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40 mx-auto" />
          <Skeleton className="h-4 w-36 mx-auto" />
        </div>
      </div>
    </div>
  );
}

export function LicenseWarning({ location, asset_types }: LicenseWarningProps) {
  return (
    <Suspense fallback={<LicenseWarningSkeleton />}>
      <LicenseWarningServer location={location} asset_types={asset_types} />
    </Suspense>
  );
}
