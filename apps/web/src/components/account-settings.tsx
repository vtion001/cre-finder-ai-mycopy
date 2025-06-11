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
    <div className="space-y-8 md:space-y-12 lg:space-y-0">
      <div className="grid gap-8 md:gap-12 lg:grid-cols-[1fr_auto_1fr] lg:gap-16">
        {/* Profile Information Section */}
        <div className="space-y-6 md:space-y-8">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                Profile Information
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Update your account profile information
              </p>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8">
            {/* Name Section */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-sm sm:text-base font-medium text-foreground">
                Full Name
              </h3>
              <NameForm user={user} />
            </div>

            <Separator />

            {/* Email Section */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-sm sm:text-base font-medium text-foreground">
                Email Address
              </h3>
              <EmailForm user={user} />
            </div>

            <Separator />

            {/* Phone Section */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-sm sm:text-base font-medium text-foreground">
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
        <div className="space-y-6 md:space-y-8">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                Security
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Manage your account security settings
              </p>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-sm sm:text-base font-medium text-foreground">
                Password
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Update your password to maintain account security. We recommend
                using a strong, unique password.
              </p>
              <Link href="/account/update-password">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-10 sm:h-12 text-sm sm:text-base gap-2 w-full sm:w-auto"
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
