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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@v1/ui/tabs";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login - CRE Finder AI",
};

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="credentials" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="credentials">Password</TabsTrigger>
              <TabsTrigger value="magic">Magic Link</TabsTrigger>
            </TabsList>
            <TabsContent value="credentials">
              <CredentialsSignInForm />
            </TabsContent>
            <TabsContent value="magic">
              <OtpSignInForm />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Link href={"/signup"}>
            <Button variant="link" className="w-full">
              Don't have an account? Sign up
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
