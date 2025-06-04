import "@v1/ui/globals.css";
import { SidebarProvider } from "@v1/ui/sidebar";

import { Toaster } from "@v1/ui/sonner";

import { ThemeProvider } from "next-themes";

import { NuqsAdapter } from "nuqs/adapters/next";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
  );
}
