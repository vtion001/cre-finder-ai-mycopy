import { SignUpForm } from "@/components/forms/signup-form";
import { Logo } from "@/components/logo";
import { Shield, Target, Users, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign Up - CRE Finder AI",
  description:
    "Create a new account to access CRE Finder AI platform and services",
};

export default function SignUp() {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Container */}
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Sign Up Form */}
        <div className="flex flex-col justify-center px-8 py-12 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            {/* Logo */}
            <div className="mb-8">
              <Logo size="lg" href="/" />
            </div>

            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">
                Create your account
              </h1>
              <p className="mt-2 text-muted-foreground">
                Join thousands of professionals finding commercial real estate
                faster
              </p>
            </div>

            {/* Sign Up Form */}
            <SignUpForm />

            {/* Login Link */}
            <div className="mt-8 pt-6 border-t">
              <div className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Marketing Content */}
        <div className="hidden lg:flex flex-col justify-center bg-muted/30 px-8 py-12 lg:px-16">
          <div className="mx-auto max-w-lg">
            {/* Hero Content */}
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Start finding deals today.
              </h3>

              <p className="text-lg text-muted-foreground mb-8">
                Join the platform that's revolutionizing commercial real estate
                discovery. Get instant access to millions of properties with
                owner contact information.
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg mt-1">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Instant Results
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Get property results in seconds, not days of manual research
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg mt-1">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Targeted Search
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Filter by asset type, location, size, and dozens of other
                    criteria
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg mt-1">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Direct Owner Contact
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Skip-traced phone numbers and emails for property owners
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg mt-1">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Trusted by Professionals
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Used by investors, brokers, and wholesalers nationwide
                  </p>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="mt-12 pt-8 border-t">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-primary">10M+</div>
                  <div className="text-xs text-muted-foreground">
                    Properties
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-primary">50+</div>
                  <div className="text-xs text-muted-foreground">States</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-primary">1000+</div>
                  <div className="text-xs text-muted-foreground">Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
