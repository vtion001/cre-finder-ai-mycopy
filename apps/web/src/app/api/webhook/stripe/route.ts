import { stripe } from "@v1/stripe/config";
import {
  deletePriceRecord,
  deleteProductRecord,
  insertUserCredits,
  manageSubscriptionCredits,
  manageSubscriptionStatusChange,
  upsertPriceRecord,
  upsertProductRecord,
} from "@v1/supabase/stripe-admin";
import { revalidatePath, revalidateTag } from "next/cache";
import type Stripe from "stripe";

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "product.deleted",
  "price.created",
  "price.updated",
  "price.deleted",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
]);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret)
      return new Response("Webhook secret not found.", { status: 400 });
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log(`🔔  Webhook received: ${event.type}`);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "product.created":
        case "product.updated":
          await upsertProductRecord(event.data.object as Stripe.Product);
          revalidatePath("/setup/plans");
          break;
        case "price.created":
        case "price.updated":
          await upsertPriceRecord(event.data.object as Stripe.Price);
          revalidatePath("/setup/plans");
          break;
        case "price.deleted":
          await deletePriceRecord(event.data.object as Stripe.Price);
          revalidatePath("/setup/plans");
          break;
        case "product.deleted":
          await deleteProductRecord(event.data.object as Stripe.Product);
          revalidatePath("/setup/plans");
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          const { userId } = await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === "customer.subscription.created",
          );
          revalidateTag(`user_${userId}`);
          revalidateTag(`subscriptions_${userId}`);
          break;
        }
        case "checkout.session.completed": {
          const checkoutSession = event.data.object as Stripe.Checkout.Session;

          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription;
            const { userId } = await manageSubscriptionStatusChange(
              subscriptionId as string,
              checkoutSession.customer as string,
              true,
            );

            revalidateTag(`user_${userId}`);
            revalidateTag(`subscriptions_${userId}`);
          } else if (checkoutSession.mode === "payment") {
            // Handle one-time payments (credit purchases)
            await handleCreditPurchase(checkoutSession);
          }

          break;
        }

        case "invoice.payment_succeeded": {
          // Payment succeeded - this indicates a successful subscription renewal
          const invoice = event.data.object as Stripe.Invoice;

          if (invoice.subscription) {
            const subscriptionId = invoice.subscription;

            console.log(
              `Processing subscription credits for subscription [${subscriptionId}]`,
            );

            const { userId } = await manageSubscriptionCredits(
              subscriptionId as string,
              invoice.customer as string,
              "Subscription credits",
            );

            revalidateTag(`credit_usage_${userId}`);
          }

          break;
        }
        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      console.log(error);
      return new Response(
        "Webhook handler failed. View your Next.js function logs.",
        {
          status: 400,
        },
      );
    }
  } else {
    return new Response(`Unsupported event type: ${event.type}`, {
      status: 400,
    });
  }
  return new Response(JSON.stringify({ received: true }));
}

/**
 * Handle credit purchase from Stripe checkout session
 */
async function handleCreditPurchase(checkoutSession: Stripe.Checkout.Session) {
  try {
    // Check if this is a credit purchase
    const productType = checkoutSession.metadata?.product_type;
    if (productType !== "credits") {
      console.log("Not a credit purchase, skipping");
      return;
    }

    const creditAmount = Number.parseInt(
      checkoutSession.metadata?.credit_amount || "0",
    );
    const userId = checkoutSession.metadata?.user_id;
    const paymentIntentId = checkoutSession.payment_intent as string;

    if (!creditAmount || !userId) {
      throw new Error(
        "Missing credit amount or user ID in checkout session metadata",
      );
    }

    console.log(
      `Processing credit purchase: ${creditAmount} credits for user ${userId}`,
    );

    await insertUserCredits(userId, creditAmount, paymentIntentId);

    console.log(`Successfully added ${creditAmount} credits to user ${userId}`);

    // Revalidate credit-related cache tags
    revalidateTag(`credit_usage_${userId}`);
    revalidateTag(`user_${userId}`);
  } catch (error) {
    console.error("Error handling credit purchase:", error);
    throw error;
  }
}
