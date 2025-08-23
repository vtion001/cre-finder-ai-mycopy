import { SiteHeader } from "@/components/site-header";
import { getUser, getUserLicensesByAssetType } from "@v1/supabase/cached-queries";
import { createClient } from "@v1/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@v1/ui/card";
import { Button } from "@v1/ui/button";
import { Badge } from "@v1/ui/badge";
import { IconPhone, IconSettings, IconRobot } from "@tabler/icons-react";
import Link from "next/link";

export const metadata = { title: "VAPI Integration - CRE Finder AI" };

export default async function VapiIntegrationsPage() {
  const user = await getUser();
  if (!user?.data) return null;
  
  const { data: licenses } = await getUserLicensesByAssetType();
  const supabase = createClient();
  
  // Get VAPI integration config
  const { data: vapiConfig } = await supabase
    .from("integration_configs")
    .select("config, updated_at")
    .eq("user_id", user.data.id)
    .eq("provider", "vapi")
    .single();

  const isConfigured = !!vapiConfig?.config;
  const lastUpdated = vapiConfig?.updated_at;

  // Get VAPI assistants
  const { data: assistants } = await supabase
    .from("vapi_assistants")
    .select("id,name,vapi_assistant_id,model_parameters,voice_parameters,first_message,system_prompt,created_at")
    .eq("user_id", user.data.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <SiteHeader 
        title="VAPI Integration" 
        user={user.data} 
        licenses={licenses || []} 
        showMobileDrawer 
      />
      <div className="p-4 grid gap-6 max-w-5xl">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">VAPI Integration</h2>
            <p className="text-muted-foreground">
              Manage your VAPI voice AI calling settings and assistants
            </p>
          </div>
          <Link href="/dashboard/integrations">
            <Button variant="outline">Back to Integrations</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <IconPhone className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Voice AI Configuration</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Configure VAPI for AI-powered voice calls and campaigns
                  </p>
                </div>
              </div>
              <Badge 
                variant={isConfigured ? "default" : "secondary"}
                className={isConfigured ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}
              >
                {isConfigured ? "Configured" : "Not Configured"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isConfigured ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <IconPhone className="h-4 w-4" />
                    <span className="font-medium">Voice AI Configuration</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <IconRobot className="h-4 w-4" />
                    <span className="font-medium">AI Assistants</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {assistants?.length || 0} configured
                  </span>
                </div>
                {lastUpdated && (
                  <p className="text-xs text-muted-foreground">
                    Last updated: {new Date(lastUpdated).toLocaleString()}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button asChild>
                    <Link href="/dashboard/integrations/vapi/configure">
                      <IconSettings className="h-4 w-4 mr-2" />
                      Configure Settings
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/integrations/vapi/test">
                      Test Integration
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <IconPhone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Configuration Found</h3>
                <p className="text-muted-foreground mb-4">
                  Configure your VAPI integration to start making AI-powered voice calls.
                </p>
                <Button asChild>
                  <Link href="/dashboard/integrations/vapi/configure">
                    <IconSettings className="h-4 w-4 mr-2" />
                    Configure VAPI
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {assistants && assistants.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your AI Assistants</CardTitle>
                <Link href="/dashboard/integrations/vapi/new">
                  <Button size="sm">Create New Assistant</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Name</th>
                    <th>Model</th>
                    <th>Voice</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assistants.map((assistant) => (
                    <tr key={assistant.id} className="border-b">
                      <td className="py-2">{assistant.name}</td>
                      <td>{(assistant.model_parameters as any)?.model as string || 'Default'}</td>
                      <td>{(assistant.voice_parameters as any)?.voice as string || 'Default'}</td>
                      <td className="space-x-2">
                        <Link href={`/dashboard/integrations/vapi/${assistant.id}`} className="underline">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <IconPhone className="h-4 w-4 text-purple-600" />
                Voice AI Calls
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• AI-powered conversations</li>
                <li>• Natural language processing</li>
                <li>• Call recording & transcription</li>
                <li>• Multi-language support</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <IconRobot className="h-4 w-4 text-blue-600" />
                AI Assistants
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Custom AI personalities</li>
                <li>• Context-aware conversations</li>
                <li>• Integration with CRM data</li>
                <li>• Scalable calling</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}


