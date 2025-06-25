import type { StoredSkipTraceResponse } from "@/types";
import type { Table } from "@tanstack/react-table";
import type { Tables } from "@v1/supabase/types";
import { format, isValid, parse } from "date-fns";
import * as XLSX from "xlsx";
export function exportRecordsToCSV(
  data: Tables<"property_records">[],
  assetTypeName: string,
): void {
  const exportData = formatExportData(data);

  const headers = Object.keys(exportData[0]!);

  const csvContent = [
    headers.join(","),
    ...exportData.map((row) =>
      headers
        .map((header) => {
          // @ts-expect-error
          const cellValue = row[header];
          return typeof cellValue === "string"
            ? `"${cellValue.replace(/"/g, '""')}"`
            : cellValue;
        })
        .join(","),
    ),
  ].join("\n");

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .substring(0, 19);

  const formattedName = assetTypeName.replace(/\s+/g, "_");
  const filename = `CREfinder_${formattedName}_${timestamp}.csv`;

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportRecordsToXLSX(
  data: Tables<"property_records">[],
  assetTypeName: string,
) {
  const exportData = formatExportData(data);

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
  const filename = `CREfinder_${formattedName}_${timestamp}.xlsx`;

  XLSX.writeFile(workbook, filename);
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

// Helper function to extract skip trace data for CSV export
const extractSkipTraceData = (
  skipTraceData: StoredSkipTraceResponse | null,
) => {
  const skipTraceFields: Record<string, string | number> = {};

  if (!skipTraceData?.output?.identity) {
    // No skip trace data available
    skipTraceFields["Skip Trace Status"] = "No Data";
    skipTraceFields["Skip Trace Primary Phone"] = "";
    skipTraceFields["Skip Trace Primary Email"] = "";
    skipTraceFields["Skip Trace Current Address"] = "";
    skipTraceFields["Skip Trace Age"] = "";
    skipTraceFields["Skip Trace Gender"] = "";
    skipTraceFields["Skip Trace Phone Count"] = 0;
    skipTraceFields["Skip Trace Email Count"] = 0;
    skipTraceFields["Skip Trace All Phones"] = "";
    skipTraceFields["Skip Trace All Emails"] = "";
    skipTraceFields["Skip Trace Previous Addresses"] = "";
    return skipTraceFields;
  }

  const { identity, demographics, stats } = skipTraceData.output;
  const phones = identity.phones || [];
  const emails = identity.emails || [];
  const currentAddress = identity.address;
  const addressHistory = identity.addressHistory || [];

  // Basic skip trace status
  skipTraceFields["Skip Trace Status"] = "Data Available";

  // Primary contact information
  const primaryPhone = phones.find((p) => p.isConnected) || phones[0];
  const primaryEmail = emails[0];

  skipTraceFields["Skip Trace Primary Phone"] =
    primaryPhone?.phoneDisplay || primaryPhone?.phone || "";
  skipTraceFields["Skip Trace Primary Email"] = primaryEmail?.email || "";

  // Demographics
  skipTraceFields["Skip Trace Age"] = demographics?.age || "";
  skipTraceFields["Skip Trace Gender"] = demographics?.gender || "";
  skipTraceFields["Skip Trace Date of Birth"] = demographics?.dob || "";

  // Statistics
  skipTraceFields["Skip Trace Phone Count"] = stats?.phoneNumbers || 0;
  skipTraceFields["Skip Trace Email Count"] = stats?.emailAddresses || 0;
  skipTraceFields["Skip Trace Address Count"] = stats?.addresses || 0;

  // All phone numbers (concatenated)
  const allPhones = phones
    .map((p) => p.phoneDisplay || p.phone || "")
    .filter((phone) => phone.length > 0)
    .join("; ");
  skipTraceFields["Skip Trace All Phones"] = allPhones || "";

  // All email addresses (concatenated)
  const allEmails = emails
    .map((e) => e.email || "")
    .filter((email) => email.length > 0)
    .join("; ");
  skipTraceFields["Skip Trace All Emails"] = allEmails || "";

  // Current address
  skipTraceFields["Skip Trace Current Address"] =
    currentAddress?.formattedAddress || "";

  // Previous addresses (concatenated)
  const previousAddresses = addressHistory
    .slice(0, 3)
    .map((addr) => addr.formattedAddress)
    .join("; ");
  skipTraceFields["Skip Trace Previous Addresses"] = previousAddresses || "";

  return skipTraceFields;
};

const formatExportData = (data: Tables<"property_records">[]) =>
  data.map((result) => ({
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

    // Skip Trace Information
    ...extractSkipTraceData(
      result.skip_trace_data
        ? (JSON.parse(
            JSON.stringify(result.skip_trace_data),
          ) as StoredSkipTraceResponse)
        : null,
    ),

    // Additional Information
    Latitude: result.latitude || "",
    Longitude: result.longitude || "",
  }));
