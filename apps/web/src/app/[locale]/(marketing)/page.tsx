import Link from "next/link";
import { Button } from "@v1/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@v1/ui/card";

export const metadata = {
  title: "CREFinderAI - Commercial Real Estate AI Solution",
  description: "Find commercial real estate properties with AI-powered search and analysis",
};

export default function Marketing() {
  const features = [
    {
      title: "Instant Property Search",
      description: "Find properties in seconds instead of waiting 1-2 months. Our proprietary database updates daily with new commercial real estate listings across all counties.",
      icon: "🔍"
    },
    {
      title: "Asset Type Filtering",
      description: "Filter by retail, office, industrial, multifamily, and more to find exactly the type of commercial property you're looking for.",
      icon: "🏢"
    },
    {
      title: "Skip-Trace Owner Info",
      description: "Instantly access property owner contact information including phone numbers and email addresses to connect directly with decision makers.",
      icon: "📞"
    },
    {
      title: "County-Level Data",
      description: "Access property data from any county nationwide, giving you the most comprehensive coverage for your investment strategy.",
      icon: "🗺️"
    },
    {
      title: "Property Updates",
      description: "Receive updates on any changes to your subscribed property data set.",
      icon: "🔄"
    },
    {
      title: "AI-Powered Analysis",
      description: "Leverage artificial intelligence to analyze market trends and identify investment opportunities.",
      icon: "🤖"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      description: "Perfect for individual investors",
      features: [
        "Up to 1,000 property searches",
        "Basic owner contact info",
        "Email support",
        "County-level data access"
      ]
    },
    {
      name: "Professional",
      price: "$299",
      period: "/month",
      description: "Ideal for real estate professionals",
      features: [
        "Up to 10,000 property searches",
        "Advanced owner contact info",
        "Priority support",
        "Multi-county data access",
        "Property update notifications"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large teams and organizations",
      features: [
        "Unlimited property searches",
        "Full owner contact database",
        "Dedicated support",
        "Nationwide data access",
        "Custom integrations",
        "API access"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Find Commercial Real Estate Properties in Seconds
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            CREFinderAI uses advanced AI technology to help you discover, analyze, and connect with commercial real estate opportunities nationwide.
          </p>
          <div className="space-x-4">
            <Link href="/en/login">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Sign In
              </Button>
            </Link>
            <Link href="/en/signup">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Real Estate Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to find and analyze commercial real estate properties efficiently.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Search Properties</h3>
              <p className="text-gray-600">Use our advanced filters to find properties by location, asset type, and criteria.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Owner Info</h3>
              <p className="text-gray-600">Access detailed owner contact information and property details instantly.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Close</h3>
              <p className="text-gray-600">Reach out to property owners and close deals faster than ever before.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Flexible pricing options for every real estate professional
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`border-0 shadow-lg ${index === 1 ? 'ring-2 ring-blue-500 scale-105' : ''}`}>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-blue-600">
                    {plan.price}<span className="text-lg text-gray-500">{plan.period}</span>
                  </div>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Button className="w-full" variant={index === 1 ? "default" : "outline"}>
                      Get Started
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Real Estate Business?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of real estate professionals who are already using CREFinderAI to find properties faster and close more deals.
          </p>
          <div className="space-x-4">
            <Link href="/en/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/en/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">CREFinderAI</h3>
              <p className="text-gray-400">
                The leading AI-powered commercial real estate search platform.
              </p>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">Features</Link></li>
                <li><Link href="#" className="hover:text-white">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">About</Link></li>
                <li><Link href="#" className="hover:text-white">Blog</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CREFinderAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
