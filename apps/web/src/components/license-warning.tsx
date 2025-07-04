import {
  parsers,
  searchParamsCache,
} from "@v1/utils/nuqs/property-search-params";

import {
  IconArrowLeft,
  IconBuilding,
  IconCalendar,
  IconFilter,
  IconMapPin,
  IconRuler,
} from "@tabler/icons-react";
import type { GetPropertySearchParams } from "@v1/property-data/types";
import {
  getLicenseAvailability,
  getPropertyCount,
} from "@v1/supabase/cached-queries";
import { getAssetType } from "@v1/supabase/cached-queries";
import { Badge } from "@v1/ui/badge";
import { buttonVariants } from "@v1/ui/button";
import { cn } from "@v1/ui/cn";
import { formatSearchParams } from "@v1/utils/format";
import { getUseCodeName } from "@v1/utils/use-codes";
import Link from "next/link";
import { createSerializer } from "nuqs/server";
import { CheckoutLicenseButton } from "./checkout-license-button";

async function getPropertyCountsForLocations(
  locations: string[],
  asset_type: string,
  use_codes: number[],
  params: GetPropertySearchParams | null,
) {
  const counts = await Promise.all(
    locations.map(async (location) => {
      try {
        const { resultCount, formattedLocation } = await getPropertyCount(
          {
            slug: asset_type,
            allowed_use_codes: use_codes,
          },
          location,
          params,
        );
        return { location, resultCount, formattedLocation };
      } catch (error) {
        console.error(`Error getting property count for ${location}:`, error);
        return { location, resultCount: 0, formattedLocation: location };
      }
    }),
  );

  const totalCount = counts.reduce(
    (sum, { resultCount }) => sum + resultCount,
    0,
  );

  return { counts, totalCount };
}

export async function LicenseWarning() {
  const { asset_type, locations, params, use_codes } = searchParamsCache.all();

  const serialize = createSerializer(parsers);

  const serializedParams = serialize({
    locations,
    asset_type,
    params,
    use_codes,
  });

  const { data: assetTypeData } = await getAssetType(asset_type!);
  const { data: availability } = await getLicenseAvailability(
    asset_type!,
    locations,
  );

  const formattedUseCodes = use_codes.map((code) => getUseCodeName(code));

  // Get property counts once for all locations
  const { counts, totalCount } = await getPropertyCountsForLocations(
    locations,
    asset_type!,
    use_codes!,
    params,
  );

  const hasValidResults = totalCount > 0;
  const isAnyLocationTaken = availability?.isAnyTaken || false;

  return (
    <div className="absolute inset-0 flex flex-col justify-center z-40 gap-4 px-4 sm:px-0">
      <div className="text-center space-y-2 sm:space-y-3 mb-6 sm:mb-8 mx-auto max-w-xl">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground leading-tight">
          {isAnyLocationTaken
            ? "License Already Taken"
            : `Expand Your ${assetTypeData?.name} Search`}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isAnyLocationTaken
            ? "Sorry, it looks like someone already has this licensed."
            : "License these locations to unlock property data."}
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
          <LocationSearchPreviewList locationCounts={counts} />
        </div>

        {/* Checkout Validation */}
        <CheckoutValidation
          hasValidResults={hasValidResults}
          isAnyLocationTaken={isAnyLocationTaken}
        />

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
            {isAnyLocationTaken ? "Go Back" : "Refine Search"}
          </Link>

          {!isAnyLocationTaken && (
            <CheckoutLicenseButton
              locations={locations}
              assetType={asset_type!}
              params={params}
              disabled={!hasValidResults}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Simplified component that receives pre-computed counts
function LocationSearchPreview({
  resultCount,
  formattedLocation,
}: {
  location: string;
  resultCount: number;
  formattedLocation: string;
}) {
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

function CheckoutValidation({
  hasValidResults,
  isAnyLocationTaken,
}: {
  hasValidResults: boolean;
  isAnyLocationTaken: boolean;
}) {
  // Show license taken message first (highest priority)
  if (isAnyLocationTaken) {
    return (
      <div className="mb-4 sm:mb-6">
        <div className="p-3 sm:p-4 rounded-lg bg-warning/10 border border-warning/20">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-warning/20 flex items-center justify-center mt-0.5 flex-shrink-0">
              <IconMapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-warning" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-2">
                License already taken
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                One or more of the selected locations are already licensed by
                another user. Please select different locations or refine your
                search criteria.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show no results message if no valid results
  if (!hasValidResults) {
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
                the selected locations. Please adjust your search filters above
                or select different locations to proceed with licensing.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null; // No validation error
}

function LocationSearchPreviewList({
  locationCounts,
}: {
  locationCounts: Array<{
    location: string;
    resultCount: number;
    formattedLocation: string;
  }>;
}) {
  if (locationCounts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">No locations selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-56 sm:max-h-64 overflow-y-auto">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 sm:mb-3 px-1">
        Preview Results
      </div>
      {locationCounts.map(({ location, resultCount, formattedLocation }) => (
        <LocationSearchPreview
          key={location}
          location={location}
          resultCount={resultCount}
          formattedLocation={formattedLocation}
        />
      ))}
    </div>
  );
}
