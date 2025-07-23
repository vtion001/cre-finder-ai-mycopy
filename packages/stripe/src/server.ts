"use server";

import { createClient } from "@v1/supabase/server";
import { createOrRetrieveCustomer } from "@v1/supabase/stripe-admin";
import type { Tables } from "@v1/supabase/types";
import type Stripe from "stripe";
import { stripe } from "./config";
import {
  calculateTrialEndUnixTimestamp,
  getErrorRedirect,
  getURL,
} from "./utils/helpers";

type Price = Tables<"prices">;

type CheckoutResponse = {
  errorRedirect?: string;
  sessionId?: string;
};

type LicenseCheckoutParams = {
  assetTypeSlug: string;
  propertyCounts: {
    internalId: string;
    resultCount: number;
    formattedLocation: string;
    assetTypeName: string;
  }[];
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  searchParams?: any | null;
  redirectPath?: string;
  isAddingLocations?: boolean;
};

export async function checkoutWithStripe(
  price: Price,
  redirectPath = "/account",
): Promise<CheckoutResponse> {
  try {
    // Get the user from Supabase auth
    const supabase = createClient();
    const {
      error,
      data: { user },
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error(error);
      throw new Error("Could not get user session.");
    }

    // Retrieve or create the customer in Stripe
    let customer: string;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user?.id || "",
        email: user?.email || "",
      });
    } catch (err) {
      console.error(err);
      throw new Error("Unable to access customer record.");
    }

    let params: Stripe.Checkout.SessionCreateParams = {
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer,
      customer_update: {
        address: "auto",
      },
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      cancel_url: getURL(),
      success_url: getURL(redirectPath),
    };

    console.log(
      "Trial end:",
      calculateTrialEndUnixTimestamp(price.trial_period_days),
    );
    if (price.type === "recurring") {
      params = {
        ...params,
        mode: "subscription",
        subscription_data: {
          trial_end: calculateTrialEndUnixTimestamp(price.trial_period_days),
        },
      };
    } else if (price.type === "one_time") {
      params = {
        ...params,
        mode: "payment",
      };
    }

    // Create a checkout session in Stripe
    // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        ...params,
      });
    } catch (err) {
      console.error(err);
      throw new Error("Unable to create checkout session.");
    }

    // Instead of returning a Response, just return the data or error.
    if (session) {
      return { sessionId: session.id };
    }
    throw new Error("Unable to create checkout session.");
  } catch (error) {
    if (error instanceof Error) {
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          error.message,
          "Please try again later or contact a system administrator.",
        ),
      };
    }
    return {
      errorRedirect: getErrorRedirect(
        redirectPath,
        "An unknown error occurred.",
        "Please try again later or contact a system administrator.",
      ),
    };
  }
}

export async function createStripePortal(currentPath: string) {
  try {
    const supabase = createClient();
    const {
      error,
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      if (error) {
        console.error(error);
      }
      throw new Error("Could not get user session.");
    }

    // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
    let customer;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user.id || "",
        email: user.email || "",
      });
    } catch (err) {
      console.error(err);
      throw new Error("Unable to access customer record.");
    }

    if (!customer) {
      throw new Error("Could not get customer.");
    }

    try {
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: getURL("/account"),
      });
      if (!url) {
        throw new Error("Could not create billing portal");
      }
      return url;
    } catch (err) {
      console.error(err);
      throw new Error("Could not create billing portal");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return getErrorRedirect(
        currentPath,
        error.message,
        "Please try again later or contact a system administrator.",
      );
    }
    return getErrorRedirect(
      currentPath,
      "An unknown error occurred.",
      "Please try again later or contact a system administrator.",
    );
  }
}

export async function checkoutLicenseWithStripe({
  assetTypeSlug,
  propertyCounts,
  searchParams,
  redirectPath = "/account",
  isAddingLocations = false,
}: LicenseCheckoutParams): Promise<CheckoutResponse> {
  try {
    // Get the user from Supabase auth
    const supabase = createClient();
    const {
      error,
      data: { user },
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error(error);
      throw new Error("Could not get user session.");
    }

    // Retrieve or create the customer in Stripe
    let customer: string;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user?.id || "",
        email: user?.email || "",
      });
    } catch (err) {
      console.error(err);
      throw new Error("Unable to access customer record.");
    }

    const totalPropertyCount = propertyCounts.reduce(
      (acc, count) => acc + count.resultCount,
      0,
    );

    const oneTimeProduct = await stripe.products.create({
      name: "First Month Adjustment",
      description: `One-time licensing fee for ${totalPropertyCount} properties`,
    });

    const oneTimeFee = await stripe.prices.create({
      unit_amount: totalPropertyCount * 50,
      currency: "usd",
      product: oneTimeProduct.id,
    });

    const recurringPrices = await Promise.all(
      propertyCounts.map(async (propertyCount) => {
        const product = await stripe.products.create({
          name: `${propertyCount.assetTypeName} - ${propertyCount.formattedLocation}`,
          description: "Exclusive licensing.",
        });
        return stripe.prices.create({
          unit_amount: propertyCount.resultCount * 50, // $0.5 per property per month
          currency: "usd",
          recurring: { interval: "month", interval_count: 1 },
          product: product.id,
        });
      }),
    );

    const checkoutParams: Stripe.Checkout.SessionCreateParams = {
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer,
      customer_update: {
        address: "auto",
      },
      line_items: [
        {
          price: oneTimeFee.id,
          quantity: 1,
        },
        ...recurringPrices.map((price) => ({
          price: price.id,
          quantity: 1,
        })),
      ],
      mode: "subscription",
      cancel_url: getURL("/dashboard/search"),
      success_url: getURL(redirectPath),
      custom_text: {
        submit: {
          message:
            "Complete your purchase to access property data. You'll pay the full amount for the first month, then 50% off for all subsequent months.",
        },
      },
      metadata: {
        type: "license",
        userId: user.id,
        assetTypeSlug,
        locationIds: propertyCounts.map((count) => count.internalId).join(","),
        params: JSON.stringify(searchParams),
        isAddingLocations: isAddingLocations.toString(),
        resultCount: totalPropertyCount.toString(), // Include total result count for billing
        locationResultCounts: JSON.stringify(
          Object.fromEntries(
            propertyCounts.map((count) => [
              count.internalId,
              count.resultCount,
            ]),
          ),
        ), // Include individual location result counts
      },
    };

    // Create a checkout session in Stripe
    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.create(checkoutParams);
    } catch (err) {
      console.error(err);
      throw new Error("Unable to create checkout session.");
    }

    if (session) {
      return { sessionId: session.id };
    }
    throw new Error("Unable to create checkout session.");
  } catch (error) {
    if (error instanceof Error) {
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          error.message,
          "Please try again later or contact a system administrator.",
        ),
      };
    }
    return {
      errorRedirect: getErrorRedirect(
        redirectPath,
        "An unknown error occurred.",
        "Please try again later or contact a system administrator.",
      ),
    };
  }
}
