"use client";

import { MessageCircle, Search } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import Link from "next/link";
import { typeOftarget } from "@/lib/search/get-search";
import { routing } from "@/i18n/routing";

const SearchArea = ({ target }: { target: string }) => {
  const pathname = usePathname();
  const locale = useLocale();

  const [isVisible, setIsVisible] = React.useState(false);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Hitung persentase scroll
      const scrollPercentage =
        (currentScrollY / (documentHeight - windowHeight)) * 100;

      // Tampilkan nav jika sudah scroll > 10%
      // Sembunyikan nav jika hampir sampai bawah (> 90%)
      if (scrollPercentage > 0 && scrollPercentage < 90) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Check initial scroll position
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const searchParams = useSearchParams();

  const router = useRouter();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [loadingSearch, setLoadingSearch] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastSearchedQuery = React.useRef<string>("");

  const currentSearchParam = searchParams.get("q") || "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Immediate search on Enter key press
    if (searchQuery.trim()) {
      // Clear debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      setLoadingSearch(true);
      setIsOpen(true);
      lastSearchedQuery.current = searchQuery;

      router.push(
        `/${locale}/search?q=${encodeURIComponent(
          searchQuery,
        )}&target=${target}`,
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // If clearing the input, reset states
    if (!value.trim()) {
      setLoadingSearch(false);
      setIsOpen(false);
      lastSearchedQuery.current = "";
    }
  };

  return (
    <div
      className={`fixed bottom-5 inset-x-0 z-99 transition-all duration-300 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-20 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex w-full justify-center items-center ">
        <div className="flex w-fit justify-center items-center gap-2 bg-white p-2 border rounded-full shadow-xl">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-white lg:px-4 lg:py-2 lg:w-fit lg:h-fit w-10 h-10 rounded-full inline-flex gap-3 items-center justify-center cursor-pointer hover:bg-primary hover:text-white transition-all duration-300 text-primary border"
          >
            <Search className="size-5" />
            <p className="lg:block hidden">
              {locale === routing.defaultLocale ? "Cari" : "Search"}
            </p>
          </button>
          <Link href={`/${locale}`}>
            <button className="bg-white lg:px-4 lg:py-2 lg:w-fit lg:h-fit w-10 h-10 rounded-full inline-flex gap-3 items-center justify-center cursor-pointer hover:bg-primary hover:text-white transition-all duration-300 text-primary border">
              <MessageCircle className="size-5" />
              <p className="lg:block hidden">AI</p>
            </button>
          </Link>
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="bg-white rounded-4xl">
          <DialogTitle className="hidden" />
          <div className="search_anything">
            <h5 className="text-primary font-bold mb-5 capitalize">
              {locale === routing.defaultLocale ? `Cari` : `Search`}
            </h5>
            <form
              onSubmit={handleSubmit}
              className="flex gap-2 justify-end items-center relative group"
            >
              <Input
                value={searchQuery}
                onChange={handleInputChange}
                placeholder={
                  locale === routing.defaultLocale
                    ? "Ketik disini..."
                    : "Type here..."
                }
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchArea;
