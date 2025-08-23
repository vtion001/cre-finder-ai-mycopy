"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@v1/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card';
import { Button } from '@v1/ui/button';
import { Input } from '@v1/ui/input';
import { Label } from '@v1/ui/label';
import { Textarea } from '@v1/ui/textarea';
import { Badge } from '@v1/ui/badge';
import { MessageSquare, Settings, CheckCircle2, XCircle, AlertCircle, Loader2, Phone } from 'lucide-react';

interface TwilioTestConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
  messagingServiceSid: string;
  webhookUrl: string;
  customMessage: string;
}

interface TestResult {
  success: boolean;
  message: string;
  details?: any;
  timestamp: string;
}

export default function TwilioTestPage() {
  const [config, setConfig] = useState<TwilioTestConfig>({
    accountSid: '',
    authToken: '',
    phoneNumber: '',
    messagingServiceSid: '',
    webhookUrl: '',
    customMessage: 'Thank you for your interest in our properties. A CRE Finder AI representative will contact you soon.'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [hasLoadedConfig, setHasLoadedConfig] = useState(false);

  const supabase = createClient();

  // Load existing configuration on component mount
  useEffect(() => {
    loadExistingConfig();
  }, []);

  const loadExistingConfig = async () => {
    try {
      setIsLoadingConfig(true);
      
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.log('No active session found');
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
      console.log('Session found, user ID:', session.user.id);

      // Load existing Twilio configuration
      const response = await fetch('/api/integrations/twilio', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isConfigured && data.accountSid) {
          console.log('Loading existing configuration:', data);
          setConfig(prev => ({
            ...prev,
            accountSid: data.accountSid || '',
            phoneNumber: data.phoneNumber || '',
            messagingServiceSid: data.messagingServiceSid || '',
            webhookUrl: data.webhookUrl || '',
            customMessage: data.customMessage || prev.customMessage,
          }));
        } else {
          console.log('No existing configuration found, keeping empty fields');
          // Ensure fields are empty if no config exists
          setConfig(prev => ({
            ...prev,
            accountSid: '',
            authToken: '',
            phoneNumber: '',
            messagingServiceSid: '',
            webhookUrl: '',
          }));
        }
      } else {
        console.log('Error loading configuration, keeping empty fields');
        // Ensure fields are empty on error
        setConfig(prev => ({
          ...prev,
          accountSid: '',
          authToken: '',
          phoneNumber: '',
          messagingServiceSid: '',
          webhookUrl: '',
        }));
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
      // Ensure fields are empty on error
      setConfig(prev => ({
        ...prev,
        accountSid: '',
        authToken: '',
        phoneNumber: '',
        messagingServiceSid: '',
        webhookUrl: '',
      }));
      addTestResult({
        success: false,
        message: `Error loading configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setIsLoadingConfig(false);
      setHasLoadedConfig(true);
    }
  };

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [result, ...prev]);
  };

  const testTwilioConfiguration = async () => {
    setIsLoading(true);
    setCurrentTest('Testing Twilio Configuration...');

    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('No active session found. Please log in again.');
      }

      console.log('Using session for user:', session.user.id);

      // Test POST endpoint (save configuration)
      const postResponse = await fetch('/api/integrations/twilio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        credentials: 'include',
        body: JSON.stringify(config),
      });

      const postData = await postResponse.json();

      if (postResponse.ok) {
        addTestResult({
          success: true,
          message: 'Twilio configuration saved successfully',
          details: postData,
          timestamp: new Date().toLocaleTimeString()
        });
      } else {
        addTestResult({
          success: false,
          message: `Failed to save Twilio configuration: ${postData.error || 'Unknown error'}`,
          details: { status: postResponse.status, data: postData },
          timestamp: new Date().toLocaleTimeString()
        });
      }

      // Test GET endpoint (retrieve configuration)
      const getResponse = await fetch('/api/integrations/twilio', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        credentials: 'include',
      });
      
      const getData = await getResponse.json();

      if (getResponse.ok) {
        addTestResult({
          success: true,
          message: 'Twilio configuration retrieved successfully',
          details: getData,
          timestamp: new Date().toLocaleTimeString()
        });
      } else {
        addTestResult({
          success: false,
          message: `Failed to retrieve Twilio configuration: ${getData.error || 'Unknown error'}`,
          details: { status: getResponse.status, data: getData },
          timestamp: new Date().toLocaleTimeString()
        });
      }

      // Test integration status
      const statusResponse = await fetch('/api/integrations/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        credentials: 'include',
      });
      
      const statusData = await statusResponse.json();

      if (statusResponse.ok) {
        addTestResult({
          success: true,
          message: 'Integration status retrieved successfully',
          details: statusData,
          timestamp: new Date().toLocaleTimeString()
        });
      } else {
        addTestResult({
          success: false,
          message: `Failed to get integration status: ${statusData.error || 'Unknown error'}`,
          details: { status: statusResponse.status, data: statusData },
          timestamp: new Date().toLocaleTimeString()
        });
      }

    } catch (error) {
      addTestResult({
        success: false,
        message: `Error testing Twilio configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setIsLoading(false);
      setCurrentTest('');
    }
  };

  const testSmsCapability = async () => {
    setIsLoading(true);
    setCurrentTest('Testing SMS Capability...');

    try {
      // This would be a test SMS endpoint - for now we'll simulate
      addTestResult({
        success: true,
        message: 'SMS capability test completed (simulated)',
        details: { 
          note: 'SMS sending would be tested with real Twilio credentials',
          phoneNumber: config.phoneNumber,
          message: config.customMessage
        },
        timestamp: new Date().toLocaleTimeString()
      });

    } catch (error) {
      addTestResult({
        success: false,
        message: `Error testing SMS capability: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setIsLoading(false);
      setCurrentTest('');
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const clearForm = () => {
    setConfig({
      accountSid: '',
      authToken: '',
      phoneNumber: '',
      messagingServiceSid: '',
      webhookUrl: '',
      customMessage: 'Thank you for your interest in our properties. A CRE Finder AI representative will contact you soon.'
    });
    setTestResults([]);
  };

  const getStatusIcon = (success: boolean) => {
    if (success) return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  const getStatusBadge = (success: boolean) => {
    return success ? (
      <Badge className="bg-green-100 text-green-800">PASS</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">FAIL</Badge>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Twilio Integration Test</h1>
        <p className="text-gray-600">
          Configure and test Twilio SMS/Voice integration for lead communication
        </p>
        
        {/* Authentication Status */}
        <div className="mt-4 p-3 rounded-lg border">
          <div className="flex items-center gap-2">
            {isLoadingConfig ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-blue-800">Loading configuration...</span>
              </>
            ) : isAuthenticated ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-green-800">Authenticated ✓</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-800">Not authenticated ✗</span>
              </>
            )}
          </div>
          
          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-2 text-xs text-gray-600">
              <div>Config loaded: {hasLoadedConfig ? 'Yes' : 'No'}</div>
              <div>Account SID length: {config.accountSid.length}</div>
              <div>Auth Token length: {config.authToken.length}</div>
              <div>Phone Number: {config.phoneNumber || 'Empty'}</div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Twilio Configuration
            </CardTitle>
            <CardDescription>
              Configure Twilio with your credentials for SMS and Voice capabilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isAuthenticated && !isLoadingConfig && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-yellow-800">
                    Please log in to configure Twilio integration. You'll be redirected to the login page.
                  </span>
                </div>
              </div>
            )}

            {isAuthenticated && hasLoadedConfig && !config.accountSid && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800">
                    Ready to configure! Enter your Twilio credentials below.
                  </span>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="accountSid">Account SID</Label>
              <Input
                id="accountSid"
                value={config.accountSid}
                onChange={(e) => setConfig(prev => ({ ...prev, accountSid: e.target.value }))}
                placeholder="Enter Twilio Account SID"
                disabled={isLoadingConfig}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authToken">Auth Token</Label>
              <Input
                id="authToken"
                type="password"
                value={config.authToken}
                onChange={(e) => setConfig(prev => ({ ...prev, authToken: e.target.value }))}
                placeholder="Enter Twilio Auth Token"
                disabled={isLoadingConfig}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Twilio Phone Number</Label>
              <Input
                id="phoneNumber"
                value={config.phoneNumber}
                onChange={(e) => setConfig(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="Enter Twilio phone number"
                disabled={isLoadingConfig}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="messagingServiceSid">Messaging Service SID</Label>
              <Input
                id="messagingServiceSid"
                value={config.messagingServiceSid}
                onChange={(e) => setConfig(prev => ({ ...prev, messagingServiceSid: e.target.value }))}
                placeholder="Enter Messaging Service SID (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                value={config.webhookUrl}
                onChange={(e) => setConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                placeholder="Enter webhook URL for SMS events"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customMessage">Default SMS Message</Label>
              <Textarea
                id="customMessage"
                value={config.customMessage}
                onChange={(e) => setConfig(prev => ({ ...prev, customMessage: e.target.value }))}
                placeholder="Enter default SMS message template"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={testTwilioConfiguration} 
                disabled={isLoading || !isAuthenticated || !config.accountSid || !config.authToken}
                className="flex-1"
              >
                {isLoading && currentTest === 'Testing Twilio Configuration...' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-2" />
                    Test Twilio Config
                  </>
                )}
              </Button>

              <Button 
                onClick={loadExistingConfig} 
                disabled={isLoading || isLoadingConfig}
                variant="outline"
                className="flex-1"
              >
                {isLoadingConfig ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Refresh Config
                  </>
                )}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={clearForm} 
                variant="outline"
                className="flex-1"
              >
                Clear Form
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Test Results
            </CardTitle>
            <CardDescription>
              Results from Twilio integration tests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentTest && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="text-blue-800">{currentTest}</span>
                </div>
              </div>
            )}

            {testResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No test results yet. Run a test to see results here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.success)}
                        <span className="font-medium">{result.message}</span>
                      </div>
                      {getStatusBadge(result.success)}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Time:</span> {result.timestamp}
                    </div>
                    {result.details && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                          View Details
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}

            {testResults.length > 0 && (
              <Button 
                onClick={clearResults} 
                variant="outline" 
                className="w-full mt-4"
              >
                Clear Results
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Configuration Status */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Configuration Status</CardTitle>
          <CardDescription>
            Current Twilio configuration status and requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Authentication</Label>
              <div className="flex items-center gap-2">
                {isLoadingConfig ? (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                ) : isAuthenticated ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm text-gray-900">
                  {isLoadingConfig ? 'Loading...' : isAuthenticated ? 'Authenticated' : 'Not authenticated'}
                </span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Account SID</Label>
              <div className="flex items-center gap-2">
                {config.accountSid ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm text-gray-900">
                  {config.accountSid ? 'Configured' : 'Required'}
                </span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Auth Token</Label>
              <div className="flex items-center gap-2">
                {config.authToken ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm text-gray-900">
                  {config.authToken ? 'Configured' : 'Required'}
                </span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
              <div className="flex items-center gap-2">
                {config.phoneNumber ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm text-gray-900">
                  {config.phoneNumber || 'Required'}
                </span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Ready to Test</Label>
              <div className="flex items-center gap-2">
                {!isLoadingConfig && isAuthenticated && config.accountSid && config.authToken ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm text-gray-900">
                  {isLoadingConfig ? 'Loading...' : 
                   !isAuthenticated ? 'Not authenticated' :
                   !config.accountSid || !config.authToken ? 'Missing credentials' : 'Yes'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
