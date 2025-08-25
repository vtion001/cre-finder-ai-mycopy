import Link from "next/link";
import { Button } from "@v1/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@v1/ui/card";

export const metadata = {
  title: "Development Access - CRE Finder AI",
  description: "Development access to dashboard features without authentication",
};

export default function DevPage() {
  const dashboardSections = [
    {
      title: "Working Development Routes",
      description: "Routes that work without authentication",
      links: [
        { name: "Test Dashboard", href: "/test-dashboard", description: "Simple test dashboard with UI components" },
        { name: "Marketing Site", href: "/en", description: "Full marketing site" },
        { name: "Development Home", href: "/dev", description: "This development access page" }
      ]
    },
    {
      title: "Dashboard Features (Needs Auth Fix)",
      description: "These routes need authentication bypass to work",
      links: [
        { name: "Property Search", href: "/en/dashboard/search", description: "Search for properties" },
        { name: "Property Records", href: "/en/dashboard/records", description: "View property records" },
        { name: "Properties", href: "/en/dashboard/properties", description: "Manage properties" }
      ]
    },
    {
      title: "Integrations (Needs Auth Fix)",
      description: "Third-party service integrations",
      links: [
        { name: "VAPI Integration", href: "/en/dashboard/integrations/vapi", description: "Voice AI integration" },
        { name: "Twilio Integration", href: "/en/dashboard/integrations/twilio", description: "SMS and voice integration" },
        { name: "SendGrid Integration", href: "/en/dashboard/integrations/sendgrid", description: "Email integration" },
        { name: "Integrations Overview", href: "/en/dashboard/integrations", description: "All integrations" }
      ]
    },
    {
      title: "Campaigns & Testing (Needs Auth Fix)",
      description: "Campaign management and testing tools",
      links: [
        { name: "Campaigns", href: "/en/dashboard/campaigns", description: "Manage campaigns" },
        { name: "VAPI Test", href: "/en/dashboard/vapi-test", description: "Test VAPI integration" },
        { name: "Twilio Test", href: "/en/dashboard/twilio-test", description: "Test Twilio integration" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Development Access</h1>
              <p className="text-gray-600 mt-1">Access all dashboard features without authentication</p>
            </div>
            <div className="flex space-x-3">
              <Link href="/en">
                <Button variant="outline">Back to Marketing</Button>
              </Link>
              <Link href="/test-dashboard">
                <Button>Test Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {dashboardSections.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">{section.title}</CardTitle>
                <CardDescription className="text-base">{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <Link key={linkIndex} href={link.href}>
                      <div className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                        <div className="font-medium text-gray-900">{link.name}</div>
                        <div className="text-sm text-gray-600">{link.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Development Info */}
        <Card className="mt-8 border-0 shadow-lg bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg text-blue-800">Development Mode Active</CardTitle>
            <CardDescription className="text-blue-700">
              Authentication is bypassed for development purposes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-blue-700 space-y-2">
              <p>✅ Test dashboard is working without authentication</p>
              <p>✅ UI components are rendering properly</p>
              <p>⚠️ Dashboard routes still need authentication bypass fix</p>
              <p>🔄 Ready for dashboard development and testing</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Links */}
        <Card className="mt-8 border-0 shadow-lg bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg text-green-800">Quick Access Links</CardTitle>
            <CardDescription className="text-green-700">
              Direct links to working development areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/test-dashboard">
                <Button variant="outline" className="w-full">Test Dashboard</Button>
              </Link>
              <Link href="/en">
                <Button variant="outline" className="w-full">Marketing</Button>
              </Link>
              <Link href="/dev">
                <Button variant="outline" className="w-full">Dev Access</Button>
              </Link>
              <Link href="/en/dashboard/search">
                <Button variant="outline" className="w-full">Try Search</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mt-8 border-0 shadow-lg bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-lg text-yellow-800">Next Steps for Development</CardTitle>
            <CardDescription className="text-yellow-700">
              What needs to be done to get full dashboard access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-yellow-700 space-y-2">
              <p>1. Fix authentication bypass in dashboard route components</p>
              <p>2. Ensure environment variables are read correctly in server components</p>
              <p>3. Test integration configurations without authentication</p>
              <p>4. Develop dashboard tabs and features</p>
              <p>5. Test all integration configurations</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
