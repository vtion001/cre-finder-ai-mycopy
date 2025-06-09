import { UpdatePasswordForm } from "@/components/forms/update-password-form";
import { Logo } from "@/components/logo";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Update Password - CRE Finder AI",
  description: "Update your account password for CRE Finder AI",
};

export default function UpdatePassword() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-8 py-12">
      <div className="mx-auto w-full max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <Logo size="lg" href="/dashboard" />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Update Password
          </h1>
          <p className="mt-2 text-muted-foreground">
            Change your account password to maintain security
          </p>
        </div>

        {/* Form */}
        <UpdatePasswordForm />

        {/* Back to Account */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex justify-center">
            <Link
              href="/account"
              className="text-sm text-primary hover:underline font-medium inline-flex items-center"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to account settings
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-8 text-xs text-muted-foreground">
        © {new Date().getFullYear()} CRE Finder AI. All rights reserved.
      </div>
    </div>
  );
}
