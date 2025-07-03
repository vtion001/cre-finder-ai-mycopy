import { parsers, searchParamsCache } from "@/lib/nuqs/property-search-params";

import { formatSearchParams } from "@/lib/format";
import { getUseCodeName } from "@/lib/use-codes";
import {
  IconArrowLeft,
  IconBuilding,
  IconCalendar,
  IconFilter,
  IconMapPin,
  IconRuler,
} from "@tabler/icons-react";
import type { GetPropertySearchParams } from "@v1/property-data/types";
import { getPropertyCount } from "@v1/supabase/cached-queries";
import { getAssetType } from "@v1/supabase/cached-queries";
import { Badge } from "@v1/ui/badge";
import { Button, buttonVariants } from "@v1/ui/button";
import { cn } from "@v1/ui/cn";
import Link from "next/link";
import { createSerializer } from "nuqs/server";
import { Suspense } from "react";
import { CheckoutLicenseButton } from "./checkout-license-button";

export async function LicenseWarning({ unlicensed }: { unlicensed: string[] }) {
  const { asset_type, locations, params, use_codes } = searchParamsCache.all();

  const serialize = createSerializer(parsers);

  const serializedParams = serialize({
    locations,
    asset_type,
    params,
    use_codes,
  });

  const { data: assetTypeData } = await getAssetType(asset_type!);

  const formattedUseCodes = use_codes.map((code) => getUseCodeName(code));

  return (
    <div className="absolute inset-0 flex flex-col justify-center z-40 gap-4 px-4 sm:px-0">
      <div className="text-center space-y-2 sm:space-y-3 mb-6 sm:mb-8 mx-auto max-w-xl">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground leading-tight">
          Expand Your {assetTypeData?.name} Search
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          License these locations to unlock property data.
        </p>
      </div>

      <div className="flex flex-wrap justify-center max-w-xl gap-2 sm:gap-3 mx-auto">
        {formattedUseCodes.map((code) => (
          <Badge variant="secondary" key={code}>
            <span className="text-xs text-muted-foreground">{code}</span>
          </Badge>
        ))}
      </div>

      {/* Search Filters Display */}
      {params && Object.keys(params).length > 0 && (
        <div className="flex flex-wrap justify-center max-w-xl gap-2 sm:gap-3 mx-auto mb-6 sm:mb-8">
          {(params.building_size_min || params.building_size_max) && (
            <Badge
              variant="secondary"
              className="bg-blue-50/80 dark:bg-blue-950/30 border-blue-200/50 dark:border-blue-800/30 text-blue-700 dark:text-blue-300"
            >
              <IconBuilding className="h-3 w-3 mr-1.5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs">
                Building Size:{" "}
                {params.building_size_min && params.building_size_max
                  ? `${params.building_size_min.toLocaleString()} - ${params.building_size_max.toLocaleString()} sqft`
                  : params.building_size_min
                    ? `> ${params.building_size_min.toLocaleString()} sqft`
                    : `< ${params.building_size_max?.toLocaleString()} sqft`}
              </span>
            </Badge>
          )}

          {(params.lot_size_min || params.lot_size_max) && (
            <Badge
              variant="secondary"
              className="bg-green-50/80 dark:bg-green-950/30 border-green-200/50 dark:border-green-800/30 text-green-700 dark:text-green-300"
            >
              <IconRuler className="h-3 w-3 mr-1.5 text-green-600 dark:text-green-400" />
              <span className="text-xs">
                Lot Size:{" "}
                {params.lot_size_min && params.lot_size_max
                  ? `${params.lot_size_min.toLocaleString()} - ${params.lot_size_max.toLocaleString()} sqft`
                  : params.lot_size_min
                    ? `> ${params.lot_size_min.toLocaleString()} sqft`
                    : `< ${params.lot_size_max?.toLocaleString()} sqft`}
              </span>
            </Badge>
          )}

          {(params.year_min || params.year_max) && (
            <Badge
              variant="secondary"
              className="bg-purple-50/80 dark:bg-purple-950/30 border-purple-200/50 dark:border-purple-800/30 text-purple-700 dark:text-purple-300"
            >
              <IconCalendar className="h-3 w-3 mr-1.5 text-purple-600 dark:text-purple-400" />
              <span className="text-xs">
                Year Built:{" "}
                {params.year_min && params.year_max
                  ? `${params.year_min} - ${params.year_max}`
                  : params.year_min
                    ? `> ${params.year_min}`
                    : `< ${params.year_max}`}
              </span>
            </Badge>
          )}

          {(params.last_sale_year || params.last_sale_month) && (
            <Badge
              variant="secondary"
              className="bg-orange-50/80 dark:bg-orange-950/30 border-orange-200/50 dark:border-orange-800/30 text-orange-700 dark:text-orange-300"
            >
              <IconCalendar className="h-3 w-3 mr-1.5 text-orange-600 dark:text-orange-400" />
              <span className="text-xs">
                Last Sale:{" "}
                {params.last_sale_month !== undefined && params.last_sale_year
                  ? `${new Date(params.last_sale_year, params.last_sale_month).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
                  : params.last_sale_year
                    ? `${params.last_sale_year}`
                    : "Recent"}
              </span>
            </Badge>
          )}

          {/* Fallback for any other filters */}
          {!params.building_size_min &&
            !params.building_size_max &&
            !params.lot_size_min &&
            !params.lot_size_max &&
            !params.year_min &&
            !params.year_max &&
            !params.last_sale_year &&
            !params.last_sale_month && (
              <Badge variant="secondary">
                <IconFilter className="h-3 w-3 mr-1.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {formatSearchParams(params)}
                </span>
              </Badge>
            )}
        </div>
      )}

      <div className="mx-auto w-full max-w-lg px-2 sm:px-0">
        {/* Location Preview List */}
        <div className="mb-6 sm:mb-8">
          <LocationSearchPreviewList locations={unlicensed} />
        </div>

        {/* Checkout Validation */}
        <Suspense fallback={null}>
          <CheckoutValidation locations={unlicensed} />
        </Suspense>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-center gap-3">
          <Link
            href={`/dashboard/search${serializedParams}`}
            className={cn(
              buttonVariants({
                variant: "ghost",
              }),
              "h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base",
            )}
          >
            <IconArrowLeft className="h-4 w-4" />
            Refine Search
          </Link>

          <Suspense
            fallback={
              <Button
                disabled
                className="h-11 sm:h-12 px-6 sm:px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base"
              >
                Loading...
              </Button>
            }
          >
            <CheckoutLicenseButtonWithValidation locations={unlicensed} />
          </Suspense>
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
  const { asset_type, params, use_codes } = searchParamsCache.all();

  if (!asset_type || !params) {
    return null;
  }

  const { resultCount, formattedLocation } = await getPropertyCount(
    {
      slug: asset_type,
      allowed_use_codes: use_codes!,
    },
    location,
    params,
  );

  return (
    <div className="flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 rounded-md bg-muted/30 border border-border/50">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <div className="w-2 h-2 rounded-full bg-primary/60 flex-shrink-0" />
        <span className="text-xs sm:text-sm font-medium text-foreground truncate">
          {formattedLocation}
        </span>
      </div>
      {resultCount > 0 ? (
        <div className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20 flex-shrink-0">
          {resultCount.toLocaleString()} results
        </div>
      ) : (
        <div className="text-xs font-medium text-warning bg-warning/10 px-2 py-1 rounded border border-warning/20 flex-shrink-0">
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
        <div className="flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 rounded-md bg-muted/20 border border-border/30">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-2 h-2 rounded-full bg-muted animate-pulse flex-shrink-0" />
            <div className="h-3 sm:h-4 w-24 sm:w-32 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-5 sm:h-6 w-12 sm:w-16 bg-muted rounded animate-pulse flex-shrink-0" />
        </div>
      }
    >
      <LocationSearchPreviewServer location={location} />
    </Suspense>
  );
}

async function CheckoutLicenseButtonWithValidation({
  locations,
}: {
  locations: string[];
}) {
  const { asset_type, params, use_codes } = searchParamsCache.all();

  if (locations.length === 0) {
    return (
      <Button
        disabled
        className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        Get Access
      </Button>
    );
  }

  // Get property counts for all locations to check if any have results
  const propertyCounts = await Promise.all(
    locations.map(async (location) => {
      try {
        const { resultCount } = await getPropertyCount(
          {
            slug: asset_type!,
            allowed_use_codes: use_codes!,
          },
          location,
          params,
        );
        return resultCount;
      } catch (error) {
        console.error(`Error getting property count for ${location}:`, error);
        return 0;
      }
    }),
  );

  const totalPropertyCount = propertyCounts.reduce(
    (sum, count) => sum + count,
    0,
  );
  const hasValidResults = totalPropertyCount > 0;

  return (
    <CheckoutLicenseButton
      locations={locations}
      assetType={asset_type!}
      params={params}
      disabled={!hasValidResults}
    />
  );
}

async function CheckoutValidation({ locations }: { locations: string[] }) {
  const { asset_type, params, use_codes } = searchParamsCache.all();

  if (!asset_type || !params || locations.length === 0) {
    return null;
  }

  // Get property counts for all locations
  const propertyCounts = await Promise.all(
    locations.map(async (location) => {
      try {
        const { resultCount } = await getPropertyCount(
          {
            slug: asset_type!,
            allowed_use_codes: use_codes!,
          },
          location,
          params,
        );
        return resultCount;
      } catch (error) {
        console.error(`Error getting property count for ${location}:`, error);
        return 0;
      }
    }),
  );

  const totalPropertyCount = propertyCounts.reduce(
    (sum, count) => sum + count,
    0,
  );
  const hasValidResults = totalPropertyCount > 0;

  if (hasValidResults) {
    return null; // No validation error
  }

  return (
    <div className="mb-4 sm:mb-6">
      <div className="p-3 sm:p-4 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-muted flex items-center justify-center mt-0.5 flex-shrink-0">
            <IconMapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-2">
              No properties available in selected locations
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              We couldn't find any properties matching your search criteria in
              the selected locations. Please adjust your search filters above or
              select different locations to proceed with licensing.
            </div>
          </div>
        </div>
      </div>
    </div>
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
    <div className="space-y-2 max-h-56 sm:max-h-64 overflow-y-auto">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 sm:mb-3 px-1">
        Preview Results
      </div>
      {locations.map((location) => (
        <LocationSearchPreview key={location} location={location} />
      ))}
    </div>
  );
}
