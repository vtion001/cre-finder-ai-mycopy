import { UpdatePasswordForm } from "@/components/forms/update-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@v1/ui/card";
import { Separator } from "@v1/ui/separator";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Update Password - CRE Finder AI",
  description: "Update your account password for CRE Finder AI",
};

export default function UpdatePassword() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Update Password
          </CardTitle>
          <CardDescription className="text-center">
            Change your account password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpdatePasswordForm />
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Separator />
          <div className="flex justify-center">
            <Link
              href="/account"
              className="text-sm text-primary hover:underline font-medium"
            >
              Back to account settings
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
