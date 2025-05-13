"use client";

import { EmailForm } from "@/components/forms/email-form";
import { NameForm } from "@/components/forms/name-form";
import { PhoneForm } from "@/components/forms/phone-form";
import type { Tables } from "@v1/supabase/types";
import { Button } from "@v1/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@v1/ui/card";
import { Separator } from "@v1/ui/separator";
import { KeyIcon } from "lucide-react";
import Link from "next/link";

export function AccountSettings({ user }: { user: Tables<"users"> }) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your account profile information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <NameForm user={user} />
          </div>

          <Separator />

          <div className="space-y-4">
            <EmailForm user={user} />
          </div>

          <Separator />

          <div className="space-y-4">
            <PhoneForm user={user} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Manage your account security settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Password</h3>
            <p className="text-sm text-muted-foreground">
              Update your password to maintain account security. We recommend
              using a strong, unique password.
            </p>
            <Link href="/account/update-password">
              <Button variant="outline" className="mt-2 gap-2">
                <KeyIcon className="h-4 w-4" />
                Manage Password
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
