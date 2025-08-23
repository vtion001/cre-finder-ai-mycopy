import type { Client } from "../types";

export async function listVapiAssistantsQuery(supabase: Client, userId: string) {
  return supabase
    .from("vapi_assistants")
    .select("id,name,vapi_assistant_id,model_parameters,voice_parameters,first_message,system_prompt,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

export async function getVapiAssistantQuery(supabase: Client, userId: string, id: string) {
  return supabase
    .from("vapi_assistants")
    .select("*")
    .eq("user_id", userId)
    .eq("id", id)
    .single();
}

export async function upsertVapiAssistantQuery(
  supabase: Client,
  userId: string,
  data: {
    id?: string;
    name: string;
    vapi_assistant_id?: string | null;
    model_parameters?: Record<string, unknown>;
    voice_parameters?: Record<string, unknown>;
    first_message?: string | null;
    system_prompt?: string | null;
  },
) {
  return supabase
    .from("vapi_assistants")
    .upsert({ 
      user_id: userId, 
      ...data,
      model_parameters: data.model_parameters as any,
      voice_parameters: data.voice_parameters as any
    }, { onConflict: "id" })
    .select("*")
    .single();
}

export async function deleteVapiAssistantQuery(supabase: Client, userId: string, id: string) {
  return supabase.from("vapi_assistants").delete().eq("user_id", userId).eq("id", id);
}


