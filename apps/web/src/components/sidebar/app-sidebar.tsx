import {
  ClipboardIcon,
  ClipboardListIcon,
  CreditCardIcon,
  HelpCircleIcon,
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
  SidebarTrigger,
} from "@v1/ui/sidebar";
import { Logo } from "../logo";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { SidebarCreditUsage } from "./sidebar-credit-usage";
import { SidebarPlanInfo } from "./sidebar-plan-info";

type SidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: Tables<"users">;
};

export function AppSidebar({ user, ...props }: SidebarProps) {
  return (
    <Sidebar
      collapsible="icon"
      className="px-2.5 group-data-[collapsible=icon]:px-0.5 "
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Logo
              href="/dashboard"
              size="md"
              className="group-data-[collapsible=icon]:hidden -mx-2"
            />

            <div className="hidden group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
              <Logo
                href="/dashboard"
                size="sm"
                className="p-1"
                showText={false}
              />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarTrigger className="absolute right-0 top-7 -translate-y-1/2 translate-x-1/2 bg-background rounded-full border z-50" />
      </SidebarHeader>
      <SidebarContent className="flex flex-col">
        <NavMain />

        <div className="flex-1" />
      </SidebarContent>
      <SidebarFooter>
        <div className="mb-4">
          <SidebarPlanInfo />
          <SidebarCreditUsage />
        </div>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
