"use server";

import { checkoutWithStripeForCredits } from "@v1/stripe/server";
import { redirect } from "next/navigation";

export async function createCreditCheckoutSession(creditAmount: number) {
  const { errorRedirect, sessionId } = await checkoutWithStripeForCredits(
    creditAmount,
    "/dashboard/credits"
  );

  if (errorRedirect) {
    redirect(errorRedirect);
  }

  if (!sessionId) {
    redirect("/dashboard/credits?error=checkout_failed");
  }

  return { sessionId };
}
