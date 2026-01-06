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
    "default"
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

  const handleSetPublic = async () => {
    if (sessionData === "") return;
    setLoading(true);
    try {
      const setPublic = await ChangeChatStatus(sessionData, "public");

      console.log({ setPublic });

      if (setPublic.error) {
        toast.warning("Failed to change chat session to Open to Public", {
          description: `${setPublic.error}`,
        });
        setLoading(false);
      } else {
        toast.success(
          "This chat can now be viewed and modified by the public.",
          {
            description:
              "Please share with caution. You can also set this chat back to private.",
          }
        );
        setLoading(false);
        setInitialStatus("public");
        setOpenPublic(true);
        setShareLink(setPublic.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to change chat session to Open to Public", {
        description: `${error}`,
      });
      setLoading(false);
    }
  };

  const handleSetPrivate = async () => {
    if (sessionData === "") return;
    setLoading(true);
    try {
      const setPrivate = await ChangeChatStatus(sessionData, "private");

      console.log({ setPrivate });

      if (setPrivate.error) {
        toast.warning("Failed to set up private chat session.", {
          description: `${setPrivate.error}`,
        });
        setLoading(false);
      } else {
        toast.success("This chat is now visible only to you.");
        setOpenPublic(false);
        setInitialStatus("private");
        setLoading(false);
        setShareLink("");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("Failed to set up private chat session.", {
        description: `${error}`,
      });
    }
  };

  const handleCopyName = async () => {
    try {
      await navigator.clipboard.writeText(`${baseUrl}/share/${shareLink}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.warning("Failed to Copy Name", { description: `${err}` });
    }
  };

  useEffect(() => {
    setLoadingAccessButton(true);
    const fetch = async () => {
      setLoadingAccessButton(true);
      const role = await getUserRole();
      if (role === "admin") {
        setDashButton("admin");
        setLoadingAccessButton(false);
      } else if (role === "user") {
        setDashButton("user");
        setLoadingAccessButton(false);
      } else {
        setDashButton("default");
        setLoadingAccessButton(false);
      }
    };

    fetch();
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
            <div className="lg:hidden flex">
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
                  className="p-8 bg-white z-999 lg:max-w-md!"
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

                    {NavigationLinks.map((link, i) => (
                      <Link
                        key={link.path}
                        href={`/${locale}/${link.path}`}
                        className={cn(
                          "group transition-all duration-300",
                          i === 0 && "mt-5"
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

                    <div className="bg-gray-50 rounded-2xl border border-primary/10 p-4 mt-5">
                      <h5 className="text-primary font-bold mb-2">
                        {locale === routing.defaultLocale
                          ? "Preferensi"
                          : "Preferences"}
                      </h5>
                      <div className="z-9999">
                        <LanguageSwitcher />
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex-row items-center flex-wrap gap-7 lg:flex md:hidden hidden">
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
                            ? "Paket Kebugaran & Medis"
                            : "Wellness & Medical Packages"}
                        </p>
                        <p className="line-clamp-2 text-sm! text-muted-foreground mt-1">
                          Lorem ipsum, dolor sit amet consectetur adipisicing
                          elit. Eaque ratione mollitia repudiandae odio.
                        </p>
                      </NavigationMenuLink>
                      <NavigationMenuLink href={`/${locale}/wellness`}>
                        <p className="text-primary font-bold">
                          {locale === routing.defaultLocale
                            ? "Paket Kebugaran"
                            : "Wellness Package"}
                        </p>
                        <p className="line-clamp-2 text-sm! text-muted-foreground mt-1">
                          Lorem, ipsum dolor sit amet consectetur adipisicing
                          elit. Sequi, adipisci?
                        </p>
                      </NavigationMenuLink>
                      <NavigationMenuLink href={`/${locale}/medical`}>
                        <p className="text-primary font-bold">
                          {locale === routing.defaultLocale
                            ? "Paket Medis"
                            : "Medical Packages"}
                        </p>
                        <p className="line-clamp-2 text-sm! text-muted-foreground mt-1">
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Officiis atque unde sint!
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
                    : "Medical Equipment"}
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
                <div className="w-24 h-10">
                  <Skeleton className="w-full h-10 rounded-full" />
                </div>
              ) : dashButton === "admin" ? (
                <Link
                  href={`/${locale}/studio`}
                  className="group"
                  data-cursor-clickable
                >
                  <Button
                    className="rounded-full inline-flex items-center font-normal h-10 px-5! pointer-events-auto cursor-pointer"
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
                    className="rounded-full inline-flex items-center font-normal h-10 px-5! pointer-events-auto cursor-pointer"
                    size={"lg"}
                  >
                    <p>Dashboard</p>
                  </Button>
                </Link>
              ) : (
                <Link href={`/sign-in`} className="group" data-cursor-clickable>
                  <Button
                    size={"lg"}
                    className="rounded-full inline-flex items-center font-normal h-10 px-5! pointer-events-auto cursor-pointer"
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
                <LanguageSwitcher short className="w-fit h-10!" />
              </div>
            </div>
          </div>
        </header>
      </nav>
    </ContainerWrap>
  );
};

export default NavHeader;
