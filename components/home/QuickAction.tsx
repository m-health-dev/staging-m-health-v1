"use client";

import React from "react";
import ContainerWrap from "../utility/ContainerWrap";
import { Input } from "../ui/input";
import {
  Activity,
  CalendarHeart,
  HeartPlus,
  MessageCircleHeart,
  Newspaper,
  Search,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";

const QuickAction = ({ includeSearchBar }: { includeSearchBar?: boolean }) => {
  const pathname = usePathname();
  const locale = useLocale();

  const quickLinks = [
    {
      id: 1,
      href: `/${locale}`,
      label: `${
        locale === routing.defaultLocale ? "Ngobrol dengan AI" : "Chat with AI"
      }`,
      icon: <MessageCircleHeart />,
    },
    {
      id: 2,
      href: `/${locale}/medical`,
      label: `${locale === routing.defaultLocale ? "Paket Medis" : "Medical"}`,
      icon: <Activity />,
    },
    {
      id: 3,
      href: `/${locale}/wellness`,
      label: `${
        locale === routing.defaultLocale ? "Paket Kesehatan" : "Wellness"
      }`,
      icon: <HeartPlus />,
    },
    {
      id: 4,
      href: `/${locale}/events`,
      label: `${
        locale === routing.defaultLocale ? "Acara Terbaru" : "Our Events"
      }`,
      icon: <CalendarHeart />,
    },
    {
      id: 5,
      href: `/${locale}/article`,
      label: `${
        locale === routing.defaultLocale ? "Artikel Terbaru" : "News & Article"
      }`,
      icon: <Newspaper />,
    },
  ];

  const check = pathname === `/${locale}` || pathname === `/${locale}/`;

  // Jika check = true, hilangkan item dengan id = 1
  const visibleLinks = check
    ? quickLinks.filter((link) => link.id !== 1)
    : quickLinks;

  return (
    <div className="flex w-full justify-center">
      <div className="lg:max-w-2xl max-w-full w-full">
        {/* Search Bar */}
        {includeSearchBar && (
          <div className="search_anything mb-4">
            <form className="flex gap-2 justify-end items-center relative group">
              <Input
                placeholder="Search anything"
                className="h-14 rounded-full bg-white px-5 placeholder:text-primary/50 lg:text-[18px] text-base w-full focus-visible:border-muted-foreground/20 focus-visible:ring-0! outline-0!"
              />
              <div className="absolute bg-white text-primary w-14 h-14 inline-flex items-center justify-center rounded-full border border-border shadow group-hover:bg-primary group-hover:text-background group-focus:bg-primary group-focus:text-background transition-all duration-300 cursor-pointer">
                <Search />
              </div>
            </form>
          </div>
        )}

        {/* Quick Links Bar */}
        <div className="flex w-full overflow-x-auto lg:overflow-x-visible hide-scroll pb-2 gap-4 items-center justify-start lg:justify-center no-scrollbar cursor-grab">
          {visibleLinks.map(({ id, href, label, icon }) => (
            <Link key={href} href={href} className="group shrink-0">
              <button className="cursor-pointer bg-white py-1.5 pl-2 pr-5 border rounded-full inline-flex gap-3 items-center shadow-sm group-hover:bg-primary transition-all duration-300">
                <div className="bg-background w-10 h-10 rounded-full flex items-center justify-center text-primary">
                  {icon}
                </div>
                <p className="text-primary font-medium group-hover:text-white transition-all duration-300 whitespace-nowrap">
                  {label}
                </p>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickAction;
