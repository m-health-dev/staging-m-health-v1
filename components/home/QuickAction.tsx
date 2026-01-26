"use client";

import React from "react";
import ContainerWrap from "../utility/ContainerWrap";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Activity,
  CalendarHeart,
  Camera,
  HeartPlus,
  HouseHeart,
  MessageCircleHeart,
  Newspaper,
  Package,
  Search,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { ro } from "date-fns/locale";
import { Spinner } from "../ui/spinner";
import { cn } from "@/lib/utils";
import { getLocale } from "next-intl/server";

const QuickAction = ({
  includeSearchBar,
  withoutQuickLinks,
  query,
  target,
  className,
  forPhone,
  start = false,
}: {
  includeSearchBar?: boolean;
  withoutQuickLinks?: boolean;
  query?: string;
  target?: string;
  className?: string;
  forPhone?: boolean;
  start?: boolean;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const router = useRouter();

  const [searchQuery, setSearchQuery] = React.useState(query || "");
  const [loadingSearch, setLoadingSearch] = React.useState(false);
  const [isNavigating, setIsNavigating] = React.useState(false);
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastSearchedQuery = React.useRef<string>("");

  const currentSearchParam = searchParams.get("q") || "";

  const locale = useLocale();

  // Initialize search query from URL on mount
  React.useEffect(() => {
    if (query && searchQuery !== query) {
      setSearchQuery(query);
      lastSearchedQuery.current = query;
    }
  }, [query]);

  // Handle debounced search
  React.useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // If search query is empty, clear loading state
    if (!searchQuery.trim()) {
      setLoadingSearch(false);
      setIsNavigating(false);
      return;
    }

    // If the search query hasn't changed from the last search, don't search again
    if (searchQuery === lastSearchedQuery.current) {
      setLoadingSearch(false);
      return;
    }

    // Show loading immediately
    setLoadingSearch(true);

    // Debounce the navigation
    debounceTimerRef.current = setTimeout(() => {
      let fullPath = "";

      if (target) {
        fullPath = `/${locale}/search?q=${encodeURIComponent(
          searchQuery,
        )}&target=${target}`;
      } else {
        fullPath = `/${locale}/search?q=${encodeURIComponent(searchQuery)}`;
      }

      setIsNavigating(true);
      lastSearchedQuery.current = searchQuery;

      router.push(fullPath);
    }, 600);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, locale, router]);

  // Detect when navigation is complete and URL has updated
  React.useEffect(() => {
    if (isNavigating && currentSearchParam === lastSearchedQuery.current) {
      // Navigation complete - turn off loading
      setLoadingSearch(false);
      setIsNavigating(false);
    }
  }, [currentSearchParam, isNavigating]);

  // Reset loading when leaving search page
  React.useEffect(() => {
    if (!pathname.includes("/search")) {
      setLoadingSearch(false);
      setIsNavigating(false);
    }
  }, [pathname]);

  const quickLinks = [
    {
      id: 0,
      href: `/${locale}/connect`,
      label: `${
        locale === routing.defaultLocale
          ? "Tele Konsultasi"
          : "Tele Consultation"
      }`,
      icon: <Camera />,
    },
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
      href: `/${locale}/package`,
      label: `${locale === routing.defaultLocale ? "Program" : "Our Programs"}`,
      icon: <HouseHeart />,
    },
    {
      id: 3,
      href: `/${locale}/wellness`,
      label: `${
        locale === routing.defaultLocale ? "Paket Kebugaran" : "Wellness"
      }`,
      icon: <HeartPlus />,
    },
    {
      id: 4,
      href: `/${locale}/medical`,
      label: `${locale === routing.defaultLocale ? "Paket Medis" : "Medical"}`,
      icon: <Stethoscope />,
    },
    {
      id: 5,
      href: `/${locale}/event`,
      label: `${
        locale === routing.defaultLocale ? "Acara Terbaru" : "Our Events"
      }`,
      icon: <CalendarHeart />,
    },
    {
      id: 6,
      href: `/${locale}/article`,
      label: `${
        locale === routing.defaultLocale ? "Artikel Terbaru" : "News & Article"
      }`,
      icon: <Newspaper />,
    },
  ];

  const check =
    pathname === `/${locale}` ||
    pathname === `/${locale}/` ||
    pathname.startsWith(`/${locale}/share`);

  // Jika check = true, hilangkan item dengan id = 1
  const visibleLinks = check
    ? quickLinks.filter((link) => link.id !== 1)
    : quickLinks;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Immediate search on Enter key press
    if (searchQuery.trim()) {
      // Clear debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      setLoadingSearch(true);
      setIsNavigating(true);
      lastSearchedQuery.current = searchQuery;

      router.push(`/${locale}/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // If clearing the input, reset states
    if (!value.trim()) {
      setLoadingSearch(false);
      setIsNavigating(false);
      lastSearchedQuery.current = "";
    }
  };

  return (
    <div
      className={cn("flex w-full", start ? "justify-start" : "justify-center")}
    >
      <div className={cn("max-w-full w-full", className)}>
        {/* Search Bar */}
        {includeSearchBar && (
          <div className="search_anything mb-4">
            <form
              onSubmit={handleSubmit}
              className="flex gap-2 justify-end items-center relative group"
            >
              <Input
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Search anything"
                className="h-14 rounded-full bg-white border border-primary hover:outline-0! hover:ring-0! px-5 placeholder:text-primary/50 lg:text-[18px] text-base w-full  focus-visible:ring-0! outline-0!"
              />
              <button
                type="submit"
                disabled={loadingSearch}
                className="absolute right-0 border border-primary bg-white text-primary w-14 h-14 inline-flex items-center justify-center rounded-full shadow group-hover:bg-primary group-hover:text-background group-focus:bg-primary group-focus:text-background transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingSearch ? <Spinner /> : <Search />}
              </button>
            </form>
          </div>
        )}

        {!withoutQuickLinks && !forPhone && (
          <div className="flex hide-scroll pb-2 lg:gap-4 gap-2 items-center lg:justify-center justify-start no-scrollbar cursor-grab flex-wrap">
            {visibleLinks.map(({ id, href, label, icon }) => (
              <Link key={href} href={href} className="group shrink-0">
                <button className="cursor-pointer bg-white py-1.5 pl-2 pr-5 rounded-full inline-flex gap-1 items-center group-hover:bg-primary transition-all duration-300 border">
                  <div className="lg:w-8 lg:h-8 w-6 h-6 p-1 rounded-full flex items-center justify-center text-primary group-hover:text-white transition-all duration-300 ">
                    {icon}
                  </div>
                  <p className="text-primary lg:text-base! text-sm! font-medium group-hover:text-white transition-all duration-300 whitespace-nowrap">
                    {label}
                  </p>
                </button>
              </Link>
            ))}
          </div>
        )}

        {forPhone && (
          <div className="flex flex-row flex-nowrap gap-3 overflow-x-auto hide-scroll pb-2 items-center justify-start no-scrollbar cursor-grab">
            {visibleLinks.map(({ href, label, icon }) => (
              <Link key={href} href={href} className="group shrink-0">
                <button className="cursor-pointer bg-white py-1.5 pl-2 pr-5 rounded-full inline-flex gap-1 items-center group-hover:bg-primary transition-all duration-300 border w-full">
                  <div className="w-8 h-8 p-1 rounded-full flex items-center justify-center text-primary group-hover:text-white transition-all duration-300 ">
                    {icon}
                  </div>
                  <p className="text-primary lg:text-base! text-sm! font-medium group-hover:text-white transition-all duration-300 whitespace-nowrap">
                    {label}
                  </p>
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickAction;
