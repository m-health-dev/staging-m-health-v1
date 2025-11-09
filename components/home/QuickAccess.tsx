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

const QuickAccess = () => {
  const quickLinks = [
    { id: 1, href: "/medical", label: "Paket Medis", icon: <Activity /> },
    { id: 2, href: "/wellness", label: "Paket Kesehatan", icon: <HeartPlus /> },
    { id: 3, href: "/events", label: "Acara Terbaru", icon: <CalendarHeart /> },
    { id: 4, href: "/article", label: "Artikel Terbaru", icon: <Newspaper /> },
    { id: 5, href: "/", label: "Chat w/ AI", icon: <MessageCircleHeart /> },
  ];

  return (
    <ContainerWrap className="flex w-full justify-center">
      <div className="lg:max-w-2xl max-w-full w-full">
        {/* Search Bar */}
        <div className="search_anything mb-4">
          <form className="flex gap-2 justify-center items-center">
            <Input
              placeholder="Search anything"
              className="h-14 rounded-full bg-white px-5 placeholder:text-primary/50 lg:text-[18px] text-base w-full border border-border focus-visible:ring-primary focus-visible:ring-1"
            />
            <div className="bg-white text-primary w-16 h-14 inline-flex items-center justify-center rounded-full border border-border shadow hover:bg-primary hover:text-background transition-all duration-300 cursor-pointer">
              <Search />
            </div>
          </form>
        </div>

        {/* Quick Links Bar */}
        <div className="flex w-full overflow-x-auto lg:overflow-x-visible hide-scroll pb-2 gap-4 items-center justify-start lg:justify-center no-scrollbar cursor-grab">
          {quickLinks.map(({ id, href, label, icon }) => (
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
    </ContainerWrap>
  );
};

export default QuickAccess;
