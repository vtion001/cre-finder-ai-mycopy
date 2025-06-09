"use client";

import { EmailForm } from "@/components/forms/email-form";
import { NameForm } from "@/components/forms/name-form";
import { PhoneForm } from "@/components/forms/phone-form";
import type { Tables } from "@v1/supabase/types";
import { Button } from "@v1/ui/button";
import { Separator } from "@v1/ui/separator";
import { KeyIcon, Shield, User } from "lucide-react";
import Link from "next/link";

export function AccountSettings({ user }: { user: Tables<"users"> }) {
  return (
    <div className="space-y-12 lg:space-y-0">
      <div className="grid gap-12 lg:grid-cols-[1fr_auto_1fr] lg:gap-16">
        {/* Profile Information Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Profile Information
              </h2>
              <p className="text-sm text-muted-foreground">
                Update your account profile information
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Name Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-medium text-foreground">
                  Full Name
                </h3>
              </div>
              <NameForm user={user} />
            </div>

            <Separator />

            {/* Email Section */}
            <div className="space-y-4">
              <h3 className="text-base font-medium text-foreground">
                Email Address
              </h3>
              <EmailForm user={user} />
            </div>

            <Separator />

            {/* Phone Section */}
            <div className="space-y-4">
              <h3 className="text-base font-medium text-foreground">
                Phone Number
              </h3>
              <PhoneForm user={user} />
            </div>
          </div>
        </div>

        {/* Vertical Separator for larger screens */}
        <div className="hidden lg:flex lg:justify-center lg:py-8">
          <Separator orientation="vertical" className="h-full" />
        </div>

        {/* Security Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Security
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage your account security settings
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-base font-medium text-foreground">
                Password
              </h3>
              <p className="text-sm text-muted-foreground">
                Update your password to maintain account security. We recommend
                using a strong, unique password.
              </p>
              <Link href="/account/update-password">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 text-base gap-2"
                >
                  <KeyIcon className="h-4 w-4" />
                  Change Password
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Separator for smaller screens */}
      <div className="lg:hidden">
        <Separator />
      </div>
    </div>
  );
}
