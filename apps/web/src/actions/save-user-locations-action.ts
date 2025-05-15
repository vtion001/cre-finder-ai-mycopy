"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { authActionClient } from "./safe-action";
import { locationSchema } from "./schema";

const saveUserLocationsSchema = z.object({
  locations: z.array(locationSchema),
  revalidatePath: z.string().optional(),
});

export const saveUserLocationsAction = authActionClient
  .schema(saveUserLocationsSchema)
  .metadata({
    name: "save-user-locations",
  })
  .action(
    async ({
      parsedInput: { locations, revalidatePath: pathToRevalidate },
      ctx: { user, supabase },
    }) => {
      // // Then, save the user's selected locations (cities or counties)
      const locationsToInsert = locations.map((location) => ({
        ...location,
        user_id: user.id,
      }));

      await supabase.from("user_locations").delete().eq("user_id", user.id);

      // // Insert the new locations
      const { data, error } = await supabase
        .from("user_locations")
        .insert(locationsToInsert)
        .select();

      if (error) {
        throw new Error(`Failed to save locations: ${error.message}`);
      }

      if (pathToRevalidate) {
        revalidatePath(pathToRevalidate);
      }

      revalidateTag(`user_${user.id}`);

      return { success: true };
    },
  );
