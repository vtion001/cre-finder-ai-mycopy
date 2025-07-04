import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserMetadata as DefaultUserMetadata } from "@supabase/supabase-js";
import type { Database } from "./db";

/**
 * Module augmentation for `supabase` types.
 * Allows us to add custom properties to the `user_metadata`
 * object and keep type safety.
 * https://supabase.com/docs/guides/auth/managing-user-data#adding-and-retrieving-user-metadata
 */
declare module "@supabase/supabase-js" {
  interface UserMetadata extends DefaultUserMetadata {
    role: "investor" | "wholesale" | "broker" | "admin" | null;
  }
}

export type Client = SupabaseClient<Database>;

export * from "./db";
