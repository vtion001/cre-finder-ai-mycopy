import type { GetPropertySearchParams } from "./realestateapi";

interface FormatNumberOptions extends Intl.NumberFormatOptions {
  locale?: string;
}

export function parseLocationCode(code: string) {
  const parts = code.toLowerCase().split("-");
  const [type, state, ...nameParts] = parts;

  const name = nameParts.map(capitalize).join(" ");

  if ((type !== "c" && type !== "n") || !state || !name) {
    throw new Error("Invalid location code");
  }

  return {
    state: state.toUpperCase(),
    city: type === "c" ? name : undefined,
    county: type === "n" ? name : undefined,
  };
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
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
  if (!params) return "N/A";

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

  return parts.join(" • ");
};
