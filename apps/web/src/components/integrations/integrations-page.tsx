"use client";

import { useState, useEffect } from "react";
import { toast } from "@v1/ui/sonner";
import { Button } from "@v1/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@v1/ui/card";
import { 
  Mic, 
  MessageSquare, 
  Mail,
  Settings,
  TestTube,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Badge } from "@v1/ui/badge";
import { VAPIConfig } from "./vapi-config";
import { TwilioConfigDialog } from "./twilio-config-dialog";
import { SendGridConfigDialog } from "./sendgrid-config-dialog";

export function IntegrationsPage() {
  const [configs, setConfigs] = useState<any>({});
  const [minimized, setMinimized] = useState<Record<string, boolean>>({
    vapi: false,
    twilio: false,
    sendgrid: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Load integration statuses on component mount
  useEffect(() => {
    refreshIntegrationStatuses();
  }, []);
  
  // Dialog state management
  const [dialogStates, setDialogStates] = useState({
    vapi: false,
    twilio: false,
    sendgrid: false,
  });

  // Integration data with your configured credentials
  const integrations = [
    {
      id: "vapi",
      name: "VAPI",
      description: "Voice AI integration for automated voice campaigns and real estate prospect calls",
      icon: <Mic className="h-5 w-5" />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      isConfigured: true,
      status: "Configured",
      fields: [
        { label: "API Key", value: "4d8569e3-2b82-4a7d-b000-fdb79dcddb2c" },
        { label: "Organization", value: "Not set" },
        { label: "Assistant ID", value: "ed68dbc7-19bd-4bab-852a-17fa11e9aa97" },
        { label: "Phone Number", value: "Not set" }
      ]
    },
    {
      id: "twilio",
      name: "Twilio",
      description: "SMS and voice communication platform for outreach campaigns",
      icon: <MessageSquare className="h-5 w-5" />,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      isConfigured: true,
      status: "Configured",
      fields: [
        { label: "Account SID", value: "AC3b1d6c487a62adb87700610e597e76db" },
        { label: "Auth Token", value: "••••••••••••••••••••••••••••••••" },
        { label: "Phone Number", value: "+19787081782" },
        { label: "Messaging Service", value: "Not set" }
      ]
    },
    {
      id: "sendgrid",
      name: "SendGrid",
      description: "Email delivery and marketing platform for automated email campaigns",
      icon: <Mail className="h-5 w-5" />,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      isConfigured: false,
      status: "Not configured",
      fields: [
        { label: "API Key", value: "Not set" },
        { label: "From Email", value: "Not set" },
        { label: "From Name", value: "Not set" },
        { label: "Template ID", value: "Not set" }
      ]
    }
  ];

  const handleConfigure = (integrationId: string) => {
    setDialogStates(prev => ({ ...prev, [integrationId]: true }));
  };

  const handleDialogClose = (integrationId: string) => {
    setDialogStates(prev => ({ ...prev, [integrationId]: false }));
  };

  const handleConfigSaved = () => {
    // Refresh configurations from API
    refreshIntegrationStatuses();
    toast.success("Configuration saved successfully!");
  };

  const refreshIntegrationStatuses = async () => {
    try {
      const response = await fetch('/api/integrations/status', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        // Update integration statuses based on API response
        // This will make the UI dynamic and show real-time status
        console.log('Integration statuses refreshed:', data);
      }
    } catch (error) {
      console.error('Failed to refresh integration statuses:', error);
    }
  };

  const handleTest = (integrationId: string) => {
    toast.info(`Test ${integrationId.toUpperCase()} - Testing functionality will be implemented`);
  };

  const toggleMinimize = (integrationId: string) => {
    setMinimized(prev => ({ ...prev, [integrationId]: !prev[integrationId] }));
  };

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Integrations</h2>
          <p className="text-muted-foreground">
            Configure and manage your third-party service integrations
          </p>
        </div>
        <Button 
          onClick={refreshIntegrationStatuses}
          variant="outline"
          size="sm"
        >
          <Settings className="h-4 w-4 mr-2" />
          Refresh Status
        </Button>
      </div>
      
      <div className="grid gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id} className="border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 ${integration.iconBg} rounded-lg`}>
                  <div className={integration.iconColor}>
                    {integration.icon}
                  </div>
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">{integration.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mt-1">
                    {integration.description}
                  </CardDescription>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant={integration.isConfigured ? "default" : "secondary"}
                  className="gap-1"
                >
                  {integration.isConfigured ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <AlertCircle className="h-3 w-3" />
                  )}
                  {integration.status}
                </Badge>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleConfigure(integration.id)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTest(integration.id)}
                  disabled={!integration.isConfigured}
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  Test
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleMinimize(integration.id)}
                >
                  {minimized[integration.id] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            
            {!minimized[integration.id] && (
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {integration.fields.map((field) => (
                    <div key={field.label} className="space-y-1">
                      <span className="font-medium text-foreground">{field.label}:</span>
                      <div className="text-muted-foreground">{field.value}</div>
                    </div>
                  ))}
                </div>
                
                {integration.isConfigured && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Last tested: Never
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-muted/50 rounded-lg border">
        <h3 className="font-semibold text-sm mb-2">Integration Status</h3>
        <p className="text-sm text-muted-foreground">
          Configure your integrations to enable automated campaigns and communications. 
          Each integration requires API credentials and configuration specific to your use case.
        </p>
      </div>

      {/* Configuration Dialogs */}
      {dialogStates.vapi && (
        <VAPIConfig
          onConfigUpdate={handleConfigSaved}
        />
      )}
      
      <TwilioConfigDialog
        isOpen={dialogStates.twilio}
        onOpenChange={(open) => setDialogStates(prev => ({ ...prev, twilio: open }))}
        onConfigSaved={handleConfigSaved}
        initialConfig={{
          accountSid: "AC3b1d6c487a62adb87700610e597e76db",
          authToken: "b5f3c1e4d56281fb4de1f0c9480dd68e",
          phoneNumber: "+19787081782"
        }}
      />
      
      <SendGridConfigDialog
        isOpen={dialogStates.sendgrid}
        onOpenChange={(open) => setDialogStates(prev => ({ ...prev, sendgrid: open }))}
        onConfigSaved={handleConfigSaved}
      />
    </div>
  );
}