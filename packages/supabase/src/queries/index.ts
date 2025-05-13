import { logger } from "@v1/logger";
import { createClient } from "@v1/supabase/server";
import type { Client } from "../types";

export async function getUserQuery(supabase: Client, userId: string) {
  const result = await supabase
    .from("users")
    .select()
    .eq("id", userId)
    .single()
    .throwOnError();

  return result;
}
