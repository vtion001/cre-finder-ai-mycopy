import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@v1/ui/card";
import { Separator } from "@v1/ui/separator";
import { ArrowLeft, Building2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import * as z from "zod";

export const metadata: Metadata = {
  title: "Forgot Password - CRE Finder AI",
  description:
    "Reset your password to regain access to your CRE Finder AI account",
};

export default function ForgotPassword() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sidebar px-4 py-8">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we'll send you a link to reset your
            password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Separator />
          <div className="flex justify-center">
            <Link
              href="/login"
              className="text-sm text-primary hover:underline font-medium inline-flex items-center"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>

      <p className="text-xs text-muted-foreground mt-8">
        © {new Date().getFullYear()} CRE Finder AI. All rights reserved.
      </p>
    </div>
  );
}
