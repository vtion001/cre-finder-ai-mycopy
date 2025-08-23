import { SiteHeader } from "@/components/site-header";
import { getUser, getUserLicensesByAssetType } from "@v1/supabase/cached-queries";
import { createClient } from "@v1/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@v1/ui/card";
import { Button } from "@v1/ui/button";
import { Badge } from "@v1/ui/badge";
import { IconMail, IconSettings, IconTemplate } from "@tabler/icons-react";
import Link from "next/link";

export const metadata = { title: "SendGrid Integration - CRE Finder AI" };

export default async function SendGridIntegrationsPage() {
  const user = await getUser();
  if (!user?.data) return null;
  
  const { data: licenses } = await getUserLicensesByAssetType();
  const supabase = createClient();
  
  // Get SendGrid integration config
  const { data: sendgridConfig } = await supabase
    .from("integration_configs")
    .select("config, updated_at")
    .eq("user_id", user.data.id)
    .eq("provider", "sendgrid")
    .single();

  const isConfigured = !!sendgridConfig?.config;
  const lastUpdated = sendgridConfig?.updated_at;

  return (
    <>
      <SiteHeader 
        title="SendGrid Integration" 
        user={user.data} 
        licenses={licenses || []} 
        showMobileDrawer 
      />
      <div className="p-4 grid gap-6 max-w-5xl">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">SendGrid Integration</h2>
            <p className="text-muted-foreground">
              Manage your SendGrid email campaign settings
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
                <div className="p-2 rounded-lg bg-green-100">
                  <IconMail className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Email Configuration</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Configure SendGrid for email campaigns and notifications
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
                    <IconMail className="h-4 w-4" />
                    <span className="font-medium">Email Configuration</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <IconTemplate className="h-4 w-4" />
                    <span className="font-medium">Template System</span>
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
                    <Link href="/dashboard/integrations/sendgrid/configure">
                      <IconSettings className="h-4 w-4 mr-2" />
                      Configure Settings
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/integrations/sendgrid/test">
                      Test Integration
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <IconMail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Configuration Found</h3>
                <p className="text-muted-foreground mb-4">
                  Configure your SendGrid integration to start sending email campaigns.
                </p>
                <Button asChild>
                  <Link href="/dashboard/integrations/sendgrid/configure">
                    <IconSettings className="h-4 w-4 mr-2" />
                    Configure SendGrid
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
                <IconMail className="h-4 w-4 text-green-600" />
                Email Campaigns
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Bulk email sending</li>
                <li>• Dynamic templates</li>
                <li>• Delivery tracking</li>
                <li>• Bounce handling</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <IconTemplate className="h-4 w-4 text-blue-600" />
                Template System
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• HTML templates</li>
                <li>• Dynamic content</li>
                <li>• A/B testing</li>
                <li>• Analytics</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
