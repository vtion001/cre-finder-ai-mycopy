"use client";

import { type Icon, IconBrightness } from "@tabler/icons-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@v1/ui/sidebar";
import { Skeleton } from "@v1/ui/skeleton";
import { Switch } from "@v1/ui/switch";
import { HelpCircleIcon, type LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import type * as React from "react";

const items = [
  {
    title: "Get Help",
    url: "#",
    icon: HelpCircleIcon,
  },
];

export function NavSecondary({
  ...props
}: {} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
