"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "@v1/ui/sonner";
import { Button } from "@v1/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@v1/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@v1/ui/tabs";
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

function IntegrationsPageComponent() {
  const [activeTab, setActiveTab] = useState("overview");
  const [configs, setConfigs] = useState<any>({});
  const [minimized, setMinimized] = useState<Record<string, boolean>>({
    vapi: false,
    twilio: false,
    sendgrid: false,
  });
  
  // Dialog state management
  const [dialogStates, setDialogStates] = useState({
    vapi: false,
    twilio: false,
    sendgrid: false,
  });

  // Memoize integrations data to prevent unnecessary re-renders
  const integrations = useMemo(() => [
    {
      id: "vapi",
      name: "VAPI",
      description: "Voice AI integration for automated voice campaigns and real estate prospect calls",
      icon: <Mic className="h-5 w-5" />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      isConfigured: false,
      status: "Not configured",
      fields: [
        { label: "API Key", value: "Not set" },
        { label: "Organization", value: "Not set" },
        { label: "Assistant ID", value: "Not set" },
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
      isConfigured: false,
      status: "Not configured",
      fields: [
        { label: "Account SID", value: "Not set" },
        { label: "Auth Token", value: "Not set" },
        { label: "Phone Number", value: "Not set" },
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
  ], []);



  const handleConfigure = useCallback((integrationId: string) => {
    setDialogStates(prev => ({ ...prev, [integrationId]: true }));
  }, []);

  const handleDialogClose = useCallback((integrationId: string) => {
    setDialogStates(prev => ({ ...prev, [integrationId]: false }));
  }, []);

  const handleConfigSaved = useCallback(() => {
    // TODO: Refresh configurations from API
    toast.success("Configuration saved successfully!");
  }, []);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  const handleTest = useCallback((integrationId: string) => {
    toast.info(`Test ${integrationId.toUpperCase()} - Testing functionality will be implemented`);
  }, []);

  const toggleMinimize = useCallback((integrationId: string) => {
    setMinimized(prev => ({ ...prev, [integrationId]: !prev[integrationId] }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground">
            Configure and manage your third-party service integrations.
          </p>
        </div>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Managing integrations for user@example.com
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            User ID: aec53558-767e-4408-b4d6-1c1e6f17ffe5
          </p>
        </CardContent>
      </Card>

      {/* Integration Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vapi">VAPI</TabsTrigger>
          <TabsTrigger value="twilio">Twilio</TabsTrigger>
          <TabsTrigger value="sendgrid">SendGrid</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
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
        </TabsContent>

        {/* VAPI Tab */}
        <TabsContent value="vapi" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                VAPI Integration
              </CardTitle>
              <CardDescription>
                Voice AI for automated calls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Status: Not Set Up</h4>
                    <p className="text-sm text-muted-foreground">Configure VAPI to enable voice AI campaigns</p>
                  </div>
                  <Button onClick={() => handleConfigure('vapi')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Configure VAPI
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Twilio Tab */}
        <TabsContent value="twilio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Twilio Integration
              </CardTitle>
              <CardDescription>
                SMS and voice communications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Status: Not Set Up</h4>
                    <p className="text-sm text-muted-foreground">Configure Twilio to enable SMS and voice campaigns</p>
                  </div>
                  <Button onClick={() => handleConfigure('twilio')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Twilio
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SendGrid Tab */}
        <TabsContent value="sendgrid" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                SendGrid Integration
              </CardTitle>
              <CardDescription>
                Email delivery service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Status: Not Set Up</h4>
                    <p className="text-sm text-muted-foreground">Configure SendGrid to enable email campaigns</p>
                  </div>
                  <Button onClick={() => handleConfigure('sendgrid')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Configure SendGrid
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Integration Health Section */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg border">
        <h3 className="font-semibold text-sm mb-2">Integration Health</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Overall status of your integrations
        </p>
        <div className="space-y-2">
          {integrations.map((integration) => (
            <div key={integration.id} className="flex items-center justify-between text-sm">
              <span className="capitalize">{integration.name}</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Never Tested</Badge>
                <Badge variant="secondary">{integration.status}</Badge>
              </div>
            </div>
          ))}
        </div>
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
      />
      
      <SendGridConfigDialog
        isOpen={dialogStates.sendgrid}
        onOpenChange={(open) => setDialogStates(prev => ({ ...prev, sendgrid: open }))}
        onConfigSaved={handleConfigSaved}
      />
    </div>
  );
}

// Export the memoized component to prevent unnecessary re-renders
export const IntegrationsPage = React.memo(IntegrationsPageComponent);