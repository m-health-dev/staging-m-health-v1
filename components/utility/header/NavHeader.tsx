"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import ContainerWrap from "../ContainerWrap";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { locale } from "dayjs";
import { LanguageSwitcher } from "../lang/LanguageSwitcher";
import Link from "next/link";
import {
  ArrowRightToLine,
  Check,
  Copy,
  Eye,
  EyeClosed,
  EyeOff,
  LogIn,
  Share2,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { NavigationLinks } from "@/constants/NavigationLinks";
import { cn } from "@/lib/utils";
import { routing } from "@/i18n/routing";
import { Toggle } from "@/components/ui/toggle";
import { ChangeChatStatus, SetChatStatus } from "@/lib/chatbot/chat-status";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { baseUrl } from "@/helper/baseUrl";
import { getShareSlug } from "@/lib/chatbot/getChatActivity";
import { Spinner } from "@/components/ui/spinner";
import {
  getAccessToken,
  getUserRole,
} from "@/app/[locale]/(auth)/actions/auth.actions";
import { set } from "zod";
import { Skeleton } from "@/components/ui/skeleton";

const userCache: Record<string, any> = {};

const NavHeader = ({
  status,
  sessionId,
  shareSlug,
  type = "default",
}: {
  status?: string;
  sessionId?: string;
  shareSlug?: string;
  type?: "preview" | "share" | "default";
}) => {
  const locale = useLocale();
  const path = usePathname();
  const [openPublic, setOpenPublic] = useState(false);
  const [copied, setCopied] = useState(false);

  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState(shareSlug);

  const [dashButton, setDashButton] = useState<"admin" | "user" | "default">(
    "default",
  );

  const [loadingAccessButton, setLoadingAccessButton] = useState(true);

  const [initialStatus, setInitialStatus] = useState(status);

  useEffect(() => {
    if (status === "private") {
      setOpenPublic(false);
    } else if (status === "public") {
      setOpenPublic(true);
    }
  }, []);

  const sessionData = sessionId || "";

  const pathCheck =
    (path.startsWith(`/${locale}`) && path.endsWith(`/${locale}`)) ||
    path.startsWith(`/${locale}/c`) ||
    path.startsWith(`/${locale}/share`);

  // useEffect(() => {
  //   setLoadingAccessButton(true);
  //   const fetch = async () => {
  //     setLoadingAccessButton(true);
  //     const role = await getUserRole();
  //     if (role === "admin") {
  //       setDashButton("admin");
  //       setLoadingAccessButton(false);
  //       userCache["role"] = "admin";
  //     } else if (role === "user") {
  //       setDashButton("user");
  //       setLoadingAccessButton(false);
  //       userCache["role"] = "user";
  //     } else {
  //       setDashButton("default");
  //       setLoadingAccessButton(false);
  //     }
  //   };

  //   fetch();
  // }, []);

  useEffect(() => {
    setLoadingAccessButton(true);

    const fetchRole = async () => {
      setLoadingAccessButton(true);

      // 1. Cek apakah sudah ada cache
      if (userCache["role"]) {
        setDashButton(userCache["role"]);
        setLoadingAccessButton(false);
        return;
      }

      // 2. Jika tidak ada, fetch dari server
      const role = await getUserRole();

      // 3. Simpan ke cache
      userCache["role"] = role;

      // 4. Set state
      setDashButton(role);
      setLoadingAccessButton(false);
    };

    fetchRole();
  }, []);

  return (
    <ContainerWrap className="sticky top-8 z-99 hover:scale-101 transition-all duration-300 group">
      <nav className="px-5 z-99 lg:border-b-0 border-b border-primary/10 bg-white transition-all duration-300 rounded-full mt-8">
        <header className="lg:py-4 py-3 flex w-full items-center justify-between">
          <Link href={`/${locale}/home`}>
            <Image
              src={
                "https://irtyvkfjzojdkmtnstmd.supabase.co/storage/v1/object/public/m-health-public/logo/mhealth_logo.PNG"
              }
              width={150}
              height={40}
              className="object-contain"
              alt="M-Health Logo"
            />
          </Link>
          <div>
            <div className="flex xl:hidden">
              <Sheet>
                <SheetTrigger className=" bg-white text-primary p-2 rounded-full">
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-8"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="p-8 bg-white z-999 lg:max-w-md! overflow-auto hide-scroll"
                >
                  <SheetTitle />
                  <SheetClose className="flex items-center justify-end pointer-events-auto gap-2 cursor-pointer">
                    <h5 className="text-primary font-bold">
                      {" "}
                      {locale === routing.defaultLocale ? "Tutup" : "Close"}
                    </h5>
                    <div className="text-primary bg-background p-2 rounded-full">
                      <X />
                    </div>
                  </SheetClose>
                  <div className="flex flex-col space-y-5 mt-5">
                    {loadingAccessButton ? (
                      <div className="w-full flex h-12">
                        <Skeleton className="w-full h-12 rounded-full" />
                      </div>
                    ) : dashButton === "admin" ? (
                      <Link
                        href={`/${locale}/studio`}
                        className="group flex w-full"
                        data-cursor-clickable
                      >
                        <Button
                          className="flex w-full rounded-full"
                          size={"lg"}
                        >
                          <h6 className="font-bold">Studio</h6>
                        </Button>
                      </Link>
                    ) : dashButton === "user" ? (
                      <Link
                        href={`/${locale}/dashboard`}
                        className="group flex w-full"
                        data-cursor-clickable
                      >
                        <Button
                          className="flex w-full rounded-full"
                          size={"lg"}
                        >
                          <h6 className="font-bold">Dashboard</h6>
                        </Button>
                      </Link>
                    ) : (
                      <Link
                        href={`/${locale}/sign-in`}
                        className="group flex w-full"
                        data-cursor-clickable
                      >
                        <Button
                          className="flex w-full rounded-full"
                          size={"lg"}
                        >
                          <h6 className="font-bold">
                            {locale === routing.defaultLocale
                              ? "Masuk"
                              : "Sign In"}
                          </h6>
                        </Button>
                      </Link>
                    )}
                    <div className="bg-gray-50 rounded-4xl border border-primary/10 p-4 mt-5">
                      <h5 className="text-primary font-bold mb-2">
                        {locale === routing.defaultLocale
                          ? "Preferensi"
                          : "Preferences"}
                      </h5>
                      <div className="z-9999">
                        <LanguageSwitcher />
                      </div>
                    </div>
                    {NavigationLinks.map((link, i) => (
                      <Link
                        key={link.path}
                        href={`/${locale}/${link.path}`}
                        className={cn(
                          "group transition-all duration-300",
                          i === 0 && "mt-5",
                        )}
                        data-cursor-clickable
                      >
                        <h5 className="font-bold text-primary">
                          {locale === routing.defaultLocale
                            ? link.label.id
                            : link.label.en}
                        </h5>
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex-row items-center flex-wrap gap-7 xl:flex hidden">
              <Link
                href={`/${locale}/about`}
                className="group"
                data-cursor-clickable
              >
                <p className="text-primary">
                  {locale === routing.defaultLocale
                    ? "Tentang Kami"
                    : "About Us"}
                </p>
              </Link>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      <p className="text-primary">
                        {" "}
                        {locale === routing.defaultLocale
                          ? "Kebugaran & Medis"
                          : "Wellness & Medical"}
                      </p>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="w-sm!">
                      <NavigationMenuLink href={`/${locale}/package`}>
                        <p className="text-primary font-bold">
                          {locale === routing.defaultLocale
                            ? "Program Kebugaran & Medis"
                            : "Wellness & Medical Programs"}
                        </p>
                        <p className="line-clamp-2 text-sm! text-muted-foreground mt-1">
                          {locale === routing.defaultLocale
                            ? "Program kebugaran dan medis yang dirancang untuk meningkatkan kesehatan Anda secara menyeluruh."
                            : "Wellness and medical programs designed to improve your overall health."}
                        </p>
                      </NavigationMenuLink>
                      <NavigationMenuLink href={`/${locale}/wellness`}>
                        <p className="text-primary font-bold">
                          {locale === routing.defaultLocale
                            ? "Paket Kebugaran"
                            : "Wellness Package"}
                        </p>
                        <p className="line-clamp-2 text-sm! text-muted-foreground mt-1">
                          {locale === routing.defaultLocale
                            ? "Paket kebugaran yang dirancang untuk meningkatkan kesehatan fisik dan mental Anda."
                            : "Wellness packages designed to enhance your physical and mental health."}
                        </p>
                      </NavigationMenuLink>
                      <NavigationMenuLink href={`/${locale}/medical`}>
                        <p className="text-primary font-bold">
                          {locale === routing.defaultLocale
                            ? "Paket Medis"
                            : "Medical Packages"}
                        </p>
                        <p className="line-clamp-2 text-sm! text-muted-foreground mt-1">
                          {locale === routing.defaultLocale
                            ? "Paket medis yang dirancang untuk memenuhi kebutuhan kesehatan spesifik Anda."
                            : "Medical packages designed to meet your specific health needs."}
                        </p>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <Link
                href={`/${locale}/equipment`}
                className="group"
                data-cursor-clickable
              >
                <p className="text-primary">
                  {" "}
                  {locale === routing.defaultLocale
                    ? "Alat Kesehatan"
                    : "Medical Products"}
                </p>
              </Link>
              <Link
                href={`/${locale}/article`}
                className="group"
                data-cursor-clickable
              >
                <p className="text-primary">
                  {" "}
                  {locale === routing.defaultLocale ? "Artikel" : "News"}
                </p>
              </Link>
              <Link
                href={`/${locale}/event`}
                className="group"
                data-cursor-clickable
              >
                <p className="text-primary">
                  {" "}
                  {locale === routing.defaultLocale ? "Acara" : "Events"}
                </p>
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="group"
                data-cursor-clickable
              >
                <p className="text-primary">
                  {" "}
                  {locale === routing.defaultLocale ? "Kontak" : "Contact"}
                </p>
              </Link>

              {loadingAccessButton ? (
                <div className="w-24 h-12">
                  <Skeleton className="w-full h-12 rounded-full" />
                </div>
              ) : dashButton === "admin" ? (
                <Link
                  href={`/${locale}/studio`}
                  className="group"
                  data-cursor-clickable
                >
                  <Button
                    className="rounded-full inline-flex items-center font-normal h-12 px-5! pointer-events-auto cursor-pointer"
                    size={"lg"}
                  >
                    <p>Studio</p>
                  </Button>
                </Link>
              ) : dashButton === "user" ? (
                <Link
                  href={`/${locale}/dashboard`}
                  className="group"
                  data-cursor-clickable
                >
                  <Button
                    className="rounded-full inline-flex items-center font-normal h-12 px-5! pointer-events-auto cursor-pointer"
                    size={"lg"}
                  >
                    <p>Dashboard</p>
                  </Button>
                </Link>
              ) : (
                <Link href={`/sign-in`} className="group" data-cursor-clickable>
                  <Button
                    size={"lg"}
                    className="rounded-full inline-flex items-center font-normal h-12 px-5! pointer-events-auto cursor-pointer"
                  >
                    <p>
                      {" "}
                      {locale === routing.defaultLocale ? "Masuk" : "Sign In"}
                    </p>
                    <LogIn />
                  </Button>
                </Link>
              )}

              <div>
                <LanguageSwitcher short className="w-fit h-12! -ml-1" />
              </div>
            </div>
          </div>
        </header>
      </nav>
    </ContainerWrap>
  );
};

export default NavHeader;
