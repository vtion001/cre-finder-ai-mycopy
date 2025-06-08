"use client";

import { Folder, Forward, MoreHorizontal } from "lucide-react";

import { IconBuildingStore, IconPlus } from "@tabler/icons-react";
import {
  IconBed,
  IconBox,
  IconBuilding,
  IconBuildingCommunity,
  IconBuildingSkyscraper,
  IconMap,
  IconTruck,
} from "@tabler/icons-react";
import type { Tables } from "@v1/supabase/types";
import { cn } from "@v1/ui/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@v1/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@v1/ui/sidebar";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function NavRecords({
  licenses,
}: { licenses: Tables<"user_licenses_by_asset_type">[] }) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();

  const searchParams = useSearchParams();

  const isActive = (path: string, slug?: string) => {
    if (slug) {
      return (
        pathname.startsWith(path) && searchParams.get("asset_type") === slug
      );
    }

    return pathname.startsWith(path);
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Records</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {licenses.map((item) => {
            // @ts-expect-error
            const Icon = AssetTypeIcons[item.asset_type_slug];

            const path = "/dashboard/records";
            const href = `${path}?asset_type=${item.asset_type_slug}&locations=${item.location_ids?.join(",")}`;

            return (
              <SidebarMenuItem key={item.asset_type_slug}>
                <SidebarMenuButton
                  tooltip={item.asset_type_name!}
                  asChild
                  size="lg"
                  className={cn(
                    "group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!gap-0 group-data-[collapsible=icon]:!justify-center ",
                    isActive(path, item.asset_type_slug!) &&
                      "bg-primary/10 text-primary",
                  )}
                >
                  <Link href={href}>
                    {Icon && <Icon className="!size-4" />}
                    <span className="group-data-[collapsible=icon]:hidden">
                      {item.asset_type_name}
                    </span>
                  </Link>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem>
                      <Folder className="text-muted-foreground" />
                      <span>View Records</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Forward className="text-muted-foreground" />
                      <span>Manage Locations</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            );
          })}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className={cn(
                "text-sidebar-foreground/70 group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!gap-0 group-data-[collapsible=icon]:!justify-center",
                isActive("/dashboard/search") && "bg-primary/10 text-primary",
              )}
            >
              <Link href="/dashboard/search">
                <IconPlus />
                <span className="group-data-[collapsible=icon]:hidden">
                  New search
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

const AssetTypeIcons = {
  retail: IconBuildingStore,
  office: IconBuilding,
  industrial: IconTruck,
  "multi-family": IconBuildingSkyscraper,
  "self-storage": IconBox,
  land: IconMap,
  hospitality: IconBed,
  "mixed-use": IconBuildingCommunity,
};
