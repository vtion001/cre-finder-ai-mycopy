import { Button } from "@v1/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@v1/ui/card";
import { cn } from "@v1/ui/cn";
import { Check } from "lucide-react";

export const PricingSection = () => {
  const tiers = [
    {
      name: "Standard",
      price: "$499",
      description: "Perfect for individual investors and small teams.",
      features: [
        "Up to 500 property searches per month",
        "Skip-trace up to 500 properties",
        "1 county access",
        "Email support",
        "Data export (CSV,Excel)",
        "Monthly updates",
      ],
      cta: "Start Standard",
      mostPopular: false,
    },
    {
      name: "Professional",
      price: "$999",
      description: "For active investors and mid-sized investment firms.",
      features: [
        "Up to 1,000 property searches per month",
        "Skip-trace up to 1,000 properties",
        "Nationwide county access",
        "Priority email support",
        "Data export (CSV, PDF, Excel)",
        "Weekly updates",
        "Market trend reports",
        "API access",
      ],
      cta: "Start Professional",
      mostPopular: true,
    },
    {
      name: "Enterprise",
      price: "Contact Us",
      description: "For large investment firms and institutional investors.",
      features: [
        "All Professional features",
        "Unlimited skip-tracing",
        "Dedicated account manager",
        "Custom data integrations",
        "Phone & email support",
        "Team collaboration tools",
        "Advanced analytics dashboard",
        "Daily updates",
      ],
      cta: "Contact Sales",
      mostPopular: false,
    },
  ];
  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Pricing Plans
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Choose the right plan that fits your investment strategy.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <Card
              key={index}
              className={cn(
                "flex flex-col border shadow-lg animate-fade-in opacity-0",
                tier.mostPopular
                  ? "border-blue-600 ring-2 ring-blue-600"
                  : "border-gray-200",
              )}
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              {tier.mostPopular && (
                <div className="bg-blue-600 py-1 text-center text-sm font-medium text-white">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {tier.name}
                </CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {tier.price}
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    /month
                  </span>
                </div>
                <CardDescription className="mt-4 text-base text-gray-600">
                  {tier.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${tier.mostPopular ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-800 hover:bg-gray-700"}`}
                >
                  {tier.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-base text-gray-500">
            Each county and asset type is limited to 1 person.
          </p>
        </div>
      </div>
    </section>
  );
};
