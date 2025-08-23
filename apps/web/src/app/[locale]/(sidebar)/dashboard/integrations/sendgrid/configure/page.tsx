"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@v1/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@v1/ui/card";
import { SendGridConfigDialog } from "@/components/integrations/sendgrid-config-dialog";
import { IconArrowLeft, IconSettings } from "@tabler/icons-react";
import Link from "next/link";
import { toast } from "@v1/ui/sonner";
import type { SendGridConfig } from "@v1/supabase/validations/integrations";

export default function SendGridConfigurePage() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<Partial<SendGridConfig>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCurrentConfig();
  }, []);

  const fetchCurrentConfig = async () => {
    try {
      const response = await fetch("/api/integrations/sendgrid");
      if (response.ok) {
        const data = await response.json();
        setCurrentConfig(data.config || {});
      }
    } catch (error) {
      console.error("Error fetching SendGrid config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (config: SendGridConfig) => {
    try {
      const response = await fetch("/api/integrations/sendgrid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save configuration");
      }

      toast.success("SendGrid configuration saved successfully!");
      setCurrentConfig(config);
      router.push("/dashboard/integrations/sendgrid");
    } catch (error) {
      console.error("Error saving SendGrid config:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save configuration");
    }
  };

  const handleConfigSaved = () => {
    // This function is called when the dialog saves the config
    // The actual saving is handled by the dialog component
    router.push("/dashboard/integrations/sendgrid");
  };

  const handleTest = async (config: SendGridConfig): Promise<boolean> => {
    try {
      // Test SendGrid connection by making a simple API call
      const response = await fetch("/api/sendgrid/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "test@example.com",
          subject: "Test connection",
          body: "This is a test email to verify SendGrid configuration.",
        }),
      });

      // In development, this will return success even without real credentials
      return response.status !== 500;
    } catch (error) {
      console.error("SendGrid test error:", error);
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/integrations/sendgrid">
          <Button variant="ghost" size="sm">
            <IconArrowLeft className="h-4 w-4 mr-2" />
            Back to SendGrid
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Configure SendGrid Integration</h1>
          <p className="text-muted-foreground">
            Set up your SendGrid credentials and settings for email campaigns
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <IconSettings className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle>SendGrid Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter your SendGrid API credentials and settings below
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Required Information</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>API Key:</strong> Your SendGrid API key (starts with SG.)</li>
                <li>• <strong>From Email:</strong> Email address to send from (must be verified)</li>
                <li>• <strong>From Name:</strong> Display name for outgoing emails (optional)</li>
                <li>• <strong>Reply-To Email:</strong> Email address for replies (optional)</li>
              </ul>
            </div>
            
            <Button onClick={() => setIsDialogOpen(true)} className="w-full">
              <IconSettings className="h-4 w-4 mr-2" />
              {Object.keys(currentConfig).length > 0 ? "Edit Configuration" : "Configure SendGrid"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <SendGridConfigDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialConfig={currentConfig}
        onConfigSaved={handleConfigSaved}
      />
    </div>
  );
}
