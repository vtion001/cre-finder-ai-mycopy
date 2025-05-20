"use client";

import {
  CreditCardIcon,
  HelpCircleIcon,
  HistoryIcon,
  SearchIcon,
} from "lucide-react";
import type * as React from "react";

import type { Tables } from "@v1/supabase/types";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@v1/ui/sidebar";
import { Logo } from "../logo";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";

const data = {
  navMain: [
    {
      title: "Property Search",
      url: "/dashboard/search",
      icon: SearchIcon,
    },
    {
      title: "Search History",
      url: "/dashboard/history",
      icon: HistoryIcon,
    },
    {
      title: "Credits",
      url: "/dashboard/credits",
      icon: CreditCardIcon,
    },
  ],
  navSecondary: [
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
  ],
};

type SidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: Tables<"users">;
};

export function AppSidebar({ user, ...props }: SidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Logo href="/dashboard" size="md" className="px-2 py-1" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
