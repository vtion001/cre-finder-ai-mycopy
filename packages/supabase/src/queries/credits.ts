import type { Client } from "../types";

/**
 * Get the user's credit usage for the current billing period
 * @param supabase Supabase client
 * @param userId User ID
 * @returns Object containing consumed credits and max allowed credits
 */
export async function getUserCreditUsageQuery(
  supabase: Client,
  userId: string,
) {
  const { data, error } = await supabase
    .rpc("calculate_user_credit_usage")
    .single();

  if (error) {
    throw new Error(`Failed to get credit usage: ${error.message}`);
  }

  return {
    data: {
      consumedCredits: data?.consumed_credits || 0,
      maxAllowedCredits: data?.max_allowed_credits || 0,
      remainingCredits:
        (data?.max_allowed_credits || 0) - (data?.consumed_credits || 0),
    },
    error,
  };
}
