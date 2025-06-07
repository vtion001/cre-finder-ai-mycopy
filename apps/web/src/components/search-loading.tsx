import { Card } from "@v1/ui/card";
import { cn } from "@v1/ui/cn";
import { Skeleton } from "@v1/ui/skeleton";

export function SearchLoading({ isEmpty = false }: { isEmpty?: boolean }) {
  return (
    <div className={cn(isEmpty && "pointer-events-none blur-[7px]")}>
      <div className="space-y-6">
        {/* Top Controls Bar 
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">

          <div className="flex-1 max-w-lg">
            <Skeleton className="h-10 w-full" />
          </div>

     
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-24" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-10" />
            </div>
          </div>
        </div>*/}

        {/* Main Content Area */}
        <div className="grid gap-6 lg:grid-cols-[1fr,480px]">
          {/* Table Section */}
          <div className="min-w-0">
            <div className="h-[calc(100vh-7rem)] w-full rounded-md border">
              {/* Table Header */}
              <div className="grid grid-cols-6 gap-4 p-4 border-b bg-secondary">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>

              {/* Table Rows */}
              <div className="space-y-0">
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-6 gap-4 p-4 border-b last:border-b-0"
                    >
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="lg:sticky lg:top-6 lg:h-fit">
            <Card className="h-[calc(100vh-7rem)] bg-muted/20">
              <div className="flex items-center justify-center h-full">
                <Skeleton className="h-8 w-32" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
