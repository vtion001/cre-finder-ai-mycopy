import { SiteHeader } from "@/components/site-header";
import { Separator } from "@v1/ui/separator";
import { Skeleton } from "@v1/ui/skeleton";

export default function AccountLoading() {
  return (
    <>
      <SiteHeader title="Account Settings" />
      <div className="p-4 sm:p-6 pb-16">
        {/* Account Settings */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Profile Information Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>

            <div className="space-y-8">
              {/* Name Section */}
              <div className="space-y-4">
                <Skeleton className="h-5 w-20" />
                <div className="flex gap-4">
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 w-20" />
                </div>
                <Skeleton className="h-3 w-64" />
              </div>

              <Separator />

              {/* Email Section */}
              <div className="space-y-4">
                <Skeleton className="h-5 w-24" />
                <div className="flex gap-4">
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 w-20" />
                </div>
                <Skeleton className="h-3 w-72" />
              </div>

              <Separator />

              {/* Phone Section */}
              <div className="space-y-4">
                <Skeleton className="h-5 w-28" />
                <div className="flex gap-4">
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 w-20" />
                </div>
                <Skeleton className="h-3 w-80" />
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-96" />
                <Skeleton className="h-12 w-40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
