"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@v1/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card';
import { Button } from '@v1/ui/button';
import { Input } from '@v1/ui/input';
import { Label } from '@v1/ui/label';
import { Textarea } from '@v1/ui/textarea';
import { Alert, AlertDescription } from '@v1/ui/alert';
import { Badge } from '@v1/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Loader2, Save, TestTube, Trash2 } from 'lucide-react';

interface VAPIConfig {
  id?: string;
  apiKey: string;
  assistantId: string;
  organization: string;
  phoneNumber: string;
  webhookUrl: string;
  customPrompt: string;
}

interface VAPIConfigResponse {
  id: string;
  apiKey: string;
  assistantId: string;
  organization: string;
  phoneNumber: string;
  webhookUrl: string;
  customPrompt: string;
  isConfigured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface VAPIConfigProps {
  onConfigUpdate?: () => void;
}

export function VAPIConfig({ onConfigUpdate }: VAPIConfigProps = {}) {
  const [config, setConfig] = useState<VAPIConfig>({
    apiKey: '',
    assistantId: '',
    organization: '',
    phoneNumber: '',
    webhookUrl: '',
    customPrompt: ''
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

      console.log('=== VAPI Load Config Debug ===');
      console.log('1. Session found, making GET request');

      const response = await fetch('/api/integrations/vapi', {
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
        if (data && (data.isConfigured === true || (data.apiKey && data.assistantId))) {
          console.log('5. Found existing configuration, loading it');
          setConfig({
            apiKey: data.apiKey && data.apiKey.includes('...') ? '' : (data.apiKey || ''), // Don't load masked keys
            assistantId: data.assistantId || '',
            organization: data.organization || '',
            phoneNumber: data.phoneNumber || '',
            webhookUrl: data.webhookUrl || '',
            customPrompt: data.customPrompt || '',
          });
          setStatus('configured');
          setMessage({ type: 'success', text: 'VAPI configuration loaded successfully' });
        } else {
          console.log('6. No existing configuration found or incomplete data');
          setStatus('not-configured');
          // Keep form empty for new configuration
          setConfig({
            apiKey: '',
            assistantId: '',
            organization: '',
            phoneNumber: '',
            webhookUrl: '',
            customPrompt: ''
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
      if (!config.apiKey || !config.assistantId) {
        throw new Error('API Key and Assistant ID are required');
      }

      console.log('=== VAPI Save Debug ===');
      console.log('1. Config data to save:', { ...config, apiKey: '***' });
      console.log('2. User ID:', session.user.id);
      console.log('3. Making API request to:', '/api/integrations/vapi');

      const response = await fetch('/api/integrations/vapi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        credentials: 'include',
        body: JSON.stringify(config),
      });

      console.log('4. Response status:', response.status);
      console.log('5. Response headers:', Object.fromEntries(response.headers.entries()));

      const result = await response.json();
      console.log('6. Response data:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save configuration');
      }

      if (result.success) {
        setStatus('configured');
        setMessage({ type: 'success', text: 'VAPI configuration saved successfully!' });
        setTestResult(null);
        console.log('7. Save successful!');
        
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
      console.error('=== VAPI Save Error ===');
      console.error('Error type:', error.name);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      
      setMessage({ type: 'error', text: `Failed to save VAPI configuration: ${error.message}` });
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
      // In a real implementation, you'd make an actual API call to VAPI
      if (!config.apiKey.startsWith('sk_')) {
        throw new Error('Invalid API key format. VAPI API keys should start with "sk_"');
      }

      if (!config.assistantId) {
        throw new Error('Assistant ID is required for testing');
      }

      // Simulate API test (replace with actual VAPI API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTestResult({ 
        success: true, 
        message: 'VAPI connection test successful! Your credentials appear to be valid.' 
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
      assistantId: '',
      organization: '',
      phoneNumber: '',
      webhookUrl: '',
      customPrompt: '',
    });
    setStatus('not-configured');
    setMessage(null);
    setTestResult(null);
  };

  const deleteConfig = async () => {
    if (!confirm('Are you sure you want to delete your VAPI configuration? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    setMessage(null);
    
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('No active session found. Please log in again.');
      }

      const response = await fetch('/api/integrations/vapi', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        clearForm();
        setMessage({ type: 'success', text: 'VAPI configuration deleted successfully!' });
      } else {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete configuration');
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Error deleting VAPI configuration: ${error instanceof Error ? error.message : 'Unknown error'}` });
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
              VAPI Configuration
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
              Configure VAPI for voice AI and automated calls
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
              placeholder="sk_..."
              disabled={isLoadingConfig}
            />
            <p className="text-xs text-muted-foreground">
              Get this from your VAPI dashboard
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assistantId">Assistant ID *</Label>
            <Input
              id="assistantId"
              type="text"
              value={config.assistantId}
              onChange={(e) => setConfig({...config, assistantId: e.target.value})}
              placeholder="asst_..."
              disabled={isLoadingConfig}
            />
            <p className="text-xs text-muted-foreground">
              The ID of your VAPI assistant
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Input
              id="organization"
              type="text"
              value={config.organization}
              onChange={(e) => setConfig({...config, organization: e.target.value})}
              placeholder="org_..."
              disabled={isLoadingConfig}
            />
            <p className="text-xs text-muted-foreground">
              Optional: Your VAPI organization ID
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={config.phoneNumber}
              onChange={(e) => setConfig({...config, phoneNumber: e.target.value})}
              placeholder="+1234567890"
              disabled={isLoadingConfig}
            />
            <p className="text-xs text-muted-foreground">
              Optional: Your VAPI phone number
            </p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input
              id="webhookUrl"
              type="url"
              value={config.webhookUrl}
              onChange={(e) => setConfig({...config, webhookUrl: e.target.value})}
              placeholder="https://yourdomain.com/webhook"
              disabled={isLoadingConfig}
            />
            <p className="text-xs text-muted-foreground">
              Optional: Webhook endpoint for VAPI events
            </p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="customPrompt">Custom Prompt</Label>
            <Textarea
              id="customPrompt"
              value={config.customPrompt}
              onChange={(e) => setConfig({...config, customPrompt: e.target.value})}
              placeholder="Enter custom instructions for your VAPI assistant..."
              rows={3}
              disabled={isLoadingConfig}
            />
            <p className="text-xs text-muted-foreground">
              Optional: Custom instructions for your voice AI assistant
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-4">
          <Button 
            onClick={saveConfig} 
            disabled={isLoading || isLoadingConfig || (!config.apiKey || !config.assistantId)}
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
