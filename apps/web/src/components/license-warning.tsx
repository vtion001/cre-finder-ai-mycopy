import { searchParamsCache } from "@/lib/nuqs/property-search-params";
import { getPropertyCountCache } from "@/queries/cached";
import { IconArrowLeft, IconMapPin, IconSearch } from "@tabler/icons-react";
import { buttonVariants } from "@v1/ui/button";
import { cn } from "@v1/ui/cn";
import Link from "next/link";
import { Suspense } from "react";
import { CheckoutLicenseButton } from "./checkout-license-button";

export async function LicenseWarning({ unlicensed }: { unlicensed: string[] }) {
  const assetType = searchParamsCache.get("asset_type");
  const locations = searchParamsCache.get("locations");

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="mx-auto w-full max-w-lg">
        <div className="p-8">
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <IconSearch className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">
              Expand Your Search
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              License these locations to unlock property data for your{" "}
              {assetType} search.
            </p>
          </div>

          {/* Location Preview List */}
          <div className="mb-8">
            <LocationSearchPreviewList locations={unlicensed} />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:justify-center gap-3">
            <Link
              href={`/dashboard/search?asset_type=${assetType}`}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                }),
                "h-12 px-8",
              )}
            >
              <IconArrowLeft className="h-4 w-4" />
              Modify Search
            </Link>

            <CheckoutLicenseButton
              locations={locations}
              assetType={assetType!}
            />
          </div>
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
    <div className="flex items-center justify-between py-3 px-4 rounded-md bg-muted/30 border border-border/50">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-primary/60" />
        <span className="text-sm font-medium text-foreground">
          {formattedLocation}
        </span>
      </div>
      <div className="text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
        {resultCount.toLocaleString()} results
      </div>
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
    <Suspense
      fallback={
        <div className="flex items-center justify-between py-3 px-4 rounded-md bg-muted/20 border border-border/30">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-muted animate-pulse" />
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-6 w-16 bg-muted rounded animate-pulse" />
        </div>
      }
    >
      <LocationSearchPreviewServer assetType={assetType} location={location} />
    </Suspense>
  );
}

async function LocationSearchPreviewList({
  locations,
}: { locations: string[] }) {
  const assetType = searchParamsCache.get("asset_type");

  if (!assetType || locations.length === 0) {
    return (
      <div className="text-center py-8">
        <IconMapPin className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No locations selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 px-1">
        Unlicensed Locations ({locations.length})
      </div>
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
