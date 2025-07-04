import "@v1/ui/globals.css";
import { cn } from "@v1/ui/cn";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://crefinder.ai"),
  title: "CRE Finder AI",
  description: "Instantly find off-market commercial properties.",
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          `${GeistSans.variable} ${GeistMono.variable}`,
          "antialiased light",
        )}
      >
        <Providers locale={params.locale}>{children}</Providers>
      </body>
    </html>
  );
}
