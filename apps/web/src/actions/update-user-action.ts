"use server";

import { updateLoopsContact } from "@/lib/loops";
import { updateUser } from "@v1/supabase/mutations";
import type { Enums } from "@v1/supabase/types";
import {
  revalidatePath as nextRevalidatePath,
  revalidateTag,
} from "next/cache";
import { z } from "zod";
import { authActionClient } from "./safe-action";

const updateUserSchema = z.object({
  full_name: z.string().min(2).max(32).optional(),
  avatar_url: z.string().url().optional(),
  locale: z.string().optional(),
  week_starts_on_monday: z.boolean().optional(),
  timezone: z.string().optional(),
  time_format: z.number().optional(),
  revalidatePath: z.string().optional(),
  email: z.string().email().optional(),
  phone_number: z.string().optional(),
  role: z.custom<Enums<"user_role">>().optional(),
});

export const updateUserAction = authActionClient
  .schema(updateUserSchema)
  .metadata({
    name: "update-user",
  })
  .action(
    async ({
      parsedInput: { revalidatePath, email: newEmail, ...data },
      ctx: { user, supabase },
    }) => {
      await updateUser(supabase, data);

      if (data.full_name) {
        await supabase.auth.updateUser({
          data: { full_name: data.full_name },
        });
      }

      if (data.role) {
        await supabase.auth.updateUser({
          data: { role: data.role },
        });
      }

      if (newEmail) {
        await supabase.auth.updateUser({
          email: newEmail,
        });
      }

      if (data.phone_number) {
        const { data: res, error } = await supabase.auth.updateUser({
          phone: data.phone_number,
        });

        console.log(res, error);
      }

      // Update Loops contact if user has a CRM ID and relevant fields changed
      if (
        user.crm_id &&
        (data.full_name || newEmail || data.phone_number || data.role)
      ) {
        try {
          await updateLoopsContact(user.crm_id, {
            email: newEmail || user.email,
            firstName:
              data.full_name?.split(" ")[0] || user.full_name?.split(" ")[0],
            lastName:
              data.full_name?.split(" ").slice(1).join(" ") ||
              user.full_name?.split(" ").slice(1).join(" "),
            role: data.role || user.role,
            phoneNumber: data.phone_number || user.phone_number || undefined,
          });
          console.log(
            `Updated Loops contact ${user.crm_id} for user ${user.id}`,
          );
        } catch (error) {
          console.error("Failed to update Loops contact:", error);
          // Don't fail the update if CRM sync fails
        }
      }

      revalidateTag(`user_${user.id}`);

      if (revalidatePath) {
        nextRevalidatePath(revalidatePath);
      }

      return user;
    },
  );
