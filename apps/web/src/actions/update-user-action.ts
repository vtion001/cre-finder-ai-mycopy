"use server";

import { updateUser } from "@v1/supabase/mutations";
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

      revalidateTag(`user_${user.id}`);

      if (revalidatePath) {
        nextRevalidatePath(revalidatePath);
      }

      return user;
    },
  );
