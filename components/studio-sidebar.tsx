"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import Image from "next/image";
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
import Link from "next/link";
import {
  BotMessageSquare,
  BriefcaseMedical,
  ClipboardClock,
  CreditCard,
  FileText,
  Focus,
  GalleryHorizontal,
  GalleryVertical,
  Grid2X2Check,
  HeartHandshake,
  HeartPlus,
  Hotel,
  Library,
  ListCheck,
  Newspaper,
  Package,
  PartyPopper,
  ShieldCheck,
  Stethoscope,
  UserCog,
  UserPen,
  Users,
} from "lucide-react";
import { Account } from "@/types/account.types";
import { useLocale } from "next-intl";
import { LanguageSwitcher } from "./utility/lang/LanguageSwitcher";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Studio",
      url: "/studio",
      icon: Library,
    },
    {
      title: "Packages",
      url: "/studio/packages",
      icon: Package,
    },
    {
      title: "Wellness",
      url: "/studio/wellness",
      icon: HeartHandshake,
    },
    {
      title: "Medical",
      url: "/studio/medical",
      icon: HeartPlus,
    },
    {
      title: "Medical Equipment",
      url: "/studio/equipment",
      icon: BriefcaseMedical,
    },
    {
      title: "Events",
      url: "/studio/events",
      icon: PartyPopper,
    },
    {
      title: "Hero",
      url: "/studio/hero",
      icon: GalleryVertical,
    },
  ],
  // navClouds: [
  //   {
  //     title: "Capture",
  //     icon: IconCamera,
  //     isActive: true,
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Proposal",
  //     icon: IconFileDescription,
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Prompts",
  //     icon: IconFileAi,
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  // ],
  // navSecondary: [
  //   {
  //     title: "Settings",
  //     url: "#",
  //     icon: IconSettings,
  //   },
  //   {
  //     title: "Get Help",
  //     url: "#",
  //     icon: IconHelp,
  //   },
  //   {
  //     title: "Search",
  //     url: "#",
  //     icon: IconSearch,
  //   },
  // ],
  type: [
    {
      name: "Vendor",
      url: "/studio/vendor",
      icon: GalleryHorizontal,
    },
    {
      name: "Hotel",
      url: "/studio/hotel",
      icon: Hotel,
    },
    {
      name: "Doctor",
      url: "/studio/doctor",
      icon: Stethoscope,
    },
  ],
  chatbot: [
    {
      name: "Chat Activity",
      url: "/studio/chat-activity",
      icon: BotMessageSquare,
    },
  ],
  articles: [
    {
      name: "Articles Data",
      url: "/studio/article",
      icon: Newspaper,
    },
    {
      name: "Author",
      url: "/studio/article/author",
      icon: UserPen,
    },
    {
      name: "Category",
      url: "/studio/article/category",
      icon: Grid2X2Check,
    },
  ],
  schedules: [
    {
      name: "Consultation Schedules",
      url: "/studio/consult/schedule",
      icon: ClipboardClock,
    },
  ],
  payment: [
    {
      name: "Payment Records",
      url: "/studio/payment/records",
      icon: CreditCard,
    },
  ],
  user_management: [
    {
      name: "Users Data",
      url: "/studio/users",
      icon: Users,
    },
    {
      name: "Recovery Users",
      url: "/studio/users/recovery",
      icon: UserCog,
    },
  ],
  website_config: [
    // {
    //   name: "Default Metadata",
    //   url: "/studio/metadata",
    //   icon: FileText,
    // },
    // {
    //   name: "About",
    //   url: "/studio/about",
    //   icon: Focus,
    // },
    {
      name: "Terms of Service",
      url: "/studio/legal/terms",
      icon: ListCheck,
    },
    {
      name: "Privacy Consent",
      url: "/studio/legal/privacy",
      icon: ShieldCheck,
    },
  ],
};

interface StudioSidebarProps extends React.ComponentProps<typeof Sidebar> {
  accounts?: Account;
}

export function StudioSidebar({ accounts, ...props }: StudioSidebarProps) {
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
      <SidebarContent className="hide-scroll">
        <p className="text-xs! px-4">Accounts</p>
        {accounts && <NavUser user={accounts} locale={locale} type="side" />}

        <div className="px-4">
          <LanguageSwitcher />
        </div>

        <NavMain items={data.navMain} />
        <NavMenu title="Type" items={data.type} />
        <NavMenu title="Chat Bot" items={data.chatbot} />
        <NavMenu title="Article" items={data.articles} />
        <NavMenu title="Schedules" items={data.schedules} />
        <NavMenu title="Payment" items={data.payment} />
        <NavMenu title="User Management" items={data.user_management} />
        <NavMenu title="Website Config" items={data.website_config} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
        {/* <div className="fixed bottom-0 py-2 bg-linear-to-t from-white via-white px-1">
          {accounts && <NavUser user={accounts} locale={locale} type="side" />}
        </div> */}
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
    </Sidebar>
  );
}
