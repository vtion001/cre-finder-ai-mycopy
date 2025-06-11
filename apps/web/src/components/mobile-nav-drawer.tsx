"use client";

import { Logo } from "@/components/logo";
import {
  IconBed,
  IconBox,
  IconBrightness,
  IconBuilding,
  IconBuildingCommunity,
  IconBuildingSkyscraper,
  IconBuildingStore,
  IconCreditCard,
  IconHome,
  IconLogout,
  IconMap,
  IconPlus,
  IconSettings,
  IconTruck,
} from "@tabler/icons-react";
import { createClient } from "@v1/supabase/client";
import type { Tables } from "@v1/supabase/types";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@v1/ui/drawer";
import { Separator } from "@v1/ui/separator";
import { Switch } from "@v1/ui/switch";
import { Menu } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AssetTypeIcons = {
  residential: IconHome,
  retail: IconBuildingStore,
  office: IconBuilding,
  industrial: IconTruck,
  "multi-family": IconBuildingSkyscraper,
  "self-storage": IconBox,
  land: IconMap,
  hospitality: IconBed,
  "mixed-use": IconBuildingCommunity,
};

interface MobileNavDrawerProps {
  user: Tables<"users">;
  licenses: Tables<"user_licenses_by_asset_type">[];
}

export function MobileNavDrawer({ user, licenses }: MobileNavDrawerProps) {
  const [open, setOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const supabase = createClient();

    await supabase.auth.signOut({
      scope: "local",
    });

    router.push("/login");
  };

  const isActive = (path: string, assetType?: string) => {
    if (assetType) {
      return (
        pathname.includes("/dashboard/records") &&
        pathname.includes(`asset_type=${assetType}`)
      );
    }
    return pathname.startsWith(path);
  };

  const getInitials = () => {
    if (user.full_name) {
      return user.full_name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email?.slice(0, 2).toUpperCase() || "U";
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-left">
          <div className="flex items-center justify-between">
            <Logo href="/dashboard" size="md" />
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <span className="sr-only">Close</span>×
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <DrawerBody>
          <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                {getInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.full_name || user.email}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>

            {/* New Search */}
            <div>
              <Link
                href="/dashboard/search"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive("/dashboard/search")
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted/50"
                }`}
              >
                <IconPlus className="h-5 w-5" />
                <span className="font-medium">New Search</span>
              </Link>
            </div>

            {/* Licensed Asset Types */}
            {licenses && licenses.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 px-3">
                  Your Licenses
                </h3>
                <div className="space-y-1">
                  {licenses.map((item) => {
                    const Icon =
                      AssetTypeIcons[
                        item.asset_type_slug as keyof typeof AssetTypeIcons
                      ];
                    const href = `/dashboard/records?asset_type=${item.asset_type_slug}`;

                    return (
                      <Link
                        key={item.asset_type_slug}
                        href={href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          isActive("/dashboard/records", item.asset_type_slug!)
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        {Icon && <Icon className="h-5 w-5" />}
                        <span className="flex-1">{item.asset_type_name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.license_count}
                        </Badge>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <Separator />

            {/* Account Settings */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 px-3">
                Account
              </h3>
              <div className="space-y-1">
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive("/account")
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <IconSettings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>

                <Link
                  href="/account/billing"
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive("/account/billing")
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <IconCreditCard className="h-5 w-5" />
                  <span>Billing</span>
                </Link>

                {/* Dark Mode Toggle */}
                <div className="flex items-center gap-3 p-3 rounded-lg">
                  <IconBrightness className="h-5 w-5" />
                  <span className="flex-1">Dark Mode</span>
                  {mounted ? (
                    <Switch
                      checked={resolvedTheme !== "light"}
                      onCheckedChange={() =>
                        setTheme(resolvedTheme === "dark" ? "light" : "dark")
                      }
                    />
                  ) : (
                    <div className="h-5 w-9 bg-muted rounded-full animate-pulse" />
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Sign Out */}
            <div className="pt-2">
              <Button
                variant="ghost"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="w-full justify-start p-3 h-auto text-left"
              >
                <IconLogout className="h-5 w-5 mr-3" />
                <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
              </Button>
            </div>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
