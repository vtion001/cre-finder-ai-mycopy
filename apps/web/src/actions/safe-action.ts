import { getUser } from "@v1/supabase/cached-queries";
import { createClient } from "@v1/supabase/server";
import {
  DEFAULT_SERVER_ERROR_MESSAGE,
  createSafeActionClient,
} from "next-safe-action";
import { z } from "zod";

const handleServerError = (e: Error) => {
  console.error("Action error:", e.message);

  if (e instanceof Error) {
    return e.message;
  }

  return DEFAULT_SERVER_ERROR_MESSAGE;
};

export const actionClient = createSafeActionClient({
  handleServerError,
});

export const actionClientWithMeta = createSafeActionClient({
  handleServerError,
  defineMetadataSchema() {
    return z.object({
      name: z.string(),
      track: z
        .object({
          event: z.string(),
          channel: z.string(),
        })
        .optional(),
    });
  },
});

export const authActionClient = actionClientWithMeta
  .use(async ({ next, clientInput, metadata }) => {
    const result = await next({ ctx: {} });

    if (process.env.NODE_ENV === "development") {
      // logger.info(`Input -> ${JSON.stringify(clientInput)}`);
      // logger.info(`Result -> ${JSON.stringify(result.data)}`);
      // logger.info(`Metadata -> ${JSON.stringify(metadata)}`);

      return result;
    }

    return result;
  })
  .use(async ({ next, metadata }) => {
    const cachedUser = await getUser();
    const supabase = createClient();

    if (!cachedUser?.data) {
      throw new Error("Unauthorized");
    }

    const user = cachedUser.data;

    if (!user) {
      throw new Error("Unauthorized");
    }

    return next({
      ctx: {
        supabase,
        user,
      },
    });
  });
