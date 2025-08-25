import { SiteHeader } from "@/components/site-header";
import { getUser, getUserLicensesByAssetType } from "@v1/supabase/cached-queries";
import { createClient } from "@v1/supabase/server";

import { Card, CardHeader, CardTitle, CardContent } from "@v1/ui/card";
import { Input } from "@v1/ui/input";
import { Label } from "@v1/ui/label";
import { Textarea } from "@v1/ui/textarea";
import { Button } from "@v1/ui/button";

export default async function EditVapiAssistant({ params }: { params: { id: string } }) {
  const user = await getUser();
  if (!user?.data) return null;
  const { data: licenses } = await getUserLicensesByAssetType();
  const supabase = createClient();
  const isNew = params.id === "new";
  
  interface VapiAssistant {
    id: string;
    name: string;
    model_parameters: any;
    voice_parameters: any;
    first_message: string;
    system_prompt: string;
  }
  
  const existing = isNew ? null : (await supabase
    .from("vapi_assistants")
    .select("*")
    .eq("user_id", user.data.id)
    .eq("id", params.id)
    .single() as { data: VapiAssistant | null }).data;

  return (
    <>
      <SiteHeader title={isNew ? "Create Assistant" : "Edit Assistant"} user={user.data} licenses={licenses || []} showMobileDrawer />
      <div className="p-4 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>{isNew ? "Create New Assistant" : existing?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={`/api/vapi/assistants${isNew ? "" : "/" + params.id}`} method="post" className="grid gap-3">
              <div className="grid gap-1">
                <Label>Name</Label>
                <Input name="name" defaultValue={existing?.name || ""} required />
              </div>
              <div className="grid gap-1">
                <Label>Model (e.g., gpt-4o)</Label>
                <Input name="model" defaultValue={(existing?.model_parameters as any)?.model || "gpt-4o-mini"} />
              </div>
              <div className="grid gap-1">
                <Label>Voice (provider voice id)</Label>
                <Input name="voice" defaultValue={(existing?.voice_parameters as any)?.voice || "eleven-labs-voice-id"} />
              </div>
              <div className="grid gap-1">
                <Label>First Message</Label>
                <Input name="firstMessage" defaultValue={existing?.first_message || "Hello, how can I help you today?"} />
              </div>
              <div className="grid gap-1">
                <Label>System Prompt</Label>
                <Textarea name="systemPrompt" defaultValue={existing?.system_prompt || "You are a helpful assistant for CRE Finder AI."} />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{isNew ? "Create" : "Save"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}


