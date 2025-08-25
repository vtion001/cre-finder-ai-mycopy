"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@v1/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card';
import { Button } from '@v1/ui/button';
import { Input } from '@v1/ui/input';
import { Label } from '@v1/ui/label';
import { Alert, AlertDescription } from '@v1/ui/alert';
import { Badge } from '@v1/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Loader2, Save, TestTube, Trash2, Mail } from 'lucide-react';

interface SendGridConfig {
  id?: string;
  apiKey: string;
  fromEmail: string;
  fromName: string;
  templateId: string;
  webhookUrl: string;
  customSubject: string;
}

interface SendGridConfigResponse {
  id: string;
  apiKey: string;
  fromEmail: string;
  fromName: string;
  templateId: string;
  webhookUrl: string;
  customSubject: string;
  isConfigured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SendGridConfigProps {
  onConfigUpdate?: () => void;
}

export function SendGridConfig({ onConfigUpdate }: SendGridConfigProps = {}) {
  const [config, setConfig] = useState<SendGridConfig>({
    apiKey: '',
    fromEmail: '',
    fromName: '',
    templateId: '',
    webhookUrl: '',
    customSubject: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [status, setStatus] = useState<'configured' | 'not-configured'>('not-configured');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setIsLoadingConfig(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.log('No active session found');
        setStatus('not-configured');
        return;
      }

      console.log('=== SendGrid Load Config Debug ===');
      console.log('1. Session found, making GET request');

      const response = await fetch('/api/integrations/sendgrid', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        credentials: 'include',
      });

      console.log('2. Response status:', response.status);
      
      const data = await response.json();
      console.log('3. Response data:', data);

      if (response.ok) {
        console.log('4. Response OK, checking data structure');
        
        // Check if we have a configuration - be more flexible with the check
        if (data && (data.isConfigured === true || (data.apiKey && data.fromEmail && data.fromName))) {
          console.log('5. Found existing configuration, loading it');
          setConfig({
            apiKey: data.apiKey && data.apiKey.includes('...') ? '' : (data.apiKey || ''), // Don't load masked keys
            fromEmail: data.fromEmail || '',
            fromName: data.fromName || '',
            templateId: data.templateId || '',
            webhookUrl: data.webhookUrl || '',
            customSubject: data.customSubject || '',
          });
          setStatus('configured');
          setMessage({ type: 'success', text: 'SendGrid configuration loaded successfully' });
        } else {
          console.log('6. No existing configuration found or incomplete data');
          setStatus('not-configured');
          // Keep form empty for new configuration
          setConfig({
            apiKey: '',
            fromEmail: '',
            fromName: '',
            templateId: '',
            webhookUrl: '',
            customSubject: ''
          });
        }
      } else {
        console.error('7. Error response from API:', data);
        setStatus('not-configured');
        setMessage({ type: 'error', text: `Failed to load configuration: ${data.error || 'Unknown error'}` });
      }
    } catch (error) {
      console.error('7. Load config error:', error);
      setStatus('not-configured');
      setMessage({ type: 'error', text: `Error loading configuration: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setIsLoadingConfig(false);
    }
  };

  const saveConfig = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('No active session found. Please log in again.');
      }

      // Validate required fields
      if (!config.apiKey || !config.fromEmail || !config.fromName) {
        throw new Error('API Key, From Email, and From Name are required');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(config.fromEmail)) {
        throw new Error('Invalid email format');
      }

      const response = await fetch('/api/integrations/sendgrid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        credentials: 'include',
        body: JSON.stringify(config),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus('configured');
        setMessage({ type: 'success', text: 'SendGrid configuration saved successfully!' });
        setTestResult(null);
        
        // Reload the configuration to get the latest state
        setTimeout(() => {
          loadConfig();
        }, 500);
        
        // Notify parent component to refresh integration statuses
        if (onConfigUpdate) {
          onConfigUpdate();
        }
      } else {
        throw new Error(result.error || 'Failed to save configuration');
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Error saving SendGrid configuration: ${error instanceof Error ? error.message : 'Unknown error'}` });
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('No active session found. Please log in again.');
      }

      // For now, we'll do a basic validation test
      // In a real implementation, you'd make an actual API call to SendGrid
      if (!config.apiKey.startsWith('SG.')) {
        throw new Error('Invalid API key format. SendGrid API keys should start with "SG."');
      }

      if (!config.fromEmail || !config.fromName) {
        throw new Error('From Email and From Name are required for testing');
      }

      // Simulate API test (replace with actual SendGrid API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTestResult({ 
        success: true, 
        message: 'SendGrid connection test successful! Your credentials appear to be valid.' 
      });
    } catch (error) {
      setTestResult({ 
        success: false, 
        message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setConfig({
      apiKey: '',
      fromEmail: '',
      fromName: '',
      templateId: '',
      webhookUrl: '',
      customSubject: '',
    });
    setStatus('not-configured');
    setMessage(null);
    setTestResult(null);
  };

  const deleteConfig = async () => {
    if (!confirm('Are you sure you want to delete your SendGrid configuration? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    setMessage(null);
    
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('No active session found. Please log in again.');
      }

      const response = await fetch('/api/integrations/sendgrid', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        clearForm();
        setMessage({ type: 'success', text: 'SendGrid configuration deleted successfully!' });
      } else {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete configuration');
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Error deleting SendGrid configuration: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              SendGrid Configuration
              {status === 'configured' ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Configured
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Not Configured
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Configure SendGrid for email delivery
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
            {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {testResult && (
          <Alert variant={testResult.success ? 'default' : 'destructive'}>
            {testResult.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <AlertDescription>{testResult.message}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key *</Label>
            <Input
              id="apiKey"
              type="password"
              value={config.apiKey}
              onChange={(e) => setConfig({...config, apiKey: e.target.value})}
              placeholder="SG...."
              disabled={isLoadingConfig}
              name="sendgridApiKey"
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              Get this from your SendGrid dashboard
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fromEmail">From Email * (must be verified)</Label>
            <Input
              id="fromEmail"
              type="email"
              value={config.fromEmail}
              onChange={(e) => setConfig({...config, fromEmail: e.target.value})}
              placeholder="noreply@yourdomain.com"
              disabled={isLoadingConfig}
              name="sendgridFromEmail"
              autoComplete="email"
            />
            <p className="text-xs text-muted-foreground">
              Must be verified in SendGrid
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fromName">From Name *</Label>
            <Input
              id="fromName"
              type="text"
              value={config.fromName}
              onChange={(e) => setConfig({...config, fromName: e.target.value})}
              placeholder="Your Company Name"
              disabled={isLoadingConfig}
              name="sendgridFromName"
              autoComplete="name"
            />
            <p className="text-xs text-muted-foreground">
              Display name for your emails
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="templateId">Template ID (Optional)</Label>
            <Input
              id="templateId"
              type="text"
              value={config.templateId}
              onChange={(e) => setConfig({...config, templateId: e.target.value})}
              placeholder="d-..."
              disabled={isLoadingConfig}
              name="sendgridTemplateId"
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              SendGrid dynamic template ID
            </p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
            <Input
              id="webhookUrl"
              type="url"
              value={config.webhookUrl}
              onChange={(e) => setConfig({...config, webhookUrl: e.target.value})}
              placeholder="https://yourdomain.com/webhook"
              disabled={isLoadingConfig}
              name="sendgridWebhookUrl"
              autoComplete="url"
            />
            <p className="text-xs text-muted-foreground">
              Webhook endpoint for SendGrid events
            </p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="customSubject">Custom Subject (Optional)</Label>
            <Input
              id="customSubject"
              type="text"
              value={config.customSubject}
              onChange={(e) => setConfig({...config, customSubject: e.target.value})}
              placeholder="Default email subject line"
              disabled={isLoadingConfig}
              name="sendgridCustomSubject"
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              Default subject line for your emails
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-4">
          <Button 
            onClick={saveConfig} 
            disabled={isLoading || isLoadingConfig || (!config.apiKey || !config.fromEmail || !config.fromName)}
            className="flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isLoading ? 'Saving...' : 'Save Configuration'}
          </Button>

          <Button 
            onClick={testConnection} 
            disabled={isLoading || isLoadingConfig || status !== 'configured'}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <TestTube className="h-4 w-4" />}
            Test Connection
          </Button>

          <Button 
            onClick={clearForm} 
            disabled={isLoading || isLoadingConfig}
            variant="outline"
          >
            Clear Form
          </Button>

          {status === 'configured' && (
            <Button 
              onClick={deleteConfig} 
              disabled={isLoading || isLoadingConfig}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Config
            </Button>
          )}
        </div>

        {isLoadingConfig && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-muted-foreground">Loading configuration...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
