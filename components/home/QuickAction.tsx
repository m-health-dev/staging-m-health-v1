"use client";

import React from "react";
import ContainerWrap from "../utility/ContainerWrap";
import { Input } from "../ui/input";
import {
  Activity,
  CalendarHeart,
  Camera,
  HeartPlus,
  MessageCircleHeart,
  Newspaper,
  Search,
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

const QuickAction = ({
  includeSearchBar,
  withoutQuickLinks,
  query,
  target,
}: {
  includeSearchBar?: boolean;
  withoutQuickLinks?: boolean;
  query?: string;
  target?: string;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = React.useState(query || "");
  const [loadingSearch, setLoadingSearch] = React.useState(false);
  const [isNavigating, setIsNavigating] = React.useState(false);
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastSearchedQuery = React.useRef<string>("");

  const currentSearchParam = searchParams.get("q") || "";

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
          searchQuery
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
      label: `${locale === routing.defaultLocale ? "Paket" : "Our Packages"}`,
      icon: <Activity />,
    },
    // {
    //   id: 3,
    //   href: `/${locale}/wellness`,
    //   label: `${
    //     locale === routing.defaultLocale ? "Paket Kebugaran" : "Wellness"
    //   }`,
    //   icon: <HeartPlus />,
    // },
    // {
    //   id: 4,
    //   href: `/${locale}/wellness`,
    //   label: `${
    //     locale === routing.defaultLocale ? "Paket Kebugaran" : "Wellness"
    //   }`,
    //   icon: <HeartPlus />,
    // },
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

  const check = pathname === `/${locale}` || pathname === `/${locale}/`;

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
    <div className="flex w-full justify-center">
      <div className="lg:max-w-2xl max-w-full w-full">
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
                className="h-14 rounded-full bg-white px-5 placeholder:text-primary/50 lg:text-[18px] text-base w-full focus-visible:border-muted-foreground/20 focus-visible:ring-0! outline-0!"
              />
              <button
                type="submit"
                disabled={loadingSearch}
                className="absolute bg-white text-primary w-14 h-14 inline-flex items-center justify-center rounded-full border border-border shadow group-hover:bg-primary group-hover:text-background group-focus:bg-primary group-focus:text-background transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingSearch ? <Spinner /> : <Search />}
              </button>
            </form>
          </div>
        )}

        {!withoutQuickLinks && (
          <div className="flex w-full overflow-x-auto lg:overflow-x-visible hide-scroll pb-2 gap-4 items-center justify-start lg:justify-center no-scrollbar cursor-grab lg:flex-nowrap md:flex-wrap max-w-full">
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
        )}
      </div>
    </div>
  );
};

export default QuickAction;
