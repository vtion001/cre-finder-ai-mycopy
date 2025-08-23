import type { Client } from "../types";

export async function getOutboundEventsQuery(
  supabase: Client,
  userId: string,
  limit: number = 100,
) {
  const { data, error } = await supabase
    .from("outbound_events")
    .select("id, channel, to_contact, status, cost_cents, payload, error, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return { data, error };
}


