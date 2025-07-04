"use client";

import { PasswordInput } from "@/components/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@v1/supabase/client";
import { passwordSchema } from "@v1/trpc/schema";
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
import { toast } from "@v1/ui/sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const updatePasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Inputs = z.infer<typeof updatePasswordSchema>;

export function UpdatePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<Inputs>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const supabase = createClient();

  const onSubmit = async (values: Inputs) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: values.newPassword,
      });

      if (error) {
        toast.error("Failed to update password");
      } else {
        toast.success("Password updated successfully");
      }

      router.push("/account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput
                  placeholder="New password"
                  className="h-12 text-base"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs text-muted-foreground">
                Password must be at least 8 characters and include uppercase,
                lowercase, number, and special character.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password Field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordInput
                  placeholder="Confirm new password"
                  className="h-12 text-base"
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
          className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </Form>
  );
}
