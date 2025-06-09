"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@v1/supabase/client";
import { Button } from "@v1/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@v1/ui/form";
import { Input } from "@v1/ui/input";
import { toast } from "@v1/ui/sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const magicLinkSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type Inputs = z.infer<typeof magicLinkSchema>;

export function OtpSignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const form = useForm<Inputs>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: "",
    },
  });

  const supabase = createClient();

  const onSubmit = async (values: Inputs) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: values.email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (!error) {
        setMagicLinkSent(true);
        toast.success("Magic link sent!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Email address"
                  type="email"
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
          {isLoading ? "Sending..." : "Send Magic Link"}
        </Button>
        {magicLinkSent ? (
          <p className="text-sm text-center text-muted-foreground mt-4">
            We've sent a magic link to your email address. Click the link to
            sign in.
          </p>
        ) : (
          <p className="text-sm text-center text-muted-foreground mt-4">
            We'll send you a magic link to your email
          </p>
        )}
      </form>
    </Form>
  );
}
