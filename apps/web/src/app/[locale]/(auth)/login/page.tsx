import { CredentialsSignInForm } from "@/components/forms/credentials-signin-form";
import { OtpSignInForm } from "@/components/forms/otp-signin-form";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@v1/ui/tabs";
import { Building2 } from "lucide-react"; // Adding an icon for visual appeal
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login - CRE Finder AI",
  description: "Log in to access your CRE Finder AI account and properties",
};

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8">
      {/* <div className="flex items-center gap-2 mb-6">
        <Building2 className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-primary">CRE Finder AI</h1>
      </div> */}
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="credentials" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="credentials">Password</TabsTrigger>
              <TabsTrigger value="magic">Magic Link</TabsTrigger>
            </TabsList>
            <TabsContent value="credentials" className="space-y-4">
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
            <TabsContent value="magic">
              <OtpSignInForm />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Separator />
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-primary font-medium hover:underline"
            >
              Create an account
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
