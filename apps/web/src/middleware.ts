import { updateSession } from "@v1/supabase/middleware";
import { getMarketingUrl } from "@v1/utils/environment";
import { createI18nMiddleware } from "next-international/middleware";
import { type NextRequest, NextResponse } from "next/server";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en"],
  defaultLocale: "en",
  urlMappingStrategy: "rewrite",
});

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(
    request,
    I18nMiddleware(request),
  );

  const nextUrl = request.nextUrl;

  const pathnameLocale = nextUrl.pathname.split("/", 2)?.[1];

  // Remove the locale from the pathname
  const pathnameWithoutLocale = pathnameLocale
    ? nextUrl.pathname.slice(pathnameLocale.length + 1)
    : nextUrl.pathname;

  // Create a new URL without the locale in the pathname
  const newUrl = new URL(pathnameWithoutLocale || "/", request.url);

  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(
    newUrl.pathname,
  );

  if (!user && !isAuthPage && newUrl.pathname !== "/") {
    // Check if request origin baseurl is getMarketingUrl, redirect to signup instead of login
    const marketingUrl = getMarketingUrl();
    const requestOrigin =
      request.headers.get("origin") || request.headers.get("referer");
    const isFromMarketing = requestOrigin?.startsWith(marketingUrl);

    const redirectPath = isFromMarketing ? "/signup" : "/login";
    const redirectUrl = new URL(redirectPath, request.url);

    if (pathnameWithoutLocale !== "/") {
      redirectUrl.searchParams.append("return_to", pathnameWithoutLocale);
    }
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|api|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
