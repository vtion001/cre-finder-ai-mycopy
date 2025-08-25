import { Button } from "@v1/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@v1/ui/card";

export const metadata = {
  title: "Test Dashboard - CRE Finder AI",
  description: "Simple test dashboard without authentication",
};

export default function TestDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Test Dashboard</h1>
          <p className="text-xl text-gray-600">This is a simple test dashboard without authentication</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-blue-600">Search Properties</CardTitle>
              <CardDescription>Test property search functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                This would be the property search interface.
              </p>
              <Button className="w-full">Test Search</Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-green-600">Integrations</CardTitle>
              <CardDescription>Test integration configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                This would be the integrations management interface.
              </p>
              <Button className="w-full">Test Integrations</Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-purple-600">Campaigns</CardTitle>
              <CardDescription>Test campaign management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                This would be the campaign management interface.
              </p>
              <Button className="w-full">Test Campaigns</Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-orange-600">Records</CardTitle>
              <CardDescription>Test property records</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                This would be the property records interface.
              </p>
              <Button className="w-full">Test Records</Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-red-600">VAPI Test</CardTitle>
              <CardDescription>Test VAPI integration</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                This would be the VAPI testing interface.
              </p>
              <Button className="w-full">Test VAPI</Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-indigo-600">Twilio Test</CardTitle>
              <CardDescription>Test Twilio integration</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                This would be the Twilio testing interface.
              </p>
              <Button className="w-full">Test Twilio</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="border-0 shadow-lg bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">Development Status</CardTitle>
              <CardDescription className="text-blue-700">
                Dashboard development and testing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-blue-700 space-y-2">
                <p>✅ Basic routing is working</p>
                <p>✅ UI components are rendering</p>
                <p>✅ No authentication required</p>
                <p>🔄 Ready for dashboard development</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
