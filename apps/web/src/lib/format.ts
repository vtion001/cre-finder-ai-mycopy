import type { GetPropertySearchParams } from "@v1/property-data/types";
import type { Tables } from "@v1/supabase/types";
import { format } from "date-fns";

interface FormatNumberOptions extends Intl.NumberFormatOptions {
  locale?: string;
}

export function formatNumber(
  value?: number | null,
  { locale = "en-US", ...options }: FormatNumberOptions = {},
) {
  return new Intl.NumberFormat(locale, {
    style: "decimal",
    ...options,
  }).format(value ?? 0);
}

export const formatSearchParams = (params: GetPropertySearchParams) => {
  if (!params) return [];

  const parts = [];

  if (params.building_size_min || params.building_size_max) {
    const min = params.building_size_min
      ? formatNumber(params.building_size_min)
      : "Any";
    const max = params.building_size_max
      ? formatNumber(params.building_size_max)
      : "Any";
    parts.push(`Building: ${min} - ${max} sqft`);
  }

  if (params.lot_size_min || params.lot_size_max) {
    const min = params.lot_size_min ? formatNumber(params.lot_size_min) : "Any";
    const max = params.lot_size_max ? formatNumber(params.lot_size_max) : "Any";
    parts.push(`Lot: ${min} - ${max} sqft`);
  }

  if (params.year_min || params.year_max) {
    const min = params.year_min || "Any";
    const max = params.year_max || "Any";
    parts.push(`Year: ${min} - ${max}`);
  }

  if (params.last_sale_date) {
    parts.push(`Last Sale: ${params.last_sale_date}`);
  }

  if (params.loan_paid_off_percent_min || params.loan_paid_off_percent_max) {
    const min = params.loan_paid_off_percent_min
      ? `${params.loan_paid_off_percent_min}%`
      : "Any";
    const max = params.loan_paid_off_percent_max
      ? `${params.loan_paid_off_percent_max}%`
      : "Any";
    parts.push(`Loan Paid Off: ${min} - ${max}`);
  }

  if (params.number_of_units) {
    parts.push(`Units: ${params.number_of_units}`);
  }

  if (params.mortgage_free_and_clear) {
    parts.push("Mortgage Free & Clear");
  }

  if (params.tax_delinquent_year_min || params.tax_delinquent_year_max) {
    const min = params.tax_delinquent_year_min || "Any";
    const max = params.tax_delinquent_year_max || "Any";
    parts.push(`Tax Delinquent: ${min} - ${max}`);
  }

  return parts;
};

// Helper function to format currency values with compact notation
export const formatCurrency = (value: string | number | null) => {
  if (!value) return "-";
  const numValue = typeof value === "string" ? Number.parseFloat(value) : value;
  if (Number.isNaN(numValue)) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(numValue);
};

// Helper function to format numbers with commas (for table display)
export const formatTableNumber = (value: number | null) => {
  if (!value) return "-";
  return new Intl.NumberFormat("en-US").format(value);
};

// Helper function to format dates using date-fns
export const formatDate = (date: string | null) => {
  if (!date) return "-";
  try {
    return format(new Date(date), "MMM d, yyyy");
  } catch {
    return "-";
  }
};

// Helper function to get owner display name
export const getOwnerName = (row: Tables<"property_records">) => {
  const firstName = row.owner1_first_name;
  const lastName = row.owner1_last_name;
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  return lastName || "-";
};

// Helper function to get owner initials
export const getOwnerInitials = (row: Tables<"property_records">) => {
  const firstName = row.owner1_first_name;
  const lastName = row.owner1_last_name;

  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
  if (lastName) {
    return lastName.charAt(0).toUpperCase();
  }
  return "?";
};

// Helper function to format phone numbers for display
export const formatPhoneNumber = (phone: string) => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Check if it's a US phone number (10 digits)
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  // Check if it's a US phone number with country code (11 digits starting with 1)
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    const withoutCountryCode = cleaned.slice(1);
    return `(${withoutCountryCode.slice(0, 3)}) ${withoutCountryCode.slice(3, 6)}-${withoutCountryCode.slice(6)}`;
  }

  // Return original if not a standard US format
  return phone;
};

// Helper function to create phone link
export const createPhoneLink = (phone: string) => {
  const cleaned = phone.replace(/\D/g, "");
  return `tel:+1${cleaned.length === 10 ? cleaned : cleaned.slice(-10)}`;
};

// Helper function to create email link
export const createEmailLink = (email: string) => {
  return `mailto:${email}`;
};
