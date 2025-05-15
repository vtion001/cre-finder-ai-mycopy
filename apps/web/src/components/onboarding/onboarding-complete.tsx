"use client";

import { Button } from "@v1/ui/button";
import { CheckCircle2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

export function OnboardingComplete() {
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="text-center py-8 space-y-6">
      <div className="flex justify-center">
        <CheckCircle2Icon className="h-16 w-16 text-green-500" />
      </div>
      <h1 className="text-2xl font-bold">Setup Complete!</h1>
      <p className="text-muted-foreground max-w-md mx-auto">
        Your account has been successfully set up. You can now start searching
        for properties in your selected cities.
      </p>
      <div className="pt-4">
        <Button onClick={handleGoToDashboard} size="lg">
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
