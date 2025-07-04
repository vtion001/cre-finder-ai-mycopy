"use client";

import { TRPCReactProvider } from "@/trpc/client";
import "@v1/ui/globals.css";

import { Toaster } from "@v1/ui/sonner";

import { ThemeProvider } from "next-themes";

import { NuqsAdapter } from "nuqs/adapters/next";
import type { ReactNode } from "react";

type ProviderProps = {
  locale: string;
  children: ReactNode;
};

export function Providers({ locale, children }: ProviderProps) {
  return (
    <TRPCReactProvider>
      <NuqsAdapter>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </NuqsAdapter>
    </TRPCReactProvider>
  );
}
