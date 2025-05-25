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

/**
 * Create a Stripe checkout session for credit purchases
 * @param creditAmount Amount of credits to purchase (e.g., 50, 100, 150, 200)
 * @param redirectPath Path to redirect to after successful payment
 * @returns Checkout response with session ID or error
 */
export async function checkoutWithStripeForCredits(
  creditAmount: number,
  redirectPath = "/dashboard/credits",
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

    // Calculate price in cents (assuming $1 = 1 credit for now)
    const unitAmountCents = creditAmount * 100; // $1 per credit

    const params: Stripe.Checkout.SessionCreateParams = {
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer,
      customer_update: {
        address: "auto",
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${creditAmount} Search Credits`,
              description: `Purchase ${creditAmount} search credits for property searches`,
              metadata: {
                credit_amount: creditAmount.toString(),
                product_type: "credits",
              },
            },
            unit_amount: unitAmountCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment", // One-time payment for credits
      cancel_url: getURL("/dashboard/credits"),
      success_url: getURL(redirectPath),
      metadata: {
        credit_amount: creditAmount.toString(),
        user_id: user.id,
        product_type: "credits",
      },
    };

    // Create a checkout session in Stripe
    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.create(params);
    } catch (err) {
      console.error(err);
      throw new Error("Unable to create checkout session.");
    }

    // Return the session ID
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
