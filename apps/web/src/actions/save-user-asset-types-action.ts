"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { authActionClient } from "./safe-action";

const saveUserAssetTypesSchema = z.object({
  assetTypeIds: z.array(z.string().uuid()),
  revalidatePath: z.string().optional(),
});

export const saveUserAssetTypesAction = authActionClient
  .schema(saveUserAssetTypesSchema)
  .metadata({
    name: "save-user-asset-types",
  })
  .action(
    async ({
      parsedInput: { assetTypeIds, revalidatePath: pathToRevalidate },
      ctx: { user, supabase },
    }) => {
      // First, delete all existing asset types for this user
      await supabase.from("user_asset_types").delete().eq("user_id", user.id);

      // Then, insert the new asset types
      if (assetTypeIds.length > 0) {
        const assetTypesToInsert = assetTypeIds.map((assetTypeId) => ({
          user_id: user.id,
          asset_type_id: assetTypeId,
        }));

        const { error } = await supabase
          .from("user_asset_types")
          .insert(assetTypesToInsert);

        if (error) {
          throw new Error(`Failed to save asset types: ${error.message}`);
        }
      }

      if (pathToRevalidate) {
        revalidatePath(pathToRevalidate);
      }

      revalidateTag(`user_${user.id}`);
      revalidateTag(`asset_types_${user.id}`);

      return { success: true };
    },
  );
