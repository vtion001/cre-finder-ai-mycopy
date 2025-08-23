export function getDashboardUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production"
  ) {
    return "https://app.crefinder.ai";
  }

  if (
    process.env.VERCEL_ENV === "preview" ||
    process.env.VERCEL_ENV === "development"
  ) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3001";
}

export function getMarketingUrl() {
  if (process.env.NEXT_PUBLIC_MARKETING_URL) {
    return process.env.NEXT_PUBLIC_MARKETING_URL;
  }

  if (
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production"
  ) {
    return "https://crefinder.ai";
  }

  if (
    process.env.VERCEL_ENV === "preview" ||
    process.env.VERCEL_ENV === "development"
  ) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3001";
}
