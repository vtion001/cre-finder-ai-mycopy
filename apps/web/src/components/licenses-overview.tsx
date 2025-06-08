"use client";

import { IconCreditCard } from "@tabler/icons-react";
import { createStripePortal } from "@v1/stripe/server";
import type { Json } from "@v1/supabase/types";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@v1/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@v1/ui/table";
import { format } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type LicenseWithDetails = {
  id: string;
  asset_type_slug: string;
  search_params: Json;
  is_active: boolean | null;
  expires_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  asset_types: {
    name: string;
    description: string | null;
    slug: string | null;
  };
  location_licenses: Array<{
    id: string;
    location_internal_id: string;
    location_name: string;
    location_type: "city" | "county";
    location_formatted: string;
    location_state: string;
    is_active: boolean | null;
    created_at: string | null;
    result_count: number;
    expires_at: string | null;
  }>;
};

interface LicensesOverviewProps {
  licenses: LicenseWithDetails[] | null;
}

export function LicensesOverview({ licenses }: LicensesOverviewProps) {
  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStripePortalRequest = async () => {
    setIsSubmitting(true);
    const redirectUrl = await createStripePortal(currentPath);
    setIsSubmitting(false);
    return router.push(redirectUrl);
  };

  // Flatten licenses into individual location rows
  const licenseRows =
    licenses?.flatMap((license) =>
      license.location_licenses.map((location) => {
        const now = new Date();
        const expiresAt = location.expires_at
          ? new Date(location.expires_at)
          : null;
        const isExpired = expiresAt && now > expiresAt;
        const isExpiringSoon =
          expiresAt &&
          !isExpired &&
          expiresAt.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000; // 7 days

        let status = "Active";
        let statusColor = "green";

        if (!license.is_active || !location.is_active || isExpired) {
          status = "Expired";
          statusColor = "red";
        } else if (isExpiringSoon) {
          status = "Expiring";
          statusColor = "yellow";
        }

        return {
          assetType: license.asset_types.name,
          assetTypeSlug: license.asset_type_slug,
          locationName: location.location_name,
          locationType: location.location_type,
          locationState: location.location_state,
          status,
          statusColor,
          licensedDate: license.created_at || new Date().toISOString(),
          monthlyFee: location.result_count * 0.5,
          expiresAt: location.expires_at,
        };
      }),
    ) || [];

  if (!licenses || licenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Licensed Locations</CardTitle>
          <CardDescription>
            You don't have any active licenses yet. Start by searching for
            properties and licensing locations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <a href="/dashboard/search">Start Searching</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Group rows by asset type
  const groupedRows = licenseRows.reduce(
    (acc, row) => {
      if (!acc[row.assetType]) {
        acc[row.assetType] = [];
      }
      acc[row.assetType]!.push(row);
      return acc;
    },
    {} as Record<string, typeof licenseRows>,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Licensed Locations
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your property search licenses and billing
          </p>
        </div>
        <Button onClick={handleStripePortalRequest} disabled={isSubmitting}>
          <IconCreditCard className="h-4 w-4 mr-2" />
          Manage Billing
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Licenses</CardTitle>
        </CardHeader>
        <CardContent>
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
              {Object.entries(groupedRows).map(([assetType, rows]) =>
                rows.map((row, index) => (
                  <TableRow
                    key={`${row.assetTypeSlug}-${row.locationName}-${index}`}
                  >
                    <TableCell className="font-medium">
                      {index === 0 ? assetType : ""}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {row.locationType}
                        </Badge>
                        <span>
                          {row.locationName}, {row.locationState}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      <div className="flex flex-col items-end">
                        <span>
                          {format(new Date(row.licensedDate), "MMM d, yyyy")}
                        </span>
                        {row.expiresAt &&
                          (row.status === "Expiring" ||
                            row.status === "Expired") && (
                            <span
                              className={`text-xs ${
                                row.status === "Expiring"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            >
                              {row.status === "Expiring"
                                ? "Expires"
                                : "Expired"}{" "}
                              {format(new Date(row.expiresAt), "MMM d")}
                            </span>
                          )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      ${row.monthlyFee.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            row.statusColor === "green"
                              ? "bg-green-500"
                              : row.statusColor === "yellow"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        />
                        <span
                          className={`text-xs font-medium ${
                            row.statusColor === "green"
                              ? "text-green-700"
                              : row.statusColor === "yellow"
                                ? "text-yellow-700"
                                : "text-red-700"
                          }`}
                        >
                          {row.status}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )),
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
