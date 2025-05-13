import { CredentialsSignInForm } from "@/components/forms/credentials-signin-form";
import { OtpSignInForm } from "@/components/forms/otp-signin-form";
import { SignUpForm } from "@/components/forms/signup-form";
import { Button } from "@v1/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@v1/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@v1/ui/tabs";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign Up - CRE Finder AI",
};

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter>
          <Link href={"/login"}>
            <Button variant="link" className="w-full">
              Already have an account? Sign in
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
