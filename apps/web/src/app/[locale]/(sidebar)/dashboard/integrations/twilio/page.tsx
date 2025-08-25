import { SiteHeader } from "@/components/site-header";
import { getUser, getUserLicensesByAssetType } from "@v1/supabase/cached-queries";
import { createClient } from "@v1/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@v1/ui/card";
import { Button } from "@v1/ui/button";
import { Badge } from "@v1/ui/badge";
import { IconMessage, IconPhone, IconSettings } from "@tabler/icons-react";
import Link from "next/link";

export const metadata = { title: "Twilio Integration - CRE Finder AI" };

export default async function TwilioIntegrationsPage() {
  const user = await getUser();
  if (!user?.data) return null;
  
  const { data: licenses } = await getUserLicensesByAssetType();
  const supabase = createClient();
  
  // Get Twilio integration config
  interface TwilioConfig {
    config: any;
    updated_at: string;
  }
  
  const { data: twilioConfig } = await supabase
    .from("integration_configs")
    .select("config, updated_at")
    .eq("user_id", user.data.id)
    .eq("provider", "twilio")
    .single() as { data: TwilioConfig | null };

  const isConfigured = !!twilioConfig?.config;
  const lastUpdated = twilioConfig?.updated_at;

  return (
    <>
      <SiteHeader 
        title="Twilio Integration" 
        user={user.data} 
        licenses={licenses || []} 
        showMobileDrawer 
      />
      <div className="p-4 grid gap-6 max-w-5xl">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Twilio Integration</h2>
            <p className="text-muted-foreground">
              Manage your Twilio SMS and voice communication settings
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
                <div className="p-2 rounded-lg bg-blue-100">
                  <IconMessage className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">SMS & Voice Configuration</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Configure Twilio for SMS campaigns and voice calls
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
                    <IconMessage className="h-4 w-4" />
                    <span className="font-medium">SMS Configuration</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <IconPhone className="h-4 w-4" />
                    <span className="font-medium">Voice Configuration</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Active</span>
                </div>
                {lastUpdated && (
                  <p className="text-xs text-muted-foreground">
                    Last updated: {new Date(lastUpdated).toLocaleString()}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button asChild>
                    <Link href="/dashboard/integrations/twilio/configure">
                      <IconSettings className="h-4 w-4 mr-2" />
                      Configure Settings
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/integrations/twilio/test">
                      Test Integration
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <IconMessage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Configuration Found</h3>
                <p className="text-muted-foreground mb-4">
                  Configure your Twilio integration to start sending SMS and making voice calls.
                </p>
                <Button asChild>
                  <Link href="/dashboard/integrations/twilio/configure">
                    <IconSettings className="h-4 w-4 mr-2" />
                    Configure Twilio
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <IconMessage className="h-4 w-4 text-blue-600" />
                SMS Campaigns
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Bulk SMS sending</li>
                <li>• Message templates</li>
                <li>• Delivery tracking</li>
                <li>• Reply handling</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <IconPhone className="h-4 w-4 text-green-600" />
                Voice Calls
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Outbound calling</li>
                <li>• Call recording</li>
                <li>• IVR menus</li>
                <li>• Call analytics</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
