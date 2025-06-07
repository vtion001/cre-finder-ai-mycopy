import type { Client, TablesUpdate } from "../types";

export async function updateUser(
  supabase: Client,
  data: TablesUpdate<"users">,
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return;
  }

  return supabase
    .from("users")
    .update(data)
    .eq("id", session.user.id)
    .select()
    .single();
}

export * from "./license";
