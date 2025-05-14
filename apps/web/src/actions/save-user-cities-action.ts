"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { authActionClient } from "./safe-action";
import { realEstateLocationSchema } from "./schema";

const saveUserLocationsSchema = z.object({
  locations: z.array(realEstateLocationSchema),
  revalidatePath: z.string().optional(),
});

export const saveUserCitiesAction = authActionClient
  .schema(saveUserLocationsSchema)
  .metadata({
    name: "save-user-cities",
  })
  .action(
    async ({
      parsedInput: { locations, revalidatePath: pathToRevalidate },
      ctx: { user, supabase },
    }) => {
      // // Then, save the user's selected locations (cities or counties)
      // const locationsToInsert = locations.map((location) => ({
      //   user_id: user.id,
      //   city_name: location.full_name,
      //   place_id: location.id,
      //   location_type: location.type,
      //   state_code: location.state_code,
      // }));

      // // Delete any existing locations for this user
      // await supabase.from("user_cities").delete().eq("user_id", user.id);

      // // Insert the new locations
      // const { data, error } = await supabase
      //   .from("user_cities")
      //   .insert(locationsToInsert)
      //   .select();

      // if (error) {
      //   throw new Error(`Failed to save cities: ${error.message}`);
      // }

      if (pathToRevalidate) {
        revalidatePath(pathToRevalidate);
      }

      revalidateTag(`user_${user.id}`);

      return { success: true };
    },
  );
