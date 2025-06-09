import { tasks } from "@trigger.dev/sdk/v3";
import type { updatePropertyRecordsTask } from "@v1/jobs/update-property-records";
import { stripe } from "@v1/stripe/config";
import {
  deletePriceRecord,
  deleteProductRecord,
  logPaymentFailure,
  logSubscriptionCancellation,
  manageSubscriptionStatusChange,
  manageUserLicense,
  toDateTime,
  updateLicenseExpiration,
  upsertPriceRecord,
  upsertProductRecord,
} from "@v1/supabase/stripe-admin";
import { revalidateTag } from "next/cache";
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
  "invoice.payment_failed",
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

          break;
        case "price.created":
        case "price.updated":
          await upsertPriceRecord(event.data.object as Stripe.Price);

          break;
        case "price.deleted":
          await deletePriceRecord(event.data.object as Stripe.Price);

          break;
        case "product.deleted":
          await deleteProductRecord(event.data.object as Stripe.Product);

          break;
        case "customer.subscription.created": {
          const subscription = event.data.object as Stripe.Subscription;
          const { userId } = await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            true,
          );
          revalidateTag(`user_${userId}`);
          revalidateTag(`subscriptions_${userId}`);
          break;
        }

        case "customer.subscription.updated": {
          const subscription = event.data.object as Stripe.Subscription;
          const { userId } = await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            false,
          );

          // Handle subscription renewal (status becomes 'active' after successful payment)
          if (
            subscription.status === "active" &&
            subscription.metadata?.type === "license"
          ) {
            try {
              // Update license expiration to end of current billing period
              const newExpiresAt = toDateTime(
                subscription.current_period_end,
              ).toISOString();
              await updateLicenseExpiration(
                userId,
                subscription.metadata,
                newExpiresAt,
              );

              console.log(
                `🔄 License renewed for user [${userId}] until [${newExpiresAt}]`,
              );
              revalidateTag(`licenses_${userId}`);
            } catch (error) {
              console.error(
                `Failed to update license expiration for user [${userId}]:`,
                error,
              );
            }
          }

          revalidateTag(`user_${userId}`);
          revalidateTag(`subscriptions_${userId}`);
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          const { userId } = await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            false,
          );

          // Log cancellation but do NOT modify expires_at (grace period system)
          if (subscription.metadata?.type === "license") {
            try {
              await logSubscriptionCancellation(
                userId,
                subscription.id,
                subscription.metadata,
              );
              console.log(
                `🚫 Subscription cancelled for user [${userId}] - grace period active until expires_at`,
              );
            } catch (error) {
              console.error(
                `Failed to log subscription cancellation for user [${userId}]:`,
                error,
              );
            }
          }

          revalidateTag(`user_${userId}`);
          revalidateTag(`subscriptions_${userId}`);
          break;
        }
        case "checkout.session.completed": {
          const checkoutSession = event.data.object as Stripe.Checkout.Session;

          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription;
            const { userId, subscription } =
              await manageSubscriptionStatusChange(
                subscriptionId as string,
                checkoutSession.customer as string,
                true,
                checkoutSession.metadata,
              );

            if (checkoutSession?.metadata?.type === "license") {
              // Parse location result counts from metadata
              const locationResultCounts = checkoutSession.metadata
                .locationResultCounts
                ? JSON.parse(checkoutSession.metadata.locationResultCounts)
                : {};

              // Get total result count for logging
              const totalResultCount = checkoutSession.metadata.resultCount
                ? Number.parseInt(checkoutSession.metadata.resultCount, 10)
                : 0;

              // Set initial expiration to end of first billing period
              const expiresAt = toDateTime(
                subscription.current_period_end,
              ).toISOString();

              const licenses = await manageUserLicense(
                userId,
                checkoutSession.metadata,
                locationResultCounts,
                expiresAt,
              );

              console.log(
                `💳 License created for user [${userId}] with ${totalResultCount} total results across ${Object.keys(locationResultCounts).length} locations, expires [${expiresAt}]`,
              );
              revalidateTag(`licenses_${userId}`);

              console.log("⚠️ Triggering update property records task");

              const handle = await tasks.batchTrigger<
                typeof updatePropertyRecordsTask
              >(
                "update-property-records",
                licenses.map((l) => ({
                  payload: { licenseId: l.id },
                })),
              );
            }

            revalidateTag(`user_${userId}`);
            revalidateTag(`subscriptions_${userId}`);
          } else if (checkoutSession.mode === "payment") {
            // Handle one-time payments
          }

          break;
        }

        case "invoice.payment_succeeded": {
          // Payment succeeded - this indicates a successful subscription renewal
          const invoice = event.data.object as Stripe.Invoice;

          // Note: Subscription renewal is primarily handled in customer.subscription.updated
          // This event can be used for additional logging or validation if needed
          if (invoice.subscription && invoice.customer) {
            console.log(
              `💰 Payment succeeded for invoice [${invoice.id}] subscription [${invoice.subscription}]`,
            );
          }

          break;
        }

        case "invoice.payment_failed": {
          // Payment failed - do NOT extend expires_at, let license expire naturally
          const invoice = event.data.object as Stripe.Invoice;

          if (invoice.subscription && invoice.customer) {
            try {
              // Get customer UUID and subscription details
              const subscription = await stripe.subscriptions.retrieve(
                invoice.subscription as string,
              );

              // Use the existing manageSubscriptionStatusChange to get userId
              const { userId } = await manageSubscriptionStatusChange(
                subscription.id,
                invoice.customer as string,
                false,
              );

              if (subscription.metadata?.type === "license") {
                await logPaymentFailure(
                  userId,
                  subscription.id,
                  invoice.id,
                  subscription.metadata,
                );
                console.log(
                  `💳❌ Payment failed for user [${userId}] - license will expire naturally`,
                );
              }
            } catch (error) {
              console.error(
                `Failed to handle payment failure for invoice [${invoice.id}]:`,
                error,
              );
            }
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
