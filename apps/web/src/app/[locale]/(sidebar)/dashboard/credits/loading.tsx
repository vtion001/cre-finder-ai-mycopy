import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@v1/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@v1/ui/card";
import { IconCreditCard, IconTrendingUp, IconWallet } from "@tabler/icons-react";

export default function CreditsLoading() {
  return (
    <>
      <SiteHeader title="Credits" />
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 pb-16">
        <div className="mx-auto flex w-full flex-col space-y-6">
          {/* Credit Stats Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Current Balance */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Current Balance
                </CardTitle>
                <IconWallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>

            {/* Credits Used */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Credits Used
                </CardTitle>
                <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-1" />
                <Skeleton className="h-3 w-28" />
              </CardContent>
            </Card>

            {/* Monthly Limit */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Limit
                </CardTitle>
                <IconCreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          </div>

          {/* Credit Usage Display */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-9 w-28" />
              </div>
            </CardContent>
          </Card>

          {/* Credit Transactions Table */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent>
              {/* Table Header */}
              <div className="grid grid-cols-5 gap-4 pb-3 border-b">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-18" />
              </div>
              
              {/* Table Rows */}
              <div className="space-y-3 pt-3">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="grid grid-cols-5 gap-4 py-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
