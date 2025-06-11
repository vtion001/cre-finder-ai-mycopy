"use client";

import { MobileNavDrawer } from "@/components/mobile-nav-drawer";
import type { Tables } from "@v1/supabase/types";
import { cn } from "@v1/ui/cn";
import { SidebarTrigger } from "@v1/ui/sidebar";
import type { ReactNode } from "react";

interface SiteHeaderProps {
  title: string;
  children?: ReactNode;
  user?: Tables<"users">;
  licenses?: Tables<"user_licenses_by_asset_type">[];
  showMobileDrawer?: boolean;
  className?: string;
}

export function SiteHeader({
  title,
  children,
  user,
  licenses,
  showMobileDrawer = false,
  className,
}: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-14 shrink-0 items-center border-b transition-[width,height] ease-linear",
        className,
      )}
    >
      <div className="flex w-full items-center gap-1 px-3 sm:px-6 lg:gap-2">
        {/* Mobile navigation - either sidebar trigger or drawer */}
        {showMobileDrawer && user && licenses ? (
          <MobileNavDrawer user={user} licenses={licenses} />
        ) : (
          <SidebarTrigger className="md:hidden -ml-1" />
        )}
        <h1 className="text-sm sm:text-base font-medium truncate">{title}</h1>
        <div className="ml-auto flex items-center gap-2">{children}</div>
      </div>
    </header>
  );
}
