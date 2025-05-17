"use client";

import { useState } from "react";

import type { PropertySearchResult } from "@/lib/realestateapi";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import { Skeleton } from "@v1/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@v1/ui/table";
import { format, isValid, parse } from "date-fns";
import { BuildingIcon, DownloadIcon, VerifiedIcon } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

// Helper function to format dates from yyyy-MM-dd to a more readable format
const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";

  try {
    // Parse the date string in yyyy-MM-dd format
    const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());

    // Check if the date is valid
    if (!isValid(parsedDate)) return dateString;

    // Format the date in a more readable format (e.g., "Jan 15, 2023")
    return format(parsedDate, "MMM d, yyyy");
  } catch (error) {
    // If there's an error parsing the date, return the original string
    return dateString;
  }
};

interface SearchResultsProps {
  isLoading?: boolean;
  results: PropertySearchResult[];
}

export function SearchResults({ results, isLoading }: SearchResultsProps) {
  const [isExporting, setIsExporting] = useState(false);

  // Handle export to Excel
  const handleExport = () => {
    if (results.length === 0) return;

    setIsExporting(true);

    try {
      // Format data for Excel with all requested fields
      const exportData = results.map((result) => ({
        // Basic Property Info
        "Property ID": result.propertyId,
        Address: result.address.address,
        City: result.address.city || "",
        State: result.address.state,
        Zip: result.address.zip,
        County: result.address.county || "",

        // Owner Information
        "Owner 1 First Name": result.owner1FirstName || "",
        "Owner 1 Last Name": result.owner1LastName || "",
        "Owner 2 First Name": result.owner2FirstName || "",
        "Owner 2 Last Name": result.owner2LastName || "",
        "Owner 1 Type": result.corporateOwned ? "Corporate" : "Individual",
        "Owner 2 Type": result.owner2FirstName ? "Individual" : "",
        "Owner Occupied": result.ownerOccupied ? "Yes" : "No",

        // Mailing Address
        "Mailing Address": result.mailAddress?.address || "",
        "Mailing City": result.mailAddress?.city || "",
        "Mailing State": result.mailAddress?.state || "",
        "Mailing Zip": result.mailAddress?.zip || "",

        // Property Details
        "Property Use": result.propertyUse || "",
        "Property Use Code": result.propertyUseCode || "",
        "Property Type": result.propertyType || "",
        "Land Use": result.landUse || "",
        "Lot Sq. Feet": result.lotSquareFeet || 0,
        "Building Sq. Feet": result.squareFeet || 0,
        "Year Built": result.yearBuilt || 0,
        Bedrooms: result.bedrooms || 0,
        Bathrooms: result.bathrooms || 0,
        Stories: result.stories || 0,

        // Financial Information
        "Last Sale Date": result.lastSaleDate
          ? formatDate(result.lastSaleDate)
          : "",
        "Last Sale Amount": result.lastSaleAmount || "",
        "Assessed Value": result.assessedValue || 0,
        "Estimated Value": result.estimatedValue || 0,
        "Lender Name": result.lenderName || "",
        "Loan Amount": result.lastMortgage1Amount || "",
        "Loan Type": result.loanTypeCode || "",
        "Interest Rate": result.adjustableRate ? "Adjustable" : "Fixed",
        "Loan Recording Date": result.recordingDate
          ? formatDate(result.recordingDate)
          : "",
        "Maturity Date": result.maturityDateFirst
          ? formatDate(result.maturityDateFirst)
          : "",
        "Mortgage Balance": result.openMortgageBalance || 0,
        "High Equity": result.highEquity ? "Yes" : "No",
        "Equity %": result.equityPercent || 0,

        // Skip Trace Information (placeholder fields as they don't exist in the API)
        "Skip Trace Name":
          `${result.owner1FirstName || ""} ${result.owner1LastName || ""}`.trim() ||
          "N/A",
        "Skip Trace Phone": "N/A", // Not available in the API
        "Skip Trace Email": "N/A", // Not available in the API
        "Skip Trace Most Recent Address": result.mailAddress?.address || "N/A",

        // Additional Information
        Latitude: result.latitude || "",
        Longitude: result.longitude || "",
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Properties");

      // Generate Excel file with timestamp
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .substring(0, 19);
      XLSX.writeFile(workbook, `CREfinder_PropertySearch_${timestamp}.xlsx`);

      toast.success("Results exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export results");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="space-y-2">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
        </div>
      </div>
    );
  }

  // If no results found
  if (results.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <BuildingIcon className="mx-auto mb-2 h-12 w-12 opacity-20" />
        <p>No properties found.</p>
        <p className="text-sm mt-2">
          Try adjusting your filters or search for a different city
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end items-center p-4 border-b">
        <Button
          onClick={handleExport}
          disabled={isExporting || results.length === 0}
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <DownloadIcon className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Export All Fields to Excel"}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[300px]">Address</TableHead>
            <TableHead className="whitespace-nowrap w-[120px]">Owner</TableHead>
            <TableHead>Property Use</TableHead>
            <TableHead className="text-right whitespace-nowrap w-[120px]">
              Building Size
            </TableHead>
            <TableHead className="text-right whitespace-nowrap w-[100px]">
              Lot Size
            </TableHead>
            <TableHead className="whitespace-nowrap w-[100px]">
              Last Sale
            </TableHead>
            <TableHead>Financial</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.id}>
              {/* Address */}
              <TableCell>
                <div>
                  <div className="font-medium flex items-center gap-1">
                    {result.address.street || result.address.address}
                    <VerifiedIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {result.address.city || result.mailAddress?.city || ""},{" "}
                    {result.address.state} {result.address.zip}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    ID: {result.propertyId}
                  </div>
                </div>
              </TableCell>

              {/* Owner */}
              <TableCell className="whitespace-nowrap">
                <div>
                  {result.owner1FirstName && result.owner1LastName ? (
                    <div className="font-medium">
                      {result.owner1FirstName} {result.owner1LastName}
                    </div>
                  ) : (
                    <div className="text-muted-foreground">Unknown</div>
                  )}
                  {result.owner2FirstName && result.owner2LastName && (
                    <div className="text-sm text-muted-foreground">
                      {result.owner2FirstName} {result.owner2LastName}
                    </div>
                  )}
                  <div className="flex gap-1 mt-1">
                    {result.ownerOccupied && (
                      <Badge variant="outline" className="text-xs py-0 h-5">
                        Occupied
                      </Badge>
                    )}
                    {result.corporateOwned && (
                      <Badge variant="outline" className="text-xs py-0 h-5">
                        Corp
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>

              {/* Property Use */}
              <TableCell>
                <div className="text-sm">
                  {result.propertyUse || result.landUse || "N/A"}
                  {result.propertyUseCode && (
                    <div className="text-xs text-muted-foreground">
                      Code: {result.propertyUseCode}
                    </div>
                  )}
                </div>
              </TableCell>

              {/* Building Size */}
              <TableCell className="text-right whitespace-nowrap">
                {result.squareFeet ? (
                  <div className="font-medium">
                    {result.squareFeet.toLocaleString()} sq ft
                  </div>
                ) : (
                  <div className="text-muted-foreground">N/A</div>
                )}
              </TableCell>

              {/* Lot Size */}
              <TableCell className="text-right whitespace-nowrap">
                {result.lotSquareFeet ? (
                  <div className="font-medium">
                    {result.lotSquareFeet.toLocaleString()} sq ft
                  </div>
                ) : (
                  <div className="text-muted-foreground">N/A</div>
                )}
              </TableCell>

              {/* Last Sale */}
              <TableCell className="whitespace-nowrap">
                <div>
                  {result.lastSaleDate ? (
                    <div className="font-medium">
                      {formatDate(result.lastSaleDate)}
                    </div>
                  ) : (
                    <div className="text-muted-foreground">N/A</div>
                  )}
                  {result.lastSaleAmount && (
                    <div className="text-sm text-muted-foreground">
                      ${result.lastSaleAmount}
                    </div>
                  )}
                </div>
              </TableCell>

              {/* Financial */}
              <TableCell>
                <div className="flex flex-col gap-1">
                  {result.highEquity && (
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/20 border-primary/30">
                      High Equity
                    </Badge>
                  )}
                  {result.lenderName && (
                    <div className="text-xs text-muted-foreground">
                      Lender: {result.lenderName}
                    </div>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
