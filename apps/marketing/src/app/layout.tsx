import "@v1/ui/globals.css";
import { cn } from "@v1/ui/cn";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
export const metadata: Metadata = {
  metadataBase: new URL("https://crefinder.ai"),
  title: "CRE Finder AI",
  description: "Instantly find off-market commercial properties.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          `${GeistSans.variable} ${GeistMono.variable}`,
          "antialiased light",
        )}
      >
        {children}
      </body>
    </html>
  );
}
