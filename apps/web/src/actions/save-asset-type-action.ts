"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { authActionClient } from "./safe-action";

const saveAssetTypeSchema = z.object({
  assetTypeId: z.string().uuid(),
  revalidatePath: z.string().optional(),
});

export const saveAssetTypeAction = authActionClient
  .schema(saveAssetTypeSchema)
  .metadata({
    name: "save-user-cities",
  })
  .action(
    async ({
      parsedInput: { assetTypeId, revalidatePath: pathToRevalidate },
      ctx: { user, supabase },
    }) => {
      const { error: assetTypeError } = await supabase
        .from("users")
        .update({
          selected_asset_type_id: assetTypeId,
        })
        .eq("id", user.id);

      if (assetTypeError) {
        throw new Error(`Failed to save asset type: ${assetTypeError.message}`);
      }

      if (pathToRevalidate) {
        revalidatePath(pathToRevalidate);
      }

      revalidateTag(`user_${user.id}`);

      return { success: true };
    },
  );
