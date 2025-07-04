import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCContext } from "@v1/trpc/init";
import { appRouter } from "@v1/trpc/routers/_app";
import { getMarketingUrl } from "@v1/utils/environment";

// CORS configuration for cross-origin requests
const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = getMarketingUrl();
  const isAllowedOrigin = origin === allowedOrigin;

  return {
    "Access-Control-Allow-Origin": isAllowedOrigin ? origin : allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
};

const handler = async (req: Request) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            );
          }
        : undefined,
  });

  // Create a new response with CORS headers
  // We need to create a new Response because headers might be immutable
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...Object.fromEntries(response.headers.entries()),
      ...corsHeaders,
    },
  });
};

// Handle preflight OPTIONS requests
export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export { handler as GET, handler as POST };
