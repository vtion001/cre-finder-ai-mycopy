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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="Your email address" {...field} />
              </FormControl>
              <FormDescription>
                We'll use this email to contact you and for login.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
          {isLoading ? "Updating email..." : "Update email"}
        </Button>
      </form>
    </Form>
  );
}
