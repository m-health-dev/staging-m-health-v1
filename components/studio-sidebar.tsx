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
  Grid2X2Check,
  HeartHandshake,
  HeartPlus,
  Hotel,
  Library,
  ListCheck,
  Newspaper,
  Package,
  ShieldCheck,
  UserCog,
  UserPen,
  Users,
} from "lucide-react";

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
      url: "/studio/medical-equipment",
      icon: BriefcaseMedical,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
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
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
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
      url: "/studio/articles",
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
      name: "Booking Data",
      url: "/studio/booking",
      icon: ClipboardClock,
    },
  ],
  payment: [
    {
      name: "Payment Records",
      url: "/studio/payment",
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
    {
      name: "Default Metadata",
      url: "/studio/metadata",
      icon: FileText,
    },
    {
      name: "About",
      url: "/studio/about",
      icon: Focus,
    },
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

export function StudioSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
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
                  src={
                    "https://irtyvkfjzojdkmtnstmd.supabase.co/storage/v1/object/public/m-health-public/logo/mhealth_logo.PNG"
                  }
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
      <SidebarContent className="hide-scroll">
        <NavMain items={data.navMain} />
        <NavMenu title="Type" items={data.type} />
        <NavMenu title="Chat Bot" items={data.chatbot} />
        <NavMenu title="Article" items={data.articles} />
        <NavMenu title="Schedules" items={data.schedules} />
        <NavMenu title="Payment" items={data.payment} />
        <NavMenu title="User Management" items={data.user_management} />
        <NavMenu title="Website Config" items={data.website_config} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
    </Sidebar>
  );
}
