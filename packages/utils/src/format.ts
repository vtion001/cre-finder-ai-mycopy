import type { GetPropertySearchParams } from "@v1/property-data/types";
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

type FormatAmountParams = {
  currency: string;
  amount: number;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export function formatAmount({
  currency,
  amount,
  locale = "en-US",
  minimumFractionDigits,
  maximumFractionDigits,
}: FormatAmountParams) {
  if (!currency) {
    return;
  }

  return Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
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
