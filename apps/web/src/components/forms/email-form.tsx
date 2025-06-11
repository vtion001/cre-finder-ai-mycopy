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
import { toast } from "@v1/ui/sonner";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "This field is required" })
    .email("This is not a valid email."),
});

type Inputs = z.infer<typeof schema>;

export function EmailForm({ user }: { user: Tables<"users"> }) {
  const [isLoading, setIsLoading] = useState(false);
  const action = useAction(updateUserAction);

  const form = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: user.email,
    },
  });

  function onSubmit(data: Inputs) {
    setIsLoading(true);

    try {
      action.execute({
        email: data.email,
      });

      toast.success("A confirmation email has been sent.");
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
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="Email address"
                    type="email"
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
          We'll use this email to contact you and for login.
        </p>
      </form>
    </Form>
  );
}
