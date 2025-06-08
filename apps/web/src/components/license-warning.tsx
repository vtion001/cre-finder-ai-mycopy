import { parsers, searchParamsCache } from "@/lib/nuqs/property-search-params";
import { getPropertyCountCache } from "@/queries/cached";
import { IconArrowLeft, IconMapPin, IconSearch } from "@tabler/icons-react";
import { getAssetType } from "@v1/supabase/cached-queries";
import { buttonVariants } from "@v1/ui/button";
import { cn } from "@v1/ui/cn";
import Link from "next/link";
import { createSerializer } from "nuqs/server";
import { Suspense } from "react";
import { CheckoutLicenseButton } from "./checkout-license-button";

export async function LicenseWarning({ unlicensed }: { unlicensed: string[] }) {
  const { asset_type, locations, params } = searchParamsCache.all();

  const serialize = createSerializer(parsers);

  const serializedParams = serialize({ locations, asset_type, params });

  const { data: assetTypeData } = await getAssetType(asset_type!);

  return (
    <div className="absolute inset-0 flex flex-col justify-center">
      <div className="text-center space-y-3 mb-8 mx-auto max-w-xl">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <IconSearch className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Expand Your {assetTypeData?.name} Search
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          License these locations to unlock property data.
        </p>
      </div>

      {/* Show params */}
      <div className="text-center space-y-3 mb-8 mx-auto max-w-xl">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {JSON.stringify(params)}
        </p>
      </div>

      <div className="mx-auto w-full max-w-lg">
        {/* Location Preview List */}
        <div className="mb-8">
          <LocationSearchPreviewList locations={unlicensed} />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-center gap-3">
          <Link
            href={`/dashboard/search${serializedParams}`}
            className={cn(
              buttonVariants({
                variant: "ghost",
              }),
              "h-12 px-8",
            )}
          >
            <IconArrowLeft className="h-4 w-4" />
            Refine Search
          </Link>

          <CheckoutLicenseButton
            locations={locations}
            assetType={asset_type!}
          />
        </div>
      </div>
    </div>
  );
}

async function LocationSearchPreviewServer({
  location,
}: {
  location: string;
}) {
  const assetType = searchParamsCache.get("asset_type");
  const params = searchParamsCache.get("params");

  if (!assetType || !params) {
    return null;
  }

  const { resultCount, formattedLocation } = await getPropertyCountCache(
    assetType,
    location,
    params,
  );

  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-md bg-muted/30 border border-border/50">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-primary/60" />
        <span className="text-sm font-medium text-foreground">
          {formattedLocation}
        </span>
      </div>
      {resultCount > 0 ? (
        <div className="text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
          {resultCount.toLocaleString()} results
        </div>
      ) : (
        <div className="text-xs font-medium text-destructive bg-secondary/50 px-2 py-1 rounded">
          No results
        </div>
      )}
    </div>
  );
}

function LocationSearchPreview({
  location,
}: {
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
      <LocationSearchPreviewServer location={location} />
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
        <LocationSearchPreview key={location} location={location} />
      ))}
    </div>
  );
}
