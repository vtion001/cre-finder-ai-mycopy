import { stripe } from "@v1/stripe/config";
import type Stripe from "stripe";

import { parseLocationCode } from "../../../../property-data/src/utils/format";
import { supabaseAdmin } from "../../clients/admin";
import type { Json, Tables, TablesInsert } from "../../types/db";

export const toDateTime = (secs: number) => {
  const t = new Date(+0); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

type Product = Tables<"products">;

// Change to control trial period length
const TRIAL_PERIOD_DAYS = 0;

export const upsertProductRecord = async (product: Stripe.Product) => {
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
  };

  const { error: upsertError } = await supabaseAdmin
    .from("products")
    .upsert([productData]);
  if (upsertError)
    throw new Error(`Product insert/update failed: ${upsertError.message}`);
  console.log(`Product inserted/updated: ${product.id}`);
};

export const upsertPriceRecord = async (
  price: Stripe.Price,
  retryCount = 0,
  maxRetries = 3,
) => {
  const priceData: TablesInsert<"prices"> = {
    id: price.id,
    product_id: typeof price.product === "string" ? price.product : "",
    active: price.active,
    currency: price.currency,
    type: price.type,
    unit_amount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS,
  };

  const { error: upsertError } = await supabaseAdmin
    .from("prices")
    .upsert([priceData]);

  if (upsertError?.message.includes("foreign key constraint")) {
    if (retryCount < maxRetries) {
      console.log(`Retry attempt ${retryCount + 1} for price ID: ${price.id}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await upsertPriceRecord(price, retryCount + 1, maxRetries);
    } else {
      throw new Error(
        `Price insert/update failed after ${maxRetries} retries: ${upsertError.message}`,
      );
    }
  } else if (upsertError) {
    throw new Error(`Price insert/update failed: ${upsertError.message}`);
  } else {
    console.log(`Price inserted/updated: ${price.id}`);
  }
};

export const deleteProductRecord = async (product: Stripe.Product) => {
  const { error: deletionError } = await supabaseAdmin
    .from("products")
    .delete()
    .eq("id", product.id);
  if (deletionError)
    throw new Error(`Product deletion failed: ${deletionError.message}`);
  console.log(`Product deleted: ${product.id}`);
};

export const deletePriceRecord = async (price: Stripe.Price) => {
  const { error: deletionError } = await supabaseAdmin
    .from("prices")
    .delete()
    .eq("id", price.id);
  if (deletionError)
    throw new Error(`Price deletion failed: ${deletionError.message}`);
  console.log(`Price deleted: ${price.id}`);
};

export const upsertCustomerToSupabase = async (
  uuid: string,
  customerId: string,
) => {
  const { error: upsertError } = await supabaseAdmin
    .from("customers")
    .upsert([{ id: uuid, stripe_customer_id: customerId }]);

  if (upsertError)
    throw new Error(
      `Supabase customer record creation failed: ${upsertError.message}`,
    );

  return customerId;
};

export const createCustomerInStripe = async (uuid: string, email: string) => {
  const customerData = { metadata: { supabaseUUID: uuid }, email: email };
  const newCustomer = await stripe.customers.create(customerData);
  if (!newCustomer) throw new Error("Stripe customer creation failed.");

  return newCustomer.id;
};

export const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email: string;
  uuid: string;
}) => {
  // Check if the customer already exists in Supabase
  const { data: existingSupabaseCustomer, error: queryError } =
    await supabaseAdmin
      .from("customers")
      .select("*")
      .eq("id", uuid)
      .maybeSingle();

  if (queryError) {
    throw new Error(`Supabase customer lookup failed: ${queryError.message}`);
  }

  // Retrieve the Stripe customer ID using the Supabase customer ID, with email fallback
  let stripeCustomerId: string | undefined;
  if (existingSupabaseCustomer?.stripe_customer_id) {
    const existingStripeCustomer = await stripe.customers.retrieve(
      existingSupabaseCustomer.stripe_customer_id,
    );
    stripeCustomerId = existingStripeCustomer.id;
  } else {
    // If Stripe ID is missing from Supabase, try to retrieve Stripe customer ID by email
    const stripeCustomers = await stripe.customers.list({ email: email });
    stripeCustomerId =
      stripeCustomers.data.length > 0 ? stripeCustomers.data[0]!.id : undefined;
  }

  // If still no stripeCustomerId, create a new customer in Stripe
  const stripeIdToInsert = stripeCustomerId
    ? stripeCustomerId
    : await createCustomerInStripe(uuid, email);
  if (!stripeIdToInsert) throw new Error("Stripe customer creation failed.");

  if (existingSupabaseCustomer && stripeCustomerId) {
    // If Supabase has a record but doesn't match Stripe, update Supabase record
    if (existingSupabaseCustomer.stripe_customer_id !== stripeCustomerId) {
      const { error: updateError } = await supabaseAdmin
        .from("customers")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", uuid);

      if (updateError)
        throw new Error(
          `Supabase customer record update failed: ${updateError.message}`,
        );
      console.warn(
        "Supabase customer record mismatched Stripe ID. Supabase record updated.",
      );
    }
    // If Supabase has a record and matches Stripe, return Stripe customer ID
    return stripeCustomerId;
    // biome-ignore lint/style/noUselessElse: <explanation>
  } else {
    console.warn(
      "Supabase customer record was missing. A new record was created.",
    );

    // If Supabase has no record, create a new record and return Stripe customer ID
    const upsertedStripeCustomer = await upsertCustomerToSupabase(
      uuid,
      stripeIdToInsert,
    );
    if (!upsertedStripeCustomer)
      throw new Error("Supabase customer record creation failed.");

    return upsertedStripeCustomer;
  }
};

/**
 * Copies the billing details from the payment method to the customer object.
 */
export const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod,
) => {
  //Todo: check this assertion
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;
  if (!name || !phone || !address) return;
  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address });
  const { error: updateError } = await supabaseAdmin
    .from("users")
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] },
    })
    .eq("id", uuid);
  if (updateError)
    throw new Error(`Customer update failed: ${updateError.message}`);
};

export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false,
  fallbackMetadata?: Stripe.Metadata | null,
) => {
  // Get customer's UUID from mapping table.
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (noCustomerError)
    throw new Error(`Customer lookup failed: ${noCustomerError.message}`);

  const { id: uuid } = customerData!;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"],
  });

  // Upsert the latest status of the subscription object.
  const subscriptionData: TablesInsert<"subscriptions"> = {
    id: subscription.id,
    user_id: uuid,
    metadata: subscription.metadata ?? fallbackMetadata,
    status: subscription.status,
    price_id: subscription.items.data[0]?.price.id,
    //TODO check quantity on subscription
    // @ts-ignore
    quantity: subscription.quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at
      ? toDateTime(subscription.cancel_at).toISOString()
      : null,
    canceled_at: subscription.canceled_at
      ? toDateTime(subscription.canceled_at).toISOString()
      : null,
    current_period_start: toDateTime(
      subscription.current_period_start,
    ).toISOString(),
    current_period_end: toDateTime(
      subscription.current_period_end,
    ).toISOString(),
    created: toDateTime(subscription.created).toISOString(),
    ended_at: subscription.ended_at
      ? toDateTime(subscription.ended_at).toISOString()
      : null,
    trial_start: subscription.trial_start
      ? toDateTime(subscription.trial_start).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? toDateTime(subscription.trial_end).toISOString()
      : null,
  };

  const { error: upsertError } = await supabaseAdmin
    .from("subscriptions")
    .upsert([subscriptionData]);
  if (upsertError)
    throw new Error(
      `Subscription insert/update failed: ${upsertError.message}`,
    );
  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`,
  );

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && subscription.default_payment_method && uuid)
    //@ts-ignore
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod,
    );

  return { userId: uuid, subscription };
};

