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
  Menu,
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
import { SidebarTrigger } from "@/components/ui/sidebar";
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
import { getUserRole } from "@/app/[locale]/(auth)/actions/auth.actions";
import { Skeleton } from "@/components/ui/skeleton";

const ChatNavHeader = ({
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

  const [initialStatus, setInitialStatus] = useState(status);

  const [dashButton, setDashButton] = useState<"admin" | "user" | "default">(
    "default"
  );

  const [loadingAccessButton, setLoadingAccessButton] = useState(true);

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
    <nav className="sticky top-0 px-5 bg-linear-to-b from-background to-transparent via-background via-80% z-99">
      <header className="py-5 flex items-center w-full justify-between gap-5">
        {pathCheck && <SidebarTrigger className="-ml-1" />}

        <Link href={`/${locale}/home`} className="flex justify-start w-full">
          <Image
            src={
              "https://hoocfkzapbmnldwmedrq.supabase.co/storage/v1/object/public/m-health-public/static/mhealth_logo.PNG"
            }
            unoptimized
            width={150}
            height={40}
            className="object-contain lg:flex hidden"
            alt="M-Health Logo"
          />
          <Image
            src={
              "https://hoocfkzapbmnldwmedrq.supabase.co/storage/v1/object/public/m-health-public/static/mhealth_logo_crop.PNG"
            }
            unoptimized
            width={40}
            height={40}
            className="object-contain lg:hidden flex"
            alt="M-Health Logo"
          />
        </Link>
        <div className="flex items-center gap-5">
          {type !== "share" && path.startsWith(`/${locale}/c`) && (
            <Dialog>
              <DialogTrigger asChild>
                <button className="hover:bg-primary py-2 px-4 rounded-full hover:text-background flex justify-center items-center w-full gap-3 text-muted-foreground">
                  <Share2 className="-ml-0.5 size-4" />
                  <p className="text-sm! md:block hidden">
                    {locale === routing.defaultLocale ? "Bagikan" : "Share"}
                  </p>
                </button>
              </DialogTrigger>
              <DialogContent className="bg-white flex flex-col items-start rounded-2xl">
                <DialogHeader>
                  <DialogTitle>
                    <div className="flex w-full items-center gap-3 text-muted-foreground">
                      <Share2 className="-ml-0.5 size-5" />
                      <p>
                        {locale === routing.defaultLocale ? "Bagikan" : "Share"}
                      </p>
                    </div>
                  </DialogTitle>
                  <DialogDescription asChild>
                    <div>
                      {initialStatus === "public" && (
                        <div>
                          <p className="mb-1 font-medium text-primary">
                            {locale === routing.defaultLocale
                              ? "Obrolan ini sekarang dapat dilihat oleh publik."
                              : "This chat can now be viewed by the public."}
                          </p>
                          <p className="text-sm! text-muted-foreground">
                            {locale === routing.defaultLocale
                              ? "Harap bagikan dengan hati-hati. Anda juga dapat mengatur obrolan ini kembali menjadi pribadi."
                              : "Please share with caution. You can also set this chat back to private."}
                          </p>
                          <div className="flex items-center gap-2 w-full mt-4">
                            <div className="p-4 bg-accent rounded-2xl flex w-full">
                              <p className="text-sm! text-wrap w-full">{`https://staging.m-health.id/share/${shareLink}`}</p>
                            </div>
                            <button
                              onClick={() => handleCopyName()}
                              className="bg-accent p-4 rounded-2xl"
                            >
                              {copied ? <Check /> : <Copy />}
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="flex w-full justify-end">
                        {initialStatus === "private" ? (
                          <div className="mt-0">
                            <p className="mb-2 text-primary">
                              {locale === routing.defaultLocale
                                ? "Obrolan ini sekarang hanya dapat dilihat oleh Anda."
                                : "This chat is now visible only to you."}
                            </p>
                            <p className="text-sm! text-muted-foreground mb-4">
                              {locale === routing.defaultLocale
                                ? "Untuk mengizinkan publik melihat obrolan ini, silahkan klik tombol dibawah ini untuk merubah obrolan menjadi dapat dilihat oleh publik."
                                : "To allow the public to view this chat, please click the button below to change the chat visibility."}
                            </p>
                            <Button onClick={() => handleSetPublic()}>
                              {loading ? (
                                <>
                                  <Spinner />
                                  <p>Loading</p>
                                </>
                              ) : (
                                <>
                                  <Eye />
                                  <p>
                                    {locale === routing.defaultLocale
                                      ? "Bagikan"
                                      : "Set to Public Chat"}
                                  </p>
                                </>
                              )}
                            </Button>
                          </div>
                        ) : (
                          <div className="mt-5">
                            <Button
                              variant={"outline"}
                              onClick={() => handleSetPrivate()}
                            >
                              {loading ? (
                                <>
                                  <Spinner />
                                  <p>Loading</p>
                                </>
                              ) : (
                                <>
                                  <EyeOff />
                                  <p>
                                    {locale === routing.defaultLocale
                                      ? "Kembalikan ke Obrolan Pribadi"
                                      : "Set to Private Chat"}
                                  </p>
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
          <div>
            <Sheet>
              <SheetTrigger className="text-primary mt-0.5">
                {" "}
                <Menu />
              </SheetTrigger>
              <SheetContent
                side="right"
                className="p-8 bg-white z-999 overflow-y-scroll hide-scroll lg:max-w-md!"
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
                <div className="flex flex-col space-y-3 mt-5">
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
                      <Button className="flex w-full rounded-full" size={"lg"}>
                        <h6 className="font-bold">Studio</h6>
                      </Button>
                    </Link>
                  ) : dashButton === "user" ? (
                    <Link
                      href={`/${locale}/dashboard`}
                      className="group flex w-full"
                      data-cursor-clickable
                    >
                      <Button className="flex w-full rounded-full" size={"lg"}>
                        <h6 className="font-bold">Dashboard</h6>
                      </Button>
                    </Link>
                  ) : (
                    <Link
                      href={`/${locale}/sign-in`}
                      className="group flex w-full"
                      data-cursor-clickable
                    >
                      <Button className="flex w-full rounded-full" size={"lg"}>
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

                  <div className="bg-gray-50 rounded-2xl border border-primary/10 mt-5 p-4">
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
        </div>
      </header>
    </nav>
  );
};

export default ChatNavHeader;
