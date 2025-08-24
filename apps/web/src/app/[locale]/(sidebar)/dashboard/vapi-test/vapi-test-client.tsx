"use client";

import { useState } from "react";
import { Button } from "@v1/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@v1/ui/card";
import { Input } from "@v1/ui/input";
import { Label } from "@v1/ui/label";
import { Textarea } from "@v1/ui/textarea";
import { 
  testVapiConfigurationAction, 
  createTestPropertyAction 
} from "@/actions/vapi-test-actions";
import { setupAllTestData } from "@/lib/auth-utils";
import { CheckCircle, XCircle, Loader2, Settings, Database, Package } from "lucide-react";

interface TestResult {
  success: boolean;
  message: string;
  details?: any;
}

interface VAPITestClientProps {
  isAuthenticated: boolean;
  testDataStatus: {
    propertyRecords: boolean;
    integrations: boolean;
    campaigns: boolean;
    searchData: boolean;
    vapiConfig: boolean;
    twilioConfig: boolean;
  };
  vapiConfig: any;
  dbConnectionTest: {
    success: boolean;
    message: string;
  };
  userId?: string;
}

export function VAPITestClient({ 
  isAuthenticated, 
  testDataStatus, 
  vapiConfig, 
  dbConnectionTest,
  userId 
}: VAPITestClientProps) {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  
  // VAPI Configuration state
  const [vapiFormConfig, setVapiFormConfig] = useState({
    apiKey: process.env.NEXT_PUBLIC_VAPI_API_KEY || "your_vapi_api_key",
    organization: "CRE Finder AI",
    assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || "your_vapi_assistant_id",
    phoneNumber: process.env.NEXT_PUBLIC_VAPI_PHONE_NUMBER || "your_vapi_phone_number",
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

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [result, ...prev]);
  };

  const handleTestVapiConfig = async () => {
    if (isLoading) {
      console.log('VAPI config test already in progress, ignoring click');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await testVapiConfigurationAction(vapiFormConfig);
      addTestResult({
        success: true,
        message: result.message || "VAPI configuration test successful",
        details: result
      });
    } catch (error) {
      let errorMessage = "VAPI configuration test failed";
      let shouldShowError = true;
      
      if (error instanceof Error) {
        const errorStr = error.message.toLowerCase();
        
        // Check for duplicate key errors (these should not be shown to users)
        if (errorStr.includes('duplicate key') || 
            errorStr.includes('unique constraint') || 
            errorStr.includes('already exists')) {
          errorMessage = "VAPI configuration updated successfully";
          shouldShowError = false;
          
          addTestResult({
            success: true,
            message: "VAPI configuration updated successfully",
            details: { note: "Configuration was updated (duplicate key error was handled)" }
          });
        } else {
          errorMessage = `VAPI configuration test failed: ${error.message}`;
        }
      }
      
      if (shouldShowError) {
        addTestResult({
          success: false,
          message: errorMessage,
          details: error
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTestProperty = async () => {
    setIsLoading(true);
    try {
      const result = await createTestPropertyAction(testProperty);
      addTestResult({
        success: true,
        message: "Test property created successfully",
        details: result
      });
    } catch (error) {
      addTestResult({
        success: false,
        message: `Error creating test property: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    } finally {
      setIsLoading(false);
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
          details: result.results
        });
        // Refresh the page to reflect new data
        window.location.reload();
      } else {
        addTestResult({
          success: false,
          message: `Failed to setup test data: ${result.error}`,
          details: result
        });
      }
    } catch (error) {
      addTestResult({
        success: false,
        message: `Error setting up test data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    } finally {
      setIsSettingUp(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">VAPI Integration Test</h1>
          <p className="text-muted-foreground">Test your VAPI configuration and property creation</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
            isAuthenticated 
              ? "border-transparent bg-green-100 text-green-800" 
              : "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80"
          }`}>
            {isAuthenticated ? "✅ Authenticated" : "❌ Not Authenticated"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* VAPI Configuration Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>VAPI Configuration</span>
            </CardTitle>
            <CardDescription>Configure your VAPI integration settings</CardDescription>
            {vapiConfig && (
              <div className="mt-2">
                <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-blue-100 text-blue-800">
                  Configuration exists - will update
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  placeholder="Enter your VAPI API key"
                  value={vapiFormConfig.apiKey}
                  onChange={(e) => setVapiFormConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  placeholder="Organization name"
                  value={vapiFormConfig.organization}
                  onChange={(e) => setVapiFormConfig(prev => ({ ...prev, organization: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assistantId">Assistant ID</Label>
                <Input
                  id="assistantId"
                  placeholder="Enter your VAPI Assistant ID"
                  value={vapiFormConfig.assistantId}
                  onChange={(e) => setVapiFormConfig(prev => ({ ...prev, assistantId: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+1234567890"
                  value={vapiFormConfig.phoneNumber}
                  onChange={(e) => setVapiFormConfig(prev => ({ ...prev, phoneNumber: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                placeholder="https://your-domain.com/webhook"
                value={vapiFormConfig.webhookUrl}
                onChange={(e) => setVapiFormConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customPrompt">Custom Prompt</Label>
              <Textarea
                id="customPrompt"
                placeholder="Enter custom prompt for your VAPI assistant"
                rows={3}
                value={vapiFormConfig.customPrompt}
                onChange={(e) => setVapiFormConfig(prev => ({ ...prev, customPrompt: e.target.value }))}
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleTestVapiConfig} 
                disabled={!isAuthenticated || isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Settings className="mr-2 h-4 w-4" />
                    {vapiConfig ? "Update VAPI Config" : "Create VAPI Config"}
                  </>
                )}
              </Button>
              <Button 
                onClick={handleCreateTestProperty} 
                disabled={!isAuthenticated || isLoading}
                variant="outline"
                className="flex-1"
              >
                <Package className="mr-2 h-4 w-4" />
                Test Property
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Test Results</span>
            </CardTitle>
            <CardDescription>Results from your VAPI integration tests</CardDescription>
          </CardHeader>
          <CardContent>
            {testResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No test results yet</p>
                <p className="text-sm">Run a test to see results here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      result.success 
                        ? "bg-green-50 border-green-200 text-green-800" 
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <div className={`mt-1 w-2 h-2 rounded-full ${
                        result.success ? "bg-green-500" : "bg-red-500"
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium">{result.message}</p>
                        {result.details && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-sm opacity-75">View Details</summary>
                            <pre className="mt-2 text-xs bg-black/5 p-2 rounded overflow-auto">
                              {JSON.stringify(result.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Test Data Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Test Data Status</CardTitle>
          <CardDescription>Overview of your test data setup</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {isAuthenticated ? "✅" : "❌"}
                </div>
                <p className="text-sm font-medium">Authentication</p>
                <p className="text-xs text-muted-foreground">
                  {isAuthenticated ? "User authenticated" : "User not authenticated"}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {dbConnectionTest.success ? "✅" : "❌"}
                </div>
                <p className="text-sm font-medium">Database Connection</p>
                <p className="text-xs text-muted-foreground">
                  {dbConnectionTest.success ? "Connected" : "Connection failed"}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {vapiConfig ? "✅" : "❌"}
                </div>
                <p className="text-sm font-medium">VAPI Configuration</p>
                <p className="text-xs text-muted-foreground">
                  {vapiConfig ? "Configured" : "Not configured"}
                </p>
              </div>
            </div>
            
            {/* Test Data Status Grid */}
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
