"use client";

import { useState, useEffect } from "react";
import { Button } from "@v1/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@v1/ui/card";
import { Input } from "@v1/ui/input";
import { Label } from "@v1/ui/label";
import { Textarea } from "@v1/ui/textarea";
import { 
  testVapiConfigurationAction, 
  createTestPropertyAction, 
  testDatabaseConnectionAction,
  getVapiConfigurationAction
} from "@/actions/vapi-test-actions";
import { createClient } from "@v1/supabase/client";

interface TestResult {
  success: boolean;
  message: string;
  details?: any;
}

export default function VapiTestPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentVapiConfig, setCurrentVapiConfig] = useState<any>(null);
  const [configStatus, setConfigStatus] = useState<string>("Checking...");

  // VAPI Configuration state
  const [vapiConfig, setVapiConfig] = useState({
    apiKey: "a4db3265-19ad-4bfd-845d-9cfbc03ec200",
    organization: "CRE Finder AI",
    assistantId: "ed68dbc7-19bd-4bab-852a-17fa11e9aa97",
    phoneNumber: "+18643875469",
    webhookUrl: "https://webhook.example.com/vapi",
    customPrompt: "You are a helpful real estate assistant for CRE Finder AI. Help qualify leads and provide property information."
  });

  // Test Property state
  const [testProperty, setTestProperty] = useState({
    title: "Test Commercial Property",
    description: "A test commercial property for VAPI integration testing",
    property_type: "office" as const,
    status: "active" as const,
    price: 500000,
    price_type: "sale" as const,
    square_feet: 5000,
    address_line_1: "123 Test Street",
    city: "Test City",
    state: "TC",
    zip_code: "12345",
    country: "USA",
    contact_info: {
      contact_name: "Test Contact",
      contact_email: "test@example.com",
      contact_phone: "(864) 477-4757",
      contact_company: "Test Company",
      preferred_contact_method: "phone" as const,
    },
    is_featured: false
  });

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsAuthenticated(true);
        setAuthToken(session.access_token);
        // Check current VAPI configuration
        await checkCurrentVapiConfig();
      } else {
        // Try to sign in with the test user
        const { data, error } = await supabase.auth.signInWithPassword({
          email: "user@example.com",
          password: "testpassword123"
        });
        
        if (data.session) {
          setIsAuthenticated(true);
          setAuthToken(data.session.access_token);
          // Check current VAPI configuration after login
          await checkCurrentVapiConfig();
        }
      }
    };

    checkAuth();
  }, []);

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [result, ...prev]);
  };

  const handleTestVapiConfig = async () => {
    // Prevent multiple rapid clicks
    if (isLoading) {
      console.log('VAPI config test already in progress, ignoring click');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await testVapiConfigurationAction(vapiConfig);
      addTestResult({
        success: result.success,
        message: result.message,
        details: result
      });
    } catch (error) {
      addTestResult({
        success: false,
        message: `Error testing VAPI configuration: ${error}`,
        details: error
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTestProperty = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const result = await createTestPropertyAction(testProperty);
      addTestResult({
        success: result.success,
        message: result.message,
        details: result
      });
    } catch (error) {
      addTestResult({
        success: false,
        message: `Error creating test property: ${error}`,
        details: error
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestDatabaseConnection = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const result = await testDatabaseConnectionAction();
      addTestResult({
        success: result.success,
        message: result.message,
        details: result
      });
    } catch (error) {
      addTestResult({
        success: false,
        message: `Error testing database connection: ${error}`,
        details: error
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkCurrentVapiConfig = async () => {
    try {
      const result = await getVapiConfigurationAction();
      if (result.success && result.config) {
        setCurrentVapiConfig(result.config);
        setConfigStatus("Configuration found");
      } else {
        setConfigStatus("No configuration found");
      }
    } catch (error) {
      setConfigStatus("Error checking configuration");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">VAPI Integration Test</h1>
        <p className="text-gray-600 mt-2">Test VAPI configuration and database connectivity</p>
      </div>

      {/* Authentication Status */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
          <CardDescription>Current user authentication status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</span>
          </div>
          {authToken && (
            <p className="text-sm text-gray-500 mt-2">Token: {authToken.substring(0, 20)}...</p>
          )}
        </CardContent>
      </Card>

      {/* VAPI Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>VAPI Configuration</CardTitle>
          <CardDescription>Configure and test VAPI settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                value={vapiConfig.apiKey}
                onChange={(e) => setVapiConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                placeholder="Enter VAPI API key"
              />
            </div>
            <div>
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                value={vapiConfig.organization}
                onChange={(e) => setVapiConfig(prev => ({ ...prev, organization: e.target.value }))}
                placeholder="Enter organization name"
              />
            </div>
            <div>
              <Label htmlFor="assistantId">Assistant ID</Label>
              <Input
                id="assistantId"
                value={vapiConfig.assistantId}
                onChange={(e) => setVapiConfig(prev => ({ ...prev, assistantId: e.target.value }))}
                placeholder="Enter assistant ID"
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={vapiConfig.phoneNumber}
                onChange={(e) => setVapiConfig(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input
              id="webhookUrl"
              value={vapiConfig.webhookUrl}
              onChange={(e) => setVapiConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
              placeholder="Enter webhook URL"
            />
          </div>
          
          <div>
            <Label htmlFor="customPrompt">Custom Prompt</Label>
            <Textarea
              id="customPrompt"
              value={vapiConfig.customPrompt}
              onChange={(e) => setVapiConfig(prev => ({ ...prev, customPrompt: e.target.value }))}
              placeholder="Enter custom prompt"
              rows={3}
            />
          </div>

          <Button 
            onClick={handleTestVapiConfig} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Testing...' : 'Test VAPI Configuration'}
          </Button>
        </CardContent>
      </Card>

      {/* Test Property */}
      <Card>
        <CardHeader>
          <CardTitle>Test Property</CardTitle>
          <CardDescription>Create a test property for testing</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleCreateTestProperty} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Creating...' : 'Create Test Property'}
          </Button>
        </CardContent>
      </Card>

      {/* Database Connection Test */}
      <Card>
        <CardHeader>
          <CardTitle>Database Connection</CardTitle>
          <CardDescription>Test database connectivity</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleTestDatabaseConnection} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Testing...' : 'Test Database Connection'}
          </Button>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
          <CardDescription>Results from recent tests</CardDescription>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No tests run yet</p>
          ) : (
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${result.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="font-medium">{result.message}</span>
                  </div>
                  {result.details && (
                    <pre className="text-xs text-gray-600 mt-2 overflow-x-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
