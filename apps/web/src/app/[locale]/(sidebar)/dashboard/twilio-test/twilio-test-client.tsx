"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card';
import { Button } from '@v1/ui/button';
import { Input } from '@v1/ui/input';
import { Label } from '@v1/ui/label';
import { Textarea } from '@v1/ui/textarea';
import { Badge } from '@v1/ui/badge';
import { MessageSquare, Settings, CheckCircle2, XCircle, AlertCircle, Loader2, Phone, Database } from 'lucide-react';
import { 
  testTwilioConfigurationAction,
  testTwilioSMSAction,
  testTwilioVoiceAction
} from '@/actions/twilio-test-actions';
import { setupAllTestData } from '@/lib/auth-utils';

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

interface TwilioTestClientProps {
  isAuthenticated: boolean;
  testDataStatus: {
    propertyRecords: boolean;
    integrations: boolean;
    campaigns: boolean;
    searchData: boolean;
    vapiConfig: boolean;
    twilioConfig: boolean;
  };
  twilioConfig: any;
  dbConnectionTest: {
    success: boolean;
    message: string;
  };
  userId?: string;
}

export function TwilioTestClient({ 
  isAuthenticated, 
  testDataStatus, 
  twilioConfig, 
  dbConnectionTest,
  userId 
}: TwilioTestClientProps) {
  const [config, setConfig] = useState<TwilioTestConfig>({
    accountSid: twilioConfig?.accountSid || '',
    authToken: '',
    phoneNumber: twilioConfig?.phoneNumber || '',
    messagingServiceSid: twilioConfig?.messagingServiceSid || '',
    webhookUrl: twilioConfig?.webhookUrl || '',
    customMessage: twilioConfig?.customMessage || 'Thank you for your interest in our properties. A CRE Finder AI representative will contact you soon.'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [isSettingUp, setIsSettingUp] = useState(false);

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [result, ...prev]);
  };

  const testTwilioConfiguration = async () => {
    setIsLoading(true);
    setCurrentTest('Testing Twilio Configuration...');

    try {
      const result = await testTwilioConfigurationAction(config);
      
      if (result.success) {
        addTestResult({
          success: true,
          message: 'Twilio configuration saved successfully',
          details: result,
          timestamp: new Date().toLocaleTimeString()
        });
      } else {
        addTestResult({
          success: false,
          message: `Failed to save Twilio configuration: ${result.error || 'Unknown error'}`,
          details: result,
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
      const result = await testTwilioSMSAction(config.phoneNumber, config.customMessage);
      
      addTestResult({
        success: result.success,
        message: result.message,
        details: result.details,
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

  const testVoiceCapability = async () => {
    setIsLoading(true);
    setCurrentTest('Testing Voice Capability...');

    try {
      const result = await testTwilioVoiceAction(config.phoneNumber);
      
      addTestResult({
        success: result.success,
        message: result.message,
        details: result.details,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (error) {
      addTestResult({
        success: false,
        message: `Error testing Voice capability: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setIsLoading(false);
      setCurrentTest('');
    }
  };

  const handleSetupTestData = async () => {
    setIsSettingUp(true);
    try {
      const result = await setupAllTestData();
      if (result.success) {
        addTestResult({
          success: true,
          message: "Test data setup completed successfully",
          details: result.results,
          timestamp: new Date().toLocaleTimeString()
        });
        // Refresh the page to reflect new data
        window.location.reload();
      } else {
        addTestResult({
          success: false,
          message: `Failed to setup test data: ${result.error}`,
          details: result,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    } catch (error) {
      addTestResult({
        success: false,
        message: `Error setting up test data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error,
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setIsSettingUp(false);
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
            {isAuthenticated ? (
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
            {!isAuthenticated && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-yellow-800">
                    Please log in to configure Twilio integration.
                  </span>
                </div>
              </div>
            )}

            {isAuthenticated && twilioConfig && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800">
                    Existing configuration found. You can update it below.
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
                disabled={!isAuthenticated}
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
                disabled={!isAuthenticated}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Twilio Phone Number</Label>
              <Input
                id="phoneNumber"
                value={config.phoneNumber}
                onChange={(e) => setConfig(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="Enter Twilio phone number"
                disabled={!isAuthenticated}
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
                onClick={testSmsCapability} 
                disabled={isLoading || !isAuthenticated || !config.accountSid || !config.authToken}
                variant="outline"
                className="flex-1"
              >
                {isLoading && currentTest === 'Testing SMS Capability...' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Test SMS
                  </>
                )}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={testVoiceCapability} 
                disabled={isLoading || !isAuthenticated || !config.accountSid || !config.authToken}
                variant="outline"
                className="flex-1"
              >
                {isLoading && currentTest === 'Testing Voice Capability...' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4 mr-2" />
                    Test Voice
                  </>
                )}
              </Button>

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

      {/* Test Data Status */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Test Data Status</CardTitle>
          <CardDescription>
            Current test data setup status and requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Authentication</Label>
                <div className="flex items-center gap-2">
                  {isAuthenticated ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm text-gray-900">
                    {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
                  </span>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Database Connection</Label>
                <div className="flex items-center gap-2">
                  {dbConnectionTest.success ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm text-gray-900">
                    {dbConnectionTest.success ? 'Connected' : 'Connection failed'}
                  </span>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Twilio Configuration</Label>
                <div className="flex items-center gap-2">
                  {twilioConfig ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm text-gray-900">
                    {twilioConfig ? 'Configured' : 'Not configured'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Test Data Components Status */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Test Data Components</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(testDataStatus).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {value ? '✅' : '❌'} {key.charAt(0).toUpperCase() + key.slice(1)}
                    </div>
                  </div>
                ))}
              </div>
              
              {!Object.values(testDataStatus).every(Boolean) && (
                <div className="mt-4">
                  <Button
                    onClick={handleSetupTestData}
                    disabled={isSettingUp}
                    className="w-full"
                  >
                    {isSettingUp ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Setting up test data...
                      </>
                    ) : (
                      <>
                        <Database className="mr-2 h-4 w-4" />
                        Setup Test Data
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