export async function manageUserLicense(
  userId: string,
  metadata: Stripe.Metadata,
  locationResultCounts?: { [locationId: string]: number },
  expiresAt?: string,
) {
  const { assetTypeSlug, locationIds, params, isAddingLocations } = metadata;

  if (!assetTypeSlug || !locationIds) {
    throw new Error("Missing metadata on subscription");
  }

  const locationIdsArray = locationIds.split(",");
  const paramsObject = params ? JSON.parse(params) : null;
  const isAddingLocationsFlag = isAddingLocations === "true";

  let assetLicenseId: string;

  if (isAddingLocationsFlag) {
    // When adding locations, find existing asset license (don't modify it)
    const { data: existingAssetLicense, error: findError } = await supabaseAdmin
      .from("asset_licenses")
      .select("id")
      .eq("user_id", userId)
      .eq("asset_type_slug", assetTypeSlug)
      .single();

    if (findError || !existingAssetLicense) {
      throw new Error(
        `Asset license not found for adding locations: ${findError?.message}`,
      );
    }

    assetLicenseId = existingAssetLicense.id;
  } else {
    // When creating new license, create the asset license (parent)
    // Note: expires_at removed from asset licenses - now tracked per location
    const assetLicenseData: TablesInsert<"asset_licenses"> = {
      user_id: userId,
      asset_type_slug: assetTypeSlug,
      search_params: paramsObject as unknown as Json,
    };

    const { data: assetLicense, error: assetLicenseError } = await supabaseAdmin
      .from("asset_licenses")
      .insert(assetLicenseData)
      .select("id")
      .single();

    if (assetLicenseError) {
      throw new Error(
        `Failed to create asset license: ${assetLicenseError.message}`,
      );
    }

    assetLicenseId = assetLicense.id;
  }

  // Insert the location licenses (children)
  // Each location gets its own expiration date
  const locationLicenseData: TablesInsert<"location_licenses">[] =
    locationIdsArray.map((locationId: string) => {
      const { state, city, county } = parseLocationCode(locationId);

      return {
        asset_license_id: assetLicenseId,
        location_internal_id: locationId,
        location_name: county || city!,
        location_type: county ? ("county" as const) : ("city" as const),
        location_formatted: `${county || city}, ${state}`,
        location_state: state,
        result_count: locationResultCounts?.[locationId] ?? 0, // Set result count for this specific location
        expires_at: expiresAt ?? null, // Set expiration for this specific location
      };
    });

  const { error: locationLicenseError } = await supabaseAdmin
    .from("location_licenses")
    .upsert(locationLicenseData, {
      onConflict: "asset_license_id, location_internal_id",
    });

  if (locationLicenseError) {
    throw new Error(
      `Failed to create location licenses: ${locationLicenseError.message}`,
    );
  }
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Updates license expiration date for subscription renewals
 * Called when subscription.updated event indicates successful renewal
 * Now updates all location licenses under the asset type
 */
export async function updateLicenseExpiration(
  userId: string,
  subscriptionMetadata: Stripe.Metadata,
  newExpiresAt: string,
) {
  const { assetTypeSlug } = subscriptionMetadata;

  if (!assetTypeSlug) {
    throw new Error("Missing assetTypeSlug in subscription metadata");
  }

  // First, find the asset license to get its ID
  const { data: assetLicense, error: findError } = await supabaseAdmin
    .from("asset_licenses")
    .select("id")
    .eq("user_id", userId)
    .eq("asset_type_slug", assetTypeSlug)
    .single();

  if (findError || !assetLicense) {
    throw new Error(
      `Failed to find asset license: ${findError?.message || "Not found"}`,
    );
  }

  // Update all location licenses under this asset license
  const { error: updateError } = await supabaseAdmin
    .from("location_licenses")
    .update({
      expires_at: newExpiresAt,
      is_active: true, // Ensure location licenses remain active on renewal
    })
    .eq("asset_license_id", assetLicense.id);

  if (updateError) {
    throw new Error(
      `Failed to update location license expirations: ${updateError.message}`,
    );
  }

  console.log(
    `Updated location license expirations for user [${userId}] asset type [${assetTypeSlug}] to [${newExpiresAt}]`,
  );
}

/**
 * Finds asset license by subscription metadata
 * Used to identify which license to update during webhook events
 * Note: expires_at is now tracked at location level, not asset level
 */
export async function findAssetLicenseBySubscription(
  userId: string,
  subscriptionMetadata: Stripe.Metadata,
) {
  const { assetTypeSlug } = subscriptionMetadata;

  if (!assetTypeSlug) {
    throw new Error("Missing assetTypeSlug in subscription metadata");
  }

  const { data: assetLicense, error } = await supabaseAdmin
    .from("asset_licenses")
    .select("id, asset_type_slug, is_active")
    .eq("user_id", userId)
    .eq("asset_type_slug", assetTypeSlug)
    .single();

  if (error) {
    throw new Error(`Failed to find asset license: ${error.message}`);
  }

  return assetLicense;
}

/**
 * Logs payment failure for monitoring purposes
 * Does NOT modify license expiration - allows natural expiration
 */
export async function logPaymentFailure(
  userId: string,
  subscriptionId: string,
  invoiceId: string,
  subscriptionMetadata: Stripe.Metadata,
) {
  const { assetTypeSlug } = subscriptionMetadata;

  console.log(
    `💳 Payment failed for user [${userId}] subscription [${subscriptionId}] invoice [${invoiceId}] asset type [${assetTypeSlug}]. License will expire naturally at current expires_at.`,
  );

  // Optional: Add to a payment_failures table for monitoring if needed
  // This is just logging for now, but could be extended to store failure records
}

/**
 * Logs subscription cancellation for monitoring purposes
 * Does NOT modify license expiration - allows grace period until expires_at
 */
export async function logSubscriptionCancellation(
  userId: string,
  subscriptionId: string,
  subscriptionMetadata: Stripe.Metadata,
) {
  const { assetTypeSlug } = subscriptionMetadata;

  console.log(
    `🚫 Subscription cancelled for user [${userId}] subscription [${subscriptionId}] asset type [${assetTypeSlug}]. License will remain active until current expires_at (grace period).`,
  );

  // Optional: Add cancellation tracking if needed
  // This maintains the grace period system where cancelled subscriptions
  // don't immediately terminate access
}
