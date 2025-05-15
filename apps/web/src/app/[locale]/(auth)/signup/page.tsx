import { SignUpForm } from "@/components/forms/signup-form";
import { Logo } from "@/components/logo";
import { Button } from "@v1/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@v1/ui/card";
import { Separator } from "@v1/ui/separator";
import { Building2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign Up - CRE Finder AI",
  description:
    "Create a new account to access CRE Finder AI platform and services",
};

export default function SignUp() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sidebar px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Logo size="lg" />
      </div>
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Get Started</CardTitle>
          <CardDescription className="text-center">
            Create a new account to discover properties with AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Separator />
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in instead
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
