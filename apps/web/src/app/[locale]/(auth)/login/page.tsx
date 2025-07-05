import { CredentialsSignInForm } from "@/components/forms/credentials-signin-form";
import { OtpSignInForm } from "@/components/forms/otp-signin-form";
import { Logo } from "@/components/logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@v1/ui/tabs";
import { Clock, MapPin, Search, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login - CRE Finder AI",
  description: "Log in to access your CRE Finder AI account and properties",
};

export default function Login() {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Container */}
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Authentication Forms */}
        <div className="flex flex-col justify-center px-8 py-12 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            {/* Logo */}
            <div className="mb-8">
              <Logo size="lg" href="/" />
            </div>

            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back
              </h1>
              <p className="mt-2 text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>

            {/* Authentication Tabs */}
            <Tabs defaultValue="credentials" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
                <TabsTrigger value="credentials" className="text-base">
                  Password
                </TabsTrigger>
                <TabsTrigger value="magic" className="text-base">
                  Magic Link
                </TabsTrigger>
              </TabsList>

              <TabsContent value="credentials" className="space-y-6">
                <CredentialsSignInForm />
                <div className="text-sm text-right">
                  <Link
                    href="/forgot-password"
                    className="text-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="magic" className="space-y-6">
                <OtpSignInForm />
              </TabsContent>
            </Tabs>

            {/* Sign Up Link */}
            <div className="mt-8 pt-6 border-t">
              <div className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-primary font-medium hover:underline"
                >
                  Create an account
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
                Find commercial real estate, faster.
              </h3>

              <p className="text-lg text-muted-foreground mb-8">
                Skip the painful search process! Instantly discover and filter
                commercial real estate properties with AI-powered insights.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg mt-1">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    AI-Powered Search
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Advanced filters and intelligent matching to find exactly
                    what you need
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg mt-1">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Location Intelligence
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Search by city, county, or region with comprehensive
                    coverage
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg mt-1">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Owner Contact Information
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Skip-traced contact details for direct property owner
                    outreach
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg mt-1">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Save Time & Money
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Find properties in seconds, not weeks of manual research
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-12 pt-8 border-t">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10M+</div>
                  <div className="text-sm text-muted-foreground">
                    Properties
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">States</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
