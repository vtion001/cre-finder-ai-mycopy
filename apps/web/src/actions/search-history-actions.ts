"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { authActionClient } from "./safe-action";

const saveSearchAsFavoriteSchema = z.object({
  searchLogId: z.string().uuid(),
  name: z.string().min(1).max(100),
  revalidatePath: z.string().optional(),
});

const deleteFavoriteSearchSchema = z.object({
  favoriteSearchId: z.string().uuid(),
  revalidatePath: z.string().optional(),
});

export const saveSearchAsFavoriteAction = authActionClient
  .schema(saveSearchAsFavoriteSchema)
  .metadata({
    name: "save-search-as-favorite",
  })
  .action(
    async ({
      parsedInput: { searchLogId, name, revalidatePath: pathToRevalidate },
      ctx: { user, supabase },
    }) => {
      const { data: log } = await supabase
        .from("search_logs")
        .select("*")
        .eq("id", searchLogId)
        .eq("user_id", user.id)
        .single();

      if (!log) {
        throw new Error("Search log not found ");
      }

      const { data } = await supabase
        .from("favorite_searches")
        .insert({
          user_id: user.id,
          search_log_id: searchLogId,
          name,
        })
        .select()
        .single();

      if (pathToRevalidate) {
        revalidatePath(pathToRevalidate);
      }

      return { success: true, data };
    },
  );

export const deleteFavoriteSearchAction = authActionClient
  .schema(deleteFavoriteSearchSchema)
  .metadata({
    name: "delete-favorite-search",
  })
  .action(
    async ({
      parsedInput: { favoriteSearchId, revalidatePath: pathToRevalidate },
      ctx: { user, supabase },
    }) => {
      const { error } = await supabase
        .from("favorite_searches")
        .delete()
        .eq("id", favoriteSearchId)
        .eq("user_id", user.id);

      if (error) {
        throw new Error(`Failed to delete favorite: ${error.message}`);
      }

      if (pathToRevalidate) {
        revalidatePath(pathToRevalidate);
      }

      return { success: true };
    },
  );
