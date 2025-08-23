"use client";

import {
  IconClipboard,
  IconClipboardList,
  IconCreditCard,
  type IconHomeSearch,
  IconSearch,
} from "@tabler/icons-react";
import { cn } from "@v1/ui/cn";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@v1/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Search",
    url: "/dashboard/search",
    icon: IconSearch,
  },
  {
    title: "VAPI Test",
    url: "/dashboard/vapi-test", 
    icon: IconClipboard,
  },
  {
    title: "Twilio Test",
    url: "/dashboard/twilio-test",
    icon: IconClipboardList,
  },
  {
    title: "Integrations",
    url: "/dashboard/integrations",
    icon: IconCreditCard,
  },
] as {
  title: string;
  url: string;
  icon: typeof IconHomeSearch;
}[];

export function NavMain() {
  const pathname = usePathname();
  const isActive = (url: string) => {
    return pathname.startsWith(url);
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {items && items.length > 0 && (
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  size="lg"
                  className={cn(
                    "group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!gap-0 group-data-[collapsible=icon]:!justify-center ",
                    isActive(item.url) && "bg-primary/10 text-primary",
                  )}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span className="group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
