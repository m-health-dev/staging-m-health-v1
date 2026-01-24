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

import {
  BotMessageSquare,
  ClipboardClock,
  HandCoins,
  ScanBarcode,
} from "lucide-react";
import { IconHelp, IconSettings } from "@tabler/icons-react";
import { Account } from "@/types/account.types";
import { useLocale } from "next-intl";
import { LanguageSwitcher } from "./utility/lang/LanguageSwitcher";
import { routing } from "@/i18n/routing";

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  accounts: Account;
}

export function DashboardSidebar({
  accounts,
  ...props
}: DashboardSidebarProps) {
  const locale = useLocale();

  const data = {
    navMain: [
      {
        name:
          locale === routing.defaultLocale
            ? "Riwayat Transaksi"
            : "Transaction History",
        url: "/dashboard/transactions",
        icon: ScanBarcode,
      },
    ],
    navSecondary: [
      {
        title: locale === routing.defaultLocale ? "Pengaturan" : "Settings",
        url: "#",
        icon: IconSettings,
      },
      {
        title: locale === routing.defaultLocale ? "Bantuan" : "Get Help",
        url: "#",
        icon: IconHelp,
      },
    ],
    chatbot: [
      {
        name:
          locale === routing.defaultLocale ? "Aktivitas Chat" : "Chat Activity",
        url: "/dashboard/chat-activity",
        icon: BotMessageSquare,
      },
    ],
    schedules: [
      {
        name:
          locale === routing.defaultLocale
            ? "Jadwal Konsultasi"
            : "Consult Schedules",
        url: "/dashboard/consult/schedule",
        icon: ClipboardClock,
      },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" className="p-0" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={"/home"}>
              <Image
                src={
                  "https://hoocfkzapbmnldwmedrq.supabase.co/storage/v1/object/public/m-health-public/static/mhealth_logo_crop.PNG"
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
        <p className="text-xs! px-4">
          {locale === routing.defaultLocale ? "Akun" : "Accounts"}
        </p>
        <NavUser user={accounts} locale={locale} type="side" />

        <div className="px-4">
          <LanguageSwitcher />
        </div>

        <NavMenu
          title={locale === routing.defaultLocale ? "Transaksi" : "Transaction"}
          items={data.navMain}
        />
        <NavMenu title="Chat Bot" items={data.chatbot} />
        <NavMenu
          title={
            locale === routing.defaultLocale ? "Konsultasi" : "Consultation"
          }
          items={data.schedules}
        />

        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
    </Sidebar>
  );
}
