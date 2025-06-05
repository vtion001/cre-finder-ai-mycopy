import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@v1/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@v1/ui/card";
import { Separator } from "@v1/ui/separator";

export default function BillingLoading() {
  return (
    <>
      <SiteHeader title="Account Settings" />
      <div className="space-y-6 p-6 pb-16">
        {/* Current Subscription Card */}
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Plan Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-12" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-18" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Billing Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Skeleton className="h-9 w-40" />
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-36" />
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Card */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-12" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-9 w-36" />
          </CardContent>
        </Card>

        {/* Billing History Card */}
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 pb-3 border-b">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-16" />
            </div>
            
            {/* Table Rows */}
            <div className="space-y-3 pt-3">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="grid grid-cols-4 gap-4 py-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-18" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Portal */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-80" />
            <Skeleton className="h-9 w-48" />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
