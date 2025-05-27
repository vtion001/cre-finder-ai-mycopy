import type { Client } from "../types";

export async function getUserQuery(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", userId)
    .single()
    .throwOnError();

  return { data, error };
}

// Export all query functions
export * from "./credits";
export * from "./history";
export * from "./onboarding";
export * from "./records";
