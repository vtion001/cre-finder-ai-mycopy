import { ErrorBoundary } from "@/components/error-boundary";
import { getPropertyRecords } from "@v1/supabase/cached-queries";
import { searchParamsCache } from "@v1/utils/nuqs/property-search-params";
import { Suspense } from "react";
import { PropertyMap } from "./property-map";

export async function PropertyMapServer({
  assetLicenseId,
  locationCodes,
}: { assetLicenseId: string; locationCodes: string[] }) {
  const map = searchParamsCache.get("map");

  const dataPromise = getPropertyRecords({
    assetLicenseId,
    locationCodes,
    to: 100,
    from: 0,
  });

  return (
    map && (
      <div className="lg:sticky lg:top-6 lg:h-fit">
        <ErrorBoundary
          fallback={
            <div className="h-[calc(100vh-7rem)] bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">
                Map temporarily unavailable
              </p>
            </div>
          }
        >
          <Suspense
            key={JSON.stringify({ assetLicenseId, locationCodes })}
            fallback={
              <div className="h-[calc(100vh-7rem)] bg-muted rounded-lg animate-pulse" />
            }
          >
            <PropertyMap
              dataPromise={dataPromise}
              className="h-[calc(100vh-7rem)]"
            />
          </Suspense>
        </ErrorBoundary>
      </div>
    )
  );
}
