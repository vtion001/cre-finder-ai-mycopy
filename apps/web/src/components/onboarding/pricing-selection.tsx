"use client";

import { saveSubscriptionAction } from "@/actions/save-subscription-action";
import type { Tables } from "@v1/supabase/types";
import { Button } from "@v1/ui/button";
import { cn } from "@v1/ui/cn";
import { CheckIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";

export function PricingSelection({
  selectedPlan,
  plans,
}: {
  selectedPlan: string | null;
  plans: Tables<"subscription_plans">[];
  onPlanSelected?: (planId: string) => void;
}) {
  const { executeAsync: saveSubscription } = useAction(saveSubscriptionAction);

  const handleSelectPlan = async (planId: string) => {
    await saveSubscription({
      subscriptionPlanId: planId,
      revalidatePath: "/onboarding/cities",
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Choose Your Plan</h1>
        <p className="text-muted-foreground mt-2">
          Select the plan that best fits your investment needs
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "border rounded-lg overflow-hidden transition-all h-full flex flex-col",
              selectedPlan === plan.id
                ? "border-primary ring-2 ring-primary ring-opacity-50"
                : "border-border hover:border-input",
            )}
          >
            <div className="p-6 border-b bg-muted/50">
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <div className="mt-2 flex items-baseline">
                <span className="text-3xl font-bold">{plan.price}</span>
              </div>
            </div>
            <div className="p-6 flex-grow">
              <p className="text-sm text-muted-foreground mb-4">
                {plan.description}
              </p>
              <ul className="space-y-3 mb-6">
                {/* @ts-expect-error */}
                {plan.features?.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-accent-foreground mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-6 pb-6 mt-auto">
              <Button
                variant={selectedPlan === plan.id ? "default" : "outline"}
                className="w-full"
                onClick={() => handleSelectPlan(plan.id)}
                size="lg"
              >
                {selectedPlan === plan.id ? "Selected" : "Select Plan"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
