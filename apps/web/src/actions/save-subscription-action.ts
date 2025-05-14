"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { authActionClient } from "./safe-action";

const saveSubscriptionSchema = z.object({
  subscriptionPlanId: z.string().uuid(),
  revalidatePath: z.string().optional(),
});

export const saveSubscriptionAction = authActionClient
  .schema(saveSubscriptionSchema)
  .metadata({
    name: "save-subscription",
  })
  .action(
    async ({
      parsedInput: { subscriptionPlanId, revalidatePath: pathToRevalidate },
      ctx: { user, supabase },
    }) => {
      try {
        const { data, error } = await supabase
          .from("users")
          .update({
            subscription_plan_id: subscriptionPlanId,
            subscription_status: "active",
            subscription_start_date: new Date().toISOString(),
            // Set subscription end date to 30 days from now
            subscription_end_date: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          })
          .eq("id", user.id)
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to save subscription: ${error.message}`);
        }

        if (pathToRevalidate) {
          revalidatePath(pathToRevalidate);
        }

        revalidateTag(`user_${user.id}`);

        return { success: true, data };
      } catch (error) {
        console.error("Error saving subscription:", error);
        return { success: false, error: "Failed to save subscription" };
      }
    },
  );
