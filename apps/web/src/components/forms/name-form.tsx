"use client";

import { updateUserAction } from "@/actions/update-user-action";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Tables } from "@v1/supabase/types";
import { Button } from "@v1/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@v1/ui/form";
import { Input } from "@v1/ui/input";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  fullName: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
});

type Inputs = z.infer<typeof schema>;

export function NameForm({ user }: { user: Tables<"users"> }) {
  const [isLoading, setIsLoading] = useState(false);
  const action = useAction(updateUserAction);

  const form = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user.full_name ?? "",
    },
  });

  function onSubmit(data: Inputs) {
    setIsLoading(true);

    try {
      action.execute({
        full_name: data.fullName,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 md:space-y-6"
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="Full name"
                    className="h-10 sm:h-12 text-sm sm:text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="lg"
            className="h-10 sm:h-12 text-sm sm:text-base px-4 sm:px-6 w-full sm:w-auto"
            disabled={isLoading || !form.formState.isDirty}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This is the name that will be displayed on your profile.
        </p>
      </form>
    </Form>
  );
}
