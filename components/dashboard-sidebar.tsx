"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { NavMenu } from "@/components/nav-menu";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { BotMessageSquare, ClipboardClock, ScanBarcode } from "lucide-react";
import { IconHelp, IconSettings } from "@tabler/icons-react";
import { Account } from "@/types/account.types";

const data = {
  navMain: [
    {
      name: "Riwayat Transaksi",
      url: "/dashboard/order-list",
      icon: ScanBarcode,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
  ],
  chatbot: [
    {
      name: "Chat Activity",
      url: "/dashboard/chat-activity",
      icon: BotMessageSquare,
    },
  ],
  schedules: [
    {
      name: "Booking Data",
      url: "/studio/booking",
      icon: ClipboardClock,
    },
  ],
};

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  accounts: Account;
}

export function DashboardSidebar({
  accounts,
  ...props
}: DashboardSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5! hover:bg-transparent"
            >
              <Link href={`/studio`}>
                <Image
                  src="https://irtyvkfjzojdkmtnstmd.supabase.co/storage/v1/object/public/m-health-public/logo/mhealth_logo.PNG"
                  width={120}
                  height={40}
                  className="object-contain"
                  alt="M-Health Logo"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="hide-scroll mt-5">
        <p className="text-xs! px-4">Accounts</p>
        <NavUser user={accounts} />

        <NavMenu title="Transaksi" items={data.navMain} />
        <NavMenu title="Chat Bot" items={data.chatbot} />
        <NavMenu title="Schedules" items={data.schedules} />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}
