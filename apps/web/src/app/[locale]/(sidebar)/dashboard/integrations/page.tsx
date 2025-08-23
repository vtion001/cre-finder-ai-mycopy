"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@v1/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card';
import { Button } from '@v1/ui/button';
import { Badge } from '@v1/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@v1/ui/tabs';
import { Alert, AlertDescription } from '@v1/ui/alert';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { VAPIConfig } from '@/components/integrations/vapi-config';
import { SendGridConfig } from '@/components/integrations/sendgrid-config';

interface IntegrationStatus {
  integration_type: 'vapi' | 'twilio' | 'sendgrid';
  is_configured: boolean;
  last_tested_at?: string | null;
  test_status: 'success' | 'failed' | 'never';
  error_message?: string | null;
}

interface User {
  id: string;
  email: string;
}

export default function IntegrationsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [integrationStatuses, setIntegrationStatuses] = useState<IntegrationStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

  const supabase = createClient();

  useEffect(() => {
    loadUserAndStatuses();
  }, []);

  const loadUserAndStatuses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !currentUser) {
        throw new Error('Authentication required');
      }
      setUser(currentUser);

      // Load integration statuses
      const response = await fetch('/api/integrations/status', {
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to load integration statuses');
      }

      const data = await response.json();
      setIntegrationStatuses(data.statuses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: 'success' | 'failed' | 'never') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: 'success' | 'failed' | 'never') => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Working</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Never Tested</Badge>;
    }
  };

  const getIntegrationStatus = (type: 'vapi' | 'twilio' | 'sendgrid') => {
    return integrationStatuses.find(s => s.integration_type === type);
  };

  // Helper function to check if an integration is configured
  const isIntegrationConfigured = (type: 'vapi' | 'twilio' | 'sendgrid') => {
    const status = integrationStatuses.find(s => s.integration_type === type);
    return status?.is_configured === true;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading integrations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          {error}. Please refresh the page or contact support.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">
            Configure and manage your third-party service integrations
          </p>
        </div>
      </div>

      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Managing integrations for {user.email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              User ID: {user.id}
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vapi">VAPI</TabsTrigger>
          <TabsTrigger value="twilio">Twilio</TabsTrigger>
          <TabsTrigger value="sendgrid">SendGrid</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* VAPI Status Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">VAPI Integration</CardTitle>
                {getStatusIcon(getIntegrationStatus('vapi')?.test_status || 'never')}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isIntegrationConfigured('vapi') ? 'Configured' : 'Not Set Up'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Voice AI for automated calls
                </p>
                <div className="mt-2">
                  {getStatusBadge(getIntegrationStatus('vapi')?.test_status || 'never')}
                </div>
                {getIntegrationStatus('vapi')?.last_tested_at && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Last tested: {new Date(getIntegrationStatus('vapi')!.last_tested_at!).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Twilio Status Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Twilio Integration</CardTitle>
                {getStatusIcon(getIntegrationStatus('twilio')?.test_status || 'never')}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isIntegrationConfigured('twilio') ? 'Configured' : 'Not Set Up'}
                </div>
                <p className="text-xs text-muted-foreground">
                  SMS and voice communications
                </p>
                <div className="mt-2">
                  {getStatusBadge(getIntegrationStatus('twilio')?.test_status || 'never')}
                </div>
                {getIntegrationStatus('twilio')?.last_tested_at && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Last tested: {new Date(getIntegrationStatus('twilio')!.last_tested_at!).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* SendGrid Status Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">SendGrid Integration</CardTitle>
                {getStatusIcon(getIntegrationStatus('sendgrid')?.test_status || 'never')}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isIntegrationConfigured('sendgrid') ? 'Configured' : 'Not Set Up'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Email delivery service
                </p>
                <div className="mt-2">
                  {getStatusBadge(getIntegrationStatus('sendgrid')?.test_status || 'never')}
                </div>
                {getIntegrationStatus('sendgrid')?.last_tested_at && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Last tested: {new Date(getIntegrationStatus('sendgrid')!.last_tested_at!).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Integration Health</CardTitle>
              <CardDescription>
                Overall status of your integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {integrationStatuses.map((status) => (
                  <div key={status.integration_type} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <span className="capitalize font-medium">{status.integration_type}</span>
                      {getStatusIcon(status.test_status)}
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(status.test_status)}
                      {status.is_configured ? (
                        <Badge variant="outline">Configured</Badge>
                      ) : (
                        <Badge variant="secondary">Not Set Up</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vapi" className="space-y-4">
          <VAPIConfig onConfigUpdate={loadUserAndStatuses} />
        </TabsContent>

        <TabsContent value="twilio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Twilio Configuration</CardTitle>
              <CardDescription>
                Manage your Twilio SMS and voice settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Your Twilio integration is already configured. You can test and manage it from the dedicated Twilio test page.
              </p>
              <Button asChild>
                <a href="/en/dashboard/twilio-test">Go to Twilio Test</a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sendgrid" className="space-y-4">
          <SendGridConfig onConfigUpdate={loadUserAndStatuses} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
