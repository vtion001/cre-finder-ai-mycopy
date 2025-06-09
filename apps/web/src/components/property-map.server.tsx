import { ErrorBoundary } from "@/components/error-boundary";
import { searchParamsCache } from "@/lib/nuqs/property-search-params";
import { getPropertyRecords } from "@v1/supabase/cached-queries";
import { Suspense } from "react";
import { PropertyMap } from "./property-map";

export async function PropertyMapServer({
  assetLicenseId,
}: { assetLicenseId: string }) {
  const map = searchParamsCache.get("map");

  const { data: records } = await getPropertyRecords(assetLicenseId);

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
            fallback={
              <div className="h-[calc(100vh-7rem)] bg-muted rounded-lg animate-pulse" />
            }
          >
            <PropertyMap
              records={records || []}
              className="h-[calc(100vh-7rem)]"
            />
          </Suspense>
        </ErrorBoundary>
      </div>
    )
  );
}
