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
