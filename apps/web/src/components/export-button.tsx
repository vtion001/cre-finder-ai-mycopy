"use client";

import { updateSearchLogStatusAction } from "@/actions/search-history-actions";
import { useState } from "react";

import type { PropertySearchResult } from "@/lib/realestateapi";
import { IconDownload } from "@tabler/icons-react";
import { Button } from "@v1/ui/button";
import { format, isValid, parse } from "date-fns";
import { DownloadIcon } from "lucide-react";
import { revalidateTag } from "next/cache";
import { toast } from "sonner";
import * as XLSX from "xlsx";

interface ExportButtonProps {
  results: PropertySearchResult[];
  searchLogId?: string;
  resultCount: number;
}

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

export function ExportButton({
  results,
  searchLogId,
  resultCount,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  // Handle export to Excel
  const handleExport = async () => {
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
        "Last Sale Date": result.last_sale_date
          ? formatDate(result.last_sale_date)
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

      // Update search log status if searchLogId is provided
      if (searchLogId) {
        try {
          await updateSearchLogStatusAction({
            searchLogId,
            status: "completed",
          });

          // Note: The updateSearchLogStatusAction already revalidates the credit_usage tag,
          // but we're adding this as a fallback in case the server action fails to revalidate
          try {
            // We need to get the user ID to revalidate the credit usage tag
            const response = await fetch("/api/user-id");
            const { userId } = await response.json();
            if (userId) {
              revalidateTag(`credit_usage_${userId}`);
            }
          } catch (e) {
            // Silently fail if we can't get the user ID
            console.error("Failed to revalidate credit usage tag:", e);
          }
        } catch (error) {
          console.error("Failed to update search log status:", error);
          // Don't show error to user as the export was successful
        }
      }

      toast.success("Results exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export results");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-primary/10 text-primary border-primary rounded-md p-4 flex items-center justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <IconDownload className="size-5" />
          <h2 className="text-lg font-semibold leading-3">Ready to export!</h2>
        </div>

        <div className="space-y-3 ml-7">
          <div className="text-sm">
            Export all{" "}
            <span className="font-semibold">
              {resultCount.toLocaleString()}
            </span>{" "}
            properties with complete data fields to Excel.
          </div>
        </div>
      </div>

      <Button
        size="lg"
        onClick={handleExport}
        disabled={isExporting || results.length === 0}
        className="flex items-center gap-1.5"
      >
        <DownloadIcon className="h-3 w-3" />
        {isExporting ? "Exporting..." : "Export to Excel"}
      </Button>
    </div>
  );
}
