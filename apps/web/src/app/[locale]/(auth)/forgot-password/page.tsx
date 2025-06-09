import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { Logo } from "@/components/logo";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forgot Password - CRE Finder AI",
  description:
    "Reset your password to regain access to your CRE Finder AI account",
};

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-8 py-12">
      <div className="mx-auto w-full max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <Logo size="lg" href="/" />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
          <p className="mt-2 text-muted-foreground">
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>

        {/* Form */}
        <ForgotPasswordForm />

        {/* Back to Login */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex justify-center">
            <Link
              href="/login"
              className="text-sm text-primary hover:underline font-medium inline-flex items-center"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
