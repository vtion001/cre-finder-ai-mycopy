"use client";

import { useState } from "react";

import {
  IconDatabaseExport,
  IconDownload,
  IconFileDownload,
  IconFileExport,
} from "@tabler/icons-react";
import type { Tables } from "@v1/supabase/types";
import { Button } from "@v1/ui/button";
import { format, isValid, parse } from "date-fns";
import { DownloadIcon } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

interface ExportButtonProps {
  data: Tables<"property_records">[];
  assetTypeName: string;
}

const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";

  try {
    const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());

    if (!isValid(parsedDate)) return dateString;

    return format(parsedDate, "MMM d, yyyy");
  } catch (error) {
    return dateString;
  }
};

export function DownloadButton({ data, assetTypeName }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  // Handle export to Excel
  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Format data for Excel with all requested fields
      const exportData = data.map((result) => ({
        // Basic Property Info
        "Property ID": result.property_id,
        Address: result.address,
        City: result.city || "",
        State: result.state,
        Zip: result.zip,
        County: result.county || "",

        // Owner Information
        "Owner 1 First Name": result.owner1_first_name || "",
        "Owner 1 Last Name": result.owner1_last_name || "",
        "Owner 2 First Name": result.owner2_first_name || "",
        "Owner 2 Last Name": result.owner2_last_name || "",
        "Owner 1 Type": result.corporate_owned ? "Corporate" : "Individual",
        "Owner 2 Type": result.owner2_first_name ? "Individual" : "",
        "Owner Occupied": result.owner_occupied ? "Yes" : "No",

        // Mailing Address
        "Mailing Address": result.mail_address || "",
        "Mailing City": result.mail_city || "",
        "Mailing State": result.mail_state || "",
        "Mailing Zip": result.mail_zip || "",

        // Property Details
        "Property Use": result.property_use || "",
        "Property Use Code": result.property_use_code || "",
        "Property Type": result.property_type || "",
        "Land Use": result.land_use || "",
        "Lot Sq. Feet": result.lot_square_feet || 0,
        "Building Sq. Feet": result.square_feet || 0,
        "Year Built": result.year_built || 0,
        Bedrooms: result.bedrooms || 0,
        Bathrooms: result.bathrooms || 0,
        Stories: result.stories || 0,

        // Financial Information
        "Last Sale Date": result.last_sale_date
          ? formatDate(result.last_sale_date)
          : "",
        "Last Sale Amount": result.last_sale_amount || "",
        "Assessed Value": result.assessed_value || 0,
        "Estimated Value": result.estimated_value || 0,
        "Lender Name": result.lender_name || "",
        "Loan Amount": result.last_mortgage1_amount || "",
        "Loan Type": result.loan_type_code || "",
        "Interest Rate": result.adjustable_rate ? "Adjustable" : "Fixed",
        "Loan Recording Date": result.recording_date
          ? formatDate(result.recording_date)
          : "",
        "Maturity Date": result.maturity_date_first
          ? formatDate(result.maturity_date_first)
          : "",
        "Mortgage Balance": result.open_mortgage_balance || 0,
        "High Equity": result.high_equity ? "Yes" : "No",
        "Equity %": result.equity_percent || 0,

        // Skip Trace Information (placeholder fields as they don't exist in the API)
        "Skip Trace Name":
          `${result.owner1_first_name || ""} ${result.owner1_last_name || ""}`.trim() ||
          "N/A",
        "Skip Trace Phone": "N/A", // Not available in the API
        "Skip Trace Email": "N/A", // Not available in the API
        "Skip Trace Most Recent Address": result.mail_address || "N/A",

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

      const formattedName = assetTypeName.replace(/\s+/g, "_");

      XLSX.writeFile(workbook, `CREfinder_${formattedName}_${timestamp}.xlsx`);

      // Update search log status if searchLogId is provided

      toast.success("Results exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export results");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2"
    >
      <IconFileDownload className="size-4" />
      {isExporting ? "Downloading..." : "Export"}
    </Button>
  );
}
