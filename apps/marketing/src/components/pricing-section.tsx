"use client";

import { Button } from "@v1/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@v1/ui/card";
import { getDashboardUrl } from "@v1/utils/environment";
import { Check } from "lucide-react";
const PricingSection = () => {
  const tiers = [
    {
      price: "$1/property",
      description:
        "Plus .50/property/mo for market exclusivity and property updates",
      features: [
        "Exclusive access to entire city/county",
        "Free skip-tracing",
        "Nationwide county access",
        "Priority email support",
        "Data export",
        "Monthly updates on properties",
        "Market trend reports",
        "First access to AI outbound system",
      ],
      cta: "Start Professional",
      mostPopular: true,
    },
    {
      name: "Enterprise",
      price: "Schedule Demo",
      description: "For large investment firms and institutional investors.",
      features: [
        "All Professional features",
        "Dedicated account manager",
        "Phone & email support",
      ],
      cta: "Schedule a demo",
      mostPopular: false,
    },
  ];
  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Pricing
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600">
            Flexible pricing for small to large real estate investors
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2 max-w-4xl mx-auto">
          {tiers.map((tier, index) => (
            <Card
              key={index}
              className={`flex flex-col border ${tier.mostPopular ? "border-[#0072FF] ring-2 ring-[#0072FF]" : "border-gray-200"} shadow-lg animate-fade-in opacity-0`}
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              {tier.mostPopular && (
                <div className="bg-[#0072FF] py-1 text-center text-sm font-medium text-white">
                  Limited to 1 account per asset type and city/county
                </div>
              )}
              <CardHeader>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {tier.price}
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
                  className={`w-full ${tier.mostPopular ? "bg-[#0072FF] hover:bg-[#0060CC]" : "bg-gray-800 hover:bg-gray-700"}`}
                  onClick={() =>
                    window.open(
                      tier.mostPopular
                        ? `${getDashboardUrl()}/dashboard/search`
                        : "https://cal.com/jaceperry/crefinder",
                      "_blank",
                    )
                  }
                >
                  {tier.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-base text-slate-600">
            Only 1 license per asset type + city/county!
          </p>
        </div>
      </div>
    </section>
  );
};
export default PricingSection;
