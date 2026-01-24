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
  CircleX,
  ClipboardClock,
  CreditCard,
  FileText,
  Focus,
  GalleryHorizontal,
  GalleryVertical,
  Grid2X2Check,
  HandCoins,
  HeartHandshake,
  HeartPlus,
  Hotel,
  Library,
  ListCheck,
  MessageCircle,
  Newspaper,
  Package,
  PartyPopper,
  ShieldCheck,
  ShieldPlus,
  Stethoscope,
  UserCog,
  UserPen,
  Users,
} from "lucide-react";
import { Account } from "@/types/account.types";
import { useLocale } from "next-intl";
import { LanguageSwitcher } from "./utility/lang/LanguageSwitcher";
import { routing } from "@/i18n/routing";

const getNavData = (locale: string) => ({
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
      title: "Program",
      url: "/studio/packages",
      icon: Package,
    },
    {
      title: locale === routing.defaultLocale ? "Kebugaran" : "Wellness",
      url: "/studio/wellness",
      icon: HeartHandshake,
    },
    {
      title: locale === routing.defaultLocale ? "Medis" : "Medical",
      url: "/studio/medical",
      icon: HeartPlus,
    },
    {
      title:
        locale === routing.defaultLocale ? "Produk Medis" : "Medical Products",
      url: "/studio/equipment",
      icon: BriefcaseMedical,
    },
    {
      title: locale === routing.defaultLocale ? "Acara" : "Events",
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
      name: locale === routing.defaultLocale ? "Asuransi" : "Insurance",
      url: "/studio/insurance",
      icon: ShieldPlus,
    },
    {
      name: "Hotel",
      url: "/studio/hotel",
      icon: Hotel,
    },
    {
      name: locale === routing.defaultLocale ? "Dokter" : "Doctor",
      url: "/studio/doctor",
      icon: Stethoscope,
    },
  ],
  chatbot: [
    {
      name:
        locale === routing.defaultLocale ? "Aktivitas Chat" : "Chat Activity",
      url: "/studio/chat-activity",
      icon: BotMessageSquare,
    },
  ],
  articles: [
    {
      name: locale === routing.defaultLocale ? "Data Artikel" : "Articles Data",
      url: "/studio/article",
      icon: Newspaper,
    },
    {
      name: locale === routing.defaultLocale ? "Penulis" : "Author",
      url: "/studio/article/author",
      icon: UserPen,
    },
    {
      name: locale === routing.defaultLocale ? "Kategori" : "Category",
      url: "/studio/article/category",
      icon: Grid2X2Check,
    },
  ],
  schedules: [
    {
      name:
        locale === routing.defaultLocale
          ? "Jadwal Konsultasi"
          : "Consultation Schedules",
      url: "/studio/consult/schedule",
      icon: ClipboardClock,
    },
    {
      name:
        locale === routing.defaultLocale ? "Harga Konsultasi" : "Consult Price",
      url: "/dashboard/consult/price",
      icon: HandCoins,
    },
  ],
  payment: [
    {
      name: locale === routing.defaultLocale ? "Transaksi" : "Transactions",
      url: "/studio/payment/records",
      icon: CreditCard,
    },
  ],
  user_management: [
    {
      name: locale === routing.defaultLocale ? "Data Pengguna" : "Users Data",
      url: "/studio/users",
      icon: Users,
    },
    {
      name:
        locale === routing.defaultLocale
          ? "Pemulihan Pengguna"
          : "Recovery Users",
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
      name:
        locale === routing.defaultLocale
          ? "Syarat dan Ketentuan"
          : "Terms of Service",
      url: "/studio/legal/terms",
      icon: ListCheck,
    },
    {
      name:
        locale === routing.defaultLocale
          ? "Kebijakan Privasi"
          : "Privacy Consent",
      url: "/studio/legal/privacy",
      icon: ShieldCheck,
    },
    {
      name:
        locale === routing.defaultLocale ? "Pesan Kontak" : "Contact Messages",
      url: "/studio/contact",
      icon: MessageCircle,
    },
    {
      name: locale === routing.defaultLocale ? "Log Kesalahan" : "Error Logs",
      url: "/studio/error-logs",
      icon: CircleX,
    },
  ],
});

interface StudioSidebarProps extends React.ComponentProps<typeof Sidebar> {
  accounts?: Account;
}

export function StudioSidebar({ accounts, ...props }: StudioSidebarProps) {
  const locale = useLocale();
  const data = getNavData(locale);
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
      <SidebarContent className="hide-scroll">
        <p className="text-xs! px-4">
          {locale === routing.defaultLocale ? "Akun" : "Accounts"}
        </p>
        {accounts && <NavUser user={accounts} locale={locale} type="side" />}

        <div className="px-4">
          <LanguageSwitcher />
        </div>

        <NavMain items={data.navMain} />
        <NavMenu
          title={locale === routing.defaultLocale ? "Tipe" : "Type"}
          items={data.type}
        />
        <NavMenu title="Chat Bot" items={data.chatbot} />
        <NavMenu
          title={locale === routing.defaultLocale ? "Artikel" : "Article"}
          items={data.articles}
        />
        <NavMenu
          title={
            locale === routing.defaultLocale ? "Konsultasi" : "Consultation"
          }
          items={data.schedules}
        />
        <NavMenu
          title={locale === routing.defaultLocale ? "Pembayaran" : "Payment"}
          items={data.payment}
        />
        <NavMenu
          title={
            locale === routing.defaultLocale
              ? "Manajemen Pengguna"
              : "User Management"
          }
          items={data.user_management}
        />
        <NavMenu
          title={
            locale === routing.defaultLocale
              ? "Konfigurasi Website"
              : "Website Config"
          }
          items={data.website_config}
        />
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
