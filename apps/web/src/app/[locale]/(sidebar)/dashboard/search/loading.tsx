import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@v1/ui/skeleton";
import { Card, CardContent, CardHeader } from "@v1/ui/card";

export default function SearchLoading() {
  return (
    <>
      <SiteHeader title="Property Search" />
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 pb-16">
        {/* Credit Warning Skeleton */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-64" />
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
          </CardContent>
        </Card>

        {/* Search Form Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Asset Type and Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Filter Section */}
            <div className="space-y-4">
              <Skeleton className="h-5 w-24" />
              
              {/* Filter Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-end">
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>

        {/* Results Section Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
