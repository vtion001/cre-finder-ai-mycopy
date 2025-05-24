import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  shared: {
    VERCEL_URL: z
      .string()
      .optional()
      .transform((v) => (v ? `https://${v}` : undefined)),
    PORT: z.coerce.number().default(3000),
  },
  server: {
    SUPABASE_SERVICE_KEY: z.string(),
    GOOGLE_API_KEY: z.string(),
    REALESTATEAPI_API_KEY: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    NEXT_PUBLIC_SUPABASE_URL: z.string(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    PORT: process.env.PORT,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
    VERCEL_URL: process.env.VERCEL_URL,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    REALESTATEAPI_API_KEY: process.env.REALESTATEAPI_API_KEY,

    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  },
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});
