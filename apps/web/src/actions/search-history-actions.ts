"use server";

import type { Enums } from "@v1/supabase/types";
import { revalidatePath, revalidateTag } from "next/cache";
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

      revalidateTag(`favorite_searches_${user.id}`);

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
      await supabase
        .from("favorite_searches")
        .delete()
        .eq("id", favoriteSearchId)
        .eq("user_id", user.id);

      if (pathToRevalidate) {
        revalidatePath(pathToRevalidate);
      }

      revalidateTag(`favorite_searches_${user.id}`);

      return { success: true };
    },
  );

const updateSearchLogStatusSchema = z.object({
  searchLogId: z.string().uuid(),
  status: z.custom<Enums<"search_status">>(),
  revalidatePath: z.string().optional(),
});

export const updateSearchLogStatusAction = authActionClient
  .schema(updateSearchLogStatusSchema)
  .metadata({
    name: "update-search-log-status",
  })
  .action(
    async ({
      parsedInput: { searchLogId, status, revalidatePath: pathToRevalidate },
      ctx: { user, supabase },
    }) => {
      await supabase
        .from("search_logs")
        .update({ status })
        .eq("id", searchLogId)
        .eq("user_id", user.id);

      if (pathToRevalidate) {
        revalidatePath(pathToRevalidate);
      }

      revalidateTag(`search_logs_${user.id}`);

      return { success: true };
    },
  );
