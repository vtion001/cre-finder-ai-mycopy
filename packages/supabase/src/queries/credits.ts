import type { Client } from "../types";

export async function getUserCreditUsageQuery(supabase: Client) {
  const { data, error } = await supabase
    .rpc("calculate_user_credit_usage")
    .single();

  if (error) {
    throw new Error(`Failed to get credit usage: ${error.message}`);
  }

  return {
    data,
    error,
  };
}

export async function getCreditTransactionsQuery(supabase: Client) {
  const { data, error } = await supabase
    .from("credit_transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to get credit transactions: ${error.message}`);
  }

  return {
    data,
    error,
  };
}
