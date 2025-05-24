"use client";

import { IconAlertCircle } from "@tabler/icons-react";
import { createStripePortal } from "@v1/stripe/server";
import type { Tables } from "@v1/supabase/types";
import { Button } from "@v1/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@v1/ui/card";

import { differenceInDays, format, parseISO } from "date-fns";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useState } from "react";

type Subscription = Tables<"subscriptions">;
type Price = Tables<"prices">;
type Product = Tables<"products">;

type SubscriptionWithPriceAndProduct = Subscription & {
  prices:
    | (Price & {
        products: Product | null;
      })
    | null;
};

interface Props {
  subscription: SubscriptionWithPriceAndProduct | null;
}

const pricingIntervals = {
  lifetime: "Lifetime",
  year: "Yearly",
  month: "Monthly",
  day: "Daily",
  week: "Weekly",
};

export function CustomerPortalForm({ subscription }: Props) {
  const [error, setError] = useQueryState("error");

  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0,
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  const handleStripePortalRequest = async () => {
    setIsSubmitting(true);
    const redirectUrl = await createStripePortal(currentPath);
    setIsSubmitting(false);
    return router.push(redirectUrl);
  };

  const daysLeft = subscription?.trial_end
    ? differenceInDays(parseISO(subscription?.trial_end), new Date())
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing</CardTitle>
        <CardDescription>
          {subscription
            ? `You are currently on the ${subscription?.prices?.products?.name ?? "unknown"} plan.`
            : "You are not currently subscribed to any plan."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {subscription && (
          <div className="flex flex-row justify-between">
            <p className="pb-4 sm:pb-0">Manage your subscription on Stripe.</p>
            <Button onClick={handleStripePortalRequest} disabled={isSubmitting}>
              Open customer portal
            </Button>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        {subscription?.cancel_at_period_end ? (
          <div className="flex items-center gap-1 ">
            <IconAlertCircle className="size-3.5" />
            To be canceled at{" "}
            {format(subscription.current_period_end, "MMM d, yyyy")}
          </div>
        ) : (
          subscription?.status === "trialing" && (
            <div className="flex items-center gap-1 ">
              <IconAlertCircle className="size-3.5" />
              Trial ends in {daysLeft} days.
            </div>
          )
        )}

        {subscription?.prices?.interval ? (
          <span className="ml-auto">
            {subscriptionPrice}{" "}
            {pricingIntervals[subscription?.prices?.interval]}
          </span>
        ) : (
          <Link href="/onboarding" className="ml-auto">
            <Button>Choose a plan</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
