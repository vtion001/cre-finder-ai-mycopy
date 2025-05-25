import type { Client } from "../types";

export async function consumeUserCredits(
  supabase: Client,
  creditAmount: number,
) {
  const { data, error } = await supabase.rpc("consume_user_credits", {
    credits_to_consume: creditAmount,
  });

  return {
    data,
    error,
  };
}
