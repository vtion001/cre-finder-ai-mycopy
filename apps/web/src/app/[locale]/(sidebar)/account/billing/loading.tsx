import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@v1/ui/card";
import { Skeleton } from "@v1/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@v1/ui/table";

export default function BillingLoading() {
  return (
    <>
      <SiteHeader title="Billing" />
      <div className="space-y-4 md:space-y-6 p-4 sm:p-6 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2 min-w-0 flex-1">
            <Skeleton className="h-6 sm:h-8 w-32 sm:w-48" />
            <Skeleton className="h-3 sm:h-4 w-48 sm:w-80" />
          </div>
          <Skeleton className="h-10 w-full sm:w-32" />
        </div>

        {/* Licenses Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              Active Licenses
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right w-36">Licensed</TableHead>
                    <TableHead className="text-right w-24">Fee</TableHead>
                    <TableHead className="text-right w-20">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-24 ml-auto" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-12 ml-auto" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-6 w-16 rounded-full ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
