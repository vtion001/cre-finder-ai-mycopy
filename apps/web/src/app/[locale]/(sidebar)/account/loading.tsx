import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@v1/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@v1/ui/card";
import { Separator } from "@v1/ui/separator";

export default function AccountLoading() {
  return (
    <>
      <SiteHeader title="Account Settings" />
      <div className="space-y-6 p-6 pb-16">
        <div>
          <Skeleton className="h-4 w-80" />
        </div>
        <Separator />
        
        {/* Account Settings Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Profile Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-9 w-20" />
              </div>
              
              <Separator />
              
              {/* Email Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-9 w-20" />
              </div>
              
              <Separator />
              
              {/* Phone Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-9 w-20" />
              </div>
            </CardContent>
          </Card>

          {/* Security & Preferences Card */}
          <Card>
            <CardHeader>
              <CardTitle>Security & Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-9 w-32" />
              </div>
              
              <Separator />
              
              {/* Locations Section */}
              <div className="space-y-4">
                <Skeleton className="h-5 w-24" />
                <div className="space-y-2">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-8 w-8" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-9 w-28" />
              </div>
              
              <Separator />
              
              {/* Asset Types Section */}
              <div className="space-y-4">
                <Skeleton className="h-5 w-20" />
                <div className="flex flex-wrap gap-2">
                  {Array(4).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-20 rounded-full" />
                  ))}
                </div>
                <Skeleton className="h-9 w-32" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
