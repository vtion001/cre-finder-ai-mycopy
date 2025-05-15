"use client";

import { Logo } from "@/components/logo";
import { Button } from "@v1/ui/button";
import { Card, CardContent } from "@v1/ui/card";
import { cn } from "@v1/ui/cn";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2,
  CheckIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

const steps = [
  { id: "pricing", label: "Choose Plan", path: "/onboarding" },
  { id: "locations", label: "Select Locations", path: "/onboarding/cities" },
  { id: "complete", label: "Complete", path: "/onboarding/complete" },
];

interface OnboardingLayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  showNextButton?: boolean;
  nextButtonDisabled?: boolean;
  nextButtonLabel?: string;
  onNextClick?: () => void;
  onBackClick?: () => void;
  isNextLoading?: boolean;
}

export function OnboardingLayout({
  children,
  showBackButton = true,
  showNextButton = true,
  nextButtonDisabled = false,
  nextButtonLabel = "Continue",
  onNextClick,
  onBackClick,
  isNextLoading = false,
}: OnboardingLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const currentStepIndex = steps.findIndex((step) => step.path === pathname);

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else if (currentStepIndex > 0) {
      const prevStep = steps[currentStepIndex - 1];
      if (prevStep) {
        router.push(prevStep.path);
      }
    }
  };

  const handleNextClick = () => {
    if (onNextClick) {
      onNextClick();
    } else if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      if (nextStep) {
        router.push(nextStep.path);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 flex flex-col">
      <header className="border-sidebar-border border-si bg-sidebar">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="sm" />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="w-full max-w-3xl mx-auto mb-8">
          {/* Progress line that sits behind the indicators */}
          <div className="relative">
            <div className="absolute top-5 left-0 w-full h-0.5 bg-border -z-10" />

            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const isActive = index <= currentStepIndex;
                const isCompleted = index < currentStepIndex;

                return (
                  <div
                    key={step.label}
                    className="flex flex-col items-center relative w-full"
                  >
                    {/* Step indicator with background to cover the line */}
                    <div
                      className={`
                    flex items-center justify-center h-10 w-10 rounded-full border-2 z-10
                    ${isActive ? "bg-primary border-primary text-primary-foreground" : "bg-background border-muted-foreground/30 text-muted-foreground/50"}
                  `}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>

                    {/* Step label */}
                    <span
                      className={`mt-2 text-sm font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {step.label}
                    </span>

                    {/* Colored progress line for completed steps */}
                    {index < steps.length - 1 && isCompleted && (
                      <div className="absolute top-5 left-1/2 w-full h-0.5 bg-primary" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {children}

        <div className="mt-6 max-w-3xl mx-auto flex justify-between">
          {showBackButton && currentStepIndex > 0 ? (
            <Button
              variant="outline"
              onClick={handleBackClick}
              className="flex items-center gap-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <div />
          )}
          {showNextButton && currentStepIndex < steps.length - 1 && (
            <Button
              onClick={handleNextClick}
              disabled={nextButtonDisabled || isNextLoading}
              className="flex items-center gap-2 min-w-[120px]"
            >
              {isNextLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Loading...
                </span>
              ) : (
                <>
                  {nextButtonLabel}
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
