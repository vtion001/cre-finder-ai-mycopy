import Link from "next/link";
import { Button } from "@v1/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@v1/ui/card";

export const metadata = {
  title: "Development Dashboard - CRE Finder AI",
  description: "Development dashboard for testing without authentication",
};

export default function DevDashboard() {
  const dashboardSections = [
    {
      title: "Search & Properties",
      description: "Property search interface and management",
      links: [
        { name: "Property Search", href: "/en/dashboard/search", description: "Search for properties" },
        { name: "Property Records", href: "/en/dashboard/records", description: "View property records" },
        { name: "Properties", href: "/en/dashboard/properties", description: "Manage properties" }
      ]
    },
    {
      title: "Integrations",
      description: "Third-party service integrations",
      links: [
        { name: "VAPI Integration", href: "/en/dashboard/integrations/vapi", description: "Voice AI integration" },
        { name: "Twilio Integration", href: "/en/dashboard/integrations/twilio", description: "SMS and voice integration" },
        { name: "SendGrid Integration", href: "/en/dashboard/integrations/sendgrid", description: "Email integration" },
        { name: "Integrations Overview", href: "/en/dashboard/integrations", description: "All integrations" }
      ]
    },
    {
      title: "Campaigns & Testing",
      description: "Campaign management and testing tools",
      links: [
        { name: "Campaigns", href: "/en/dashboard/campaigns", description: "Manage campaigns" },
        { name: "VAPI Test", href: "/en/dashboard/vapi-test", description: "Test VAPI integration" },
        { name: "Twilio Test", href: "/en/dashboard/twilio-test", description: "Test Twilio integration" }
      ]
    },
    {
      title: "Account & Settings",
      description: "User account and application settings",
      links: [
        { name: "Account Settings", href: "/en/dashboard/account", description: "User account settings" },
        { name: "Billing", href: "/en/dashboard/account/billing", description: "Billing and subscriptions" }
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
              <h1 className="text-3xl font-bold text-gray-900">Development Dashboard</h1>
              <p className="text-gray-600 mt-1">Access all dashboard features without authentication</p>
            </div>
            <div className="flex space-x-3">
              <Link href="/en">
                <Button variant="outline">Back to Marketing</Button>
              </Link>
              <Link href="/en/dashboard/search">
                <Button>Go to Main Dashboard</Button>
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
              <p>• All dashboard routes are accessible without login</p>
              <p>• Mock user data is provided for testing</p>
              <p>• Integration configurations can be tested</p>
              <p>• Remember to re-enable authentication before production</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
