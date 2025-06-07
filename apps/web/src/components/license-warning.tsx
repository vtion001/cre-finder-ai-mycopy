import { formatNumber } from "@/lib/format";
import { getPreview } from "@/lib/search";
import { IconArrowLeft } from "@tabler/icons-react";
import { Button } from "@v1/ui/button";
import { Skeleton } from "@v1/ui/skeleton";
import Link from "next/link";
import { Suspense } from "react";
import { CheckoutLicenseButton } from "./checkout-license-button";

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
      <div className="text-center space-y-6 px-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold max-w-3xl">
            Get access to {formatNumber(resultCount)}{" "}
            {assetTypes?.join(", ") || "Asset"} Properties in{" "}
            {formattedLocation}
          </h1>
        </div>

        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
          You need a license to search properties in this location with the
          selected asset types.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Button asChild variant="ghost" className="h-12 px-8">
            <Link href="/dashboard/search">
              <IconArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>

          <CheckoutLicenseButton
            location={location}
            assetTypes={asset_types}
            resultCount={resultCount}
          />
        </div>
      </div>
    </div>
  );
}

function LicenseWarningSkeleton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center space-y-6 px-6">
        <div className="space-y-2">
          <div className="max-w-3xl mx-auto space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-3/4 mx-auto" />
          </div>
        </div>

        <div className="max-w-md mx-auto space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3 mx-auto" />
        </div>

        <div className="flex items-center justify-center gap-4">
          <Skeleton className="h-12 w-28" />
          <Skeleton className="h-12 w-40" />
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
