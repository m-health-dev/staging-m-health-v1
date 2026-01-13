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
import { useLocale } from "next-intl";

const data = {
  navMain: [
    {
      name: "Riwayat Transaksi",
      url: "/dashboard/transactions",
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
      name: "Consult Schedules",
      url: "/dashboard/consult/schedule",
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
  const locale = useLocale();
  return (
    <Sidebar collapsible="offcanvas" className="p-0" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={"/home"}>
              <Image
                src={
                  "https://irtyvkfjzojdkmtnstmd.supabase.co/storage/v1/object/public/m-health-public/logo/icon_mhealth_logo.PNG"
                }
                width={100}
                height={100}
                unoptimized
                alt="icon-m-health"
                className="object-contain w-8 h-8 mx-2 my-3"
              />
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="hide-scroll mt-5">
        <p className="text-xs! px-4">Accounts</p>
        <NavUser user={accounts} locale={locale} type="side" />

        <NavMenu title="Transaksi" items={data.navMain} />
        <NavMenu title="Chat Bot" items={data.chatbot} />
        <NavMenu title="Schedules" items={data.schedules} />

        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
    </Sidebar>
  );
}
