"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import SidebarItemSkeleton from "./SidebarItemSkeleton";

import {
  MessagesSquare,
  Search,
  Trash,
  Trash2,
  X,
  ChevronDown,
} from "lucide-react";
import type { Account } from "@/types/account.types";
import { Button } from "../ui/button";

import { Skeleton } from "../ui/skeleton";
import { Spinner } from "../ui/spinner";
import { usePathname, useRouter } from "next/navigation";
import FailedGetDataNotice from "../utility/FailedGetDataNotice";
import { useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";

import type { MedicalType } from "@/types/medical.types";
import type { WellnessType } from "@/types/wellness.types";
import type { PackageType } from "@/types/packages.types";
import {
  DeleteAllChatSession,
  DeleteChatSession,
} from "@/lib/chatbot/delete-chat-activity";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import path from "node:path";

const Avatar = dynamic(() => import("boring-avatars"), {
  ssr: false,
});

interface ChatbotSidebarProps extends React.ComponentProps<typeof Sidebar> {
  accounts?: Account;
  packages: PackageType[];
  medical: MedicalType[];
  wellness: WellnessType[];
  session?: any[];
  history: any[];
  sessionID?: string;
  publicIDFetch: string | null;
  isLoading: boolean;
  isLoadingMore?: boolean;
  sidebarDataLoading?: boolean; // Loading state for packages/medical/wellness
  locale: string;
  onRefreshHistory?: () => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  displayedCount?: number;
  total?: number;
  labels?: any;
  defaultOpen?: boolean;
}

export function ChatbotSidebar({
  accounts,
  packages,
  medical,
  wellness,
  session,
  history,
  sessionID,
  publicIDFetch,
  isLoading,
  isLoadingMore = false,
  sidebarDataLoading = false,
  locale,
  onRefreshHistory,
  hasMore,
  onLoadMore,
  displayedCount,
  total,
  labels,
  defaultOpen = true,
  ...props
}: ChatbotSidebarProps) {
  const router = useRouter();
  const [loadingDelete, setLoadDelete] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [isLoadingNewChat, setIsLoadingNewChat] = React.useState(false);
  const [createNewChat, setCreateNewChat] = React.useState(false);
  const pathname = usePathname();
  
  // Ref for infinite scroll sentinel
  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  // Infinite scroll observer
  React.useEffect(() => {
    if (!hasMore || !onLoadMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const sentinel = loadMoreRef.current;
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [hasMore, onLoadMore, isLoadingMore]);

  // React.useEffect(() => {
  //   if (pathname === `/${locale}` || pathname === `/${locale}/`) {
  //     setCreateNewChat(false);
  //   }
  // }, [pathname]);

  const handleDeleteChatSession = async (sessionID: string) => {
    setLoadDelete(true);
    try {
      const res = await DeleteChatSession(sessionID);

      if (res.success) {
        toast.success("Successfully Deleted Chat Session!");
        if (pathname.includes(sessionID)) {
          router.push("/");
        } else {
          router.refresh();
        }
        setLoadDelete(false);
      } else {
        toast.error("Failed to Delete Chat Session", {
          description: res.error,
        });
        setLoadDelete(false);
      }
    } catch (error) {
      console.error(error);
      setLoadDelete(false);
    }
  };

  const handleDeleteAllChatSession = async (userID: string) => {
    setLoadDelete(true);
    try {
      const res = await DeleteAllChatSession(userID);

      if (res.success) {
        toast.success("Successfully Deleted All Chat Session!");
        setLoadDelete(false);
        setDialogOpen(false);
        router.replace("/");
        router.refresh();
      } else {
        toast.error("Failed to Delete All Chat Session", {
          description: res.error,
        });
        setLoadDelete(false);
        setDialogOpen(true);
      }
    } catch (error) {
      console.error(error);
      setLoadDelete(false);
      setDialogOpen(false);
    }
  };

  const handleCreateNewChat = async () => {
    setIsLoadingNewChat(true);

    try {
      // kasih delay sebelum redirect
      setTimeout(() => {
        window.location.replace(`/${locale}`);
      }, 300);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  return (
    <Sidebar className="p-0!" collapsible="offcanvas" {...props}>
      <SidebarHeader className="-mb-5 p-3! bg-white">
        <Image
          src={
            "https://irtyvkfjzojdkmtnstmd.supabase.co/storage/v1/object/public/m-health-public/logo/icon_mhealth_logo.PNG"
          }
          width={100}
          height={100}
          priority
          alt="icon-m-health"
          className="object-contain w-8 h-8 mx-2 my-3"
        />
        <SidebarMenu className="space-y-0.5">
          <SidebarMenuItem className="px-0 cursor-pointer">
            <Link href={`/${locale}/search`}>
              <button
                className="flex gap-3 w-full rounded-full items-center text-primary hover:bg-muted py-2 hover:outline px-3 cursor-pointer"
                type="button"
              >
                <Search className="size-5" />
                <p>{locale === routing.defaultLocale ? "Cari" : "Search"}</p>
              </button>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem className="px-0 cursor-pointer">
            <button
              className={cn(
                "flex gap-3 w-full rounded-full items-center text-primary hover:bg-muted py-2 hover:outline px-3 cursor-pointer",
                isLoading && "opacity-50 pointer-events-none",
              )}
              type="button"
              disabled={isLoading}
              onClick={() => handleCreateNewChat()}
            >
              {isLoadingNewChat ? (
                <Spinner />
              ) : (
                <MessagesSquare className="size-5" />
              )}

              <p>
                {locale === routing.defaultLocale
                  ? "Percakapan Baru"
                  : "New Chat"}
              </p>
            </button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="hide-scroll mt-5 bg-white!">
        <div className="px-4">
          <p className="font-extrabold text-primary mb-3 px-2">
            {locale === routing.defaultLocale ? "Program" : "Programs"}
          </p>
          <div className="space-y-5">
            {packages.map((img, i) => (
              <Link
                key={img.id}
                href={`/package/${img.slug}`}
                className="group/pack"
              >
                <div
                  className={`grid grid-cols-3 items-center group-hover/pack:bg-muted group-hover/pack:shadow-sm transition-all duration-300 rounded-xl py-2 group-hover/pack:outline ${
                    i + 1 === packages.length ? "mb-0" : "mb-4"
                  }`}
                >
                  <div className="px-2 col-span-1">
                    <React.Suspense fallback={<Spinner />}>
                      <Image
                        src={img.highlight_image || "/placeholder.svg"}
                        alt={img.slug}
                        width={200}
                        height={200}
                        loading="lazy"
                        className="aspect-square object-cover object-center rounded-xl"
                      />
                    </React.Suspense>
                  </div>
                  <div className="col-span-2 pr-3">
                    <div className="">
                      <p className="font-extrabold text-primary line-clamp-2 ">
                        {locale === routing.defaultLocale
                          ? img.id_title
                          : img.en_title}
                      </p>
                    </div>
                    <div className="mt-1">
                      <p className="text-sm! text-muted-foreground line-clamp-1">
                        {locale === routing.defaultLocale
                          ? img.id_tagline
                          : img.en_tagline}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {sidebarDataLoading && <SidebarItemSkeleton count={3} />}
            {!sidebarDataLoading && packages.length === 0 && (
              <FailedGetDataNotice size="sm" />
            )}
          </div>
        </div>

        <hr className="my-2 mx-4" />

        <div className="px-4">
          <p className="font-extrabold text-primary mb-3 px-2">
            {locale === routing.defaultLocale ? "Kebugaran" : "Wellness"}
          </p>
          <div className="space-y-5">
            {wellness.map((img, i) => (
              <Link
                key={img.id}
                href={`/wellness/${img.slug}`}
                className="group/pack"
              >
                <div
                  className={`grid grid-cols-3 items-center group-hover/pack:bg-muted group-hover/pack:shadow-sm transition-all duration-300 rounded-xl py-2 group-hover/pack:outline ${
                    i + 1 === wellness.length ? "mb-0" : "mb-4"
                  }`}
                >
                  <div className="px-2 col-span-1">
                    <React.Suspense fallback={<Spinner />}>
                      <Image
                        src={img.highlight_image || "/placeholder.svg"}
                        alt={img.slug}
                        width={200}
                        height={200}
                        loading="lazy"
                        className="aspect-square object-cover object-center rounded-xl"
                      />
                    </React.Suspense>
                  </div>
                  <div className="col-span-2 pr-3">
                    <div className="">
                      <p className="font-extrabold text-primary line-clamp-2 ">
                        {locale === routing.defaultLocale
                          ? img.id_title
                          : img.en_title}
                      </p>
                    </div>
                    <div className="mt-1">
                      <p className="text-sm! text-muted-foreground line-clamp-1">
                        {locale === routing.defaultLocale
                          ? img.id_tagline
                          : img.en_tagline}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {sidebarDataLoading && <SidebarItemSkeleton count={3} />}
            {!sidebarDataLoading && wellness.length === 0 && (
              <FailedGetDataNotice size="sm" />
            )}
          </div>
        </div>

        <hr className="my-2 mx-4" />

        <div className="px-4">
          <p className="font-extrabold text-primary mb-3 px-2">
            {locale === routing.defaultLocale ? "Medis" : "Medical"}
          </p>
          <div className="space-y-5">
            {medical.map((img, i) => (
              <Link
                key={img.id}
                href={`/medical/${img.slug}`}
                className="group/pack"
              >
                <div
                  className={`grid grid-cols-3 items-center group-hover/pack:bg-muted group-hover/pack:shadow-sm transition-all duration-300 rounded-xl py-2 group-hover/pack:outline ${
                    i + 1 === medical.length ? "mb-0" : "mb-4"
                  }`}
                >
                  <div className="px-2 col-span-1">
                    <React.Suspense fallback={<Spinner />}>
                      <Image
                        src={img.highlight_image || "/placeholder.svg"}
                        alt={img.slug}
                        width={200}
                        height={200}
                        loading="lazy"
                        className="aspect-square object-cover object-center rounded-xl"
                      />
                    </React.Suspense>
                  </div>
                  <div className="col-span-2 pr-3">
                    <div className="">
                      <p className="font-extrabold text-primary line-clamp-2 ">
                        {locale === routing.defaultLocale
                          ? img.id_title
                          : img.en_title}
                      </p>
                    </div>
                    <div className="mt-1">
                      <p className="text-sm! text-muted-foreground line-clamp-1">
                        {locale === routing.defaultLocale
                          ? img.id_tagline
                          : img.en_tagline}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {sidebarDataLoading && <SidebarItemSkeleton count={3} />}
            {!sidebarDataLoading && medical.length === 0 && (
              <FailedGetDataNotice size="sm" />
            )}
          </div>
        </div>

        <hr className="my-2 mx-4" />
        {history && history.length >= 1 && (
          <>
            <div className="px-4">
              <p className="text-muted-foreground text-sm! px-2">
                {locale === routing.defaultLocale
                  ? "Riwayat Percakapan"
                  : "Chat History"}
              </p>
              <div className="space-y-5 pt-3">
                <div className="space-y-2">
                  {/* Initial loading skeleton - only show on first load when no history */}
                  {isLoading && history.length === 0 ? (
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="w-full h-12" />
                      ))}
                    </div>
                  ) : (
                    <>
                      {history.map((s) => (
                        <div
                          key={s.id}
                          className="w-full text-left group/hst cursor-pointer relative p-2 hover:bg-muted hover:shadow-sm rounded-2xl hover:outline"
                        >
                          <Link href={`/${locale}/c/${s.id}`}>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-primary text-base! line-clamp-1 wrap-break-word z-5 capitalize">
                                  {s.title === ""
                                    ? "M HEALTH Chat"
                                    : s.title}
                                </p>
                              </div>
                            </div>
                          </Link>
                          <Button
                            variant={"destructive_outline"}
                            className="w-6 h-6 rounded-full group-hover/hst:translate-x-0 group-hover/hst:opacity-100 translate-x-5 opacity-0 overflow-hidden transition-all duration-300 ease-in-out absolute right-2 top-2"
                            onClick={() => handleDeleteChatSession(s.id)}
                          >
                            {loadingDelete ? (
                              <Spinner />
                            ) : (
                              <Trash className="size-3" />
                            )}
                          </Button>
                        </div>
                      ))}

                      {/* Infinite scroll sentinel */}
                      {hasMore && (
                        <div
                          ref={loadMoreRef}
                          className="flex justify-center py-3"
                        >
                          {isLoadingMore && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Spinner className="size-4" />
                              <p className="text-sm!">
                                {locale === routing.defaultLocale
                                  ? "Memuat..."
                                  : "Loading..."}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {!hasMore && history.length > 0 && (
                        <div className="px-3 bg-muted py-2 rounded-2xl text-center">
                          <p className="text-muted-foreground text-sm!">
                            {locale === routing.defaultLocale
                              ? "Anda telah melihat semuanya"
                              : "You have seen everything"}
                          </p>
                        </div>
                      )}

                      {history.length >= 1 && accounts?.id && (
                        <Dialog open={dialogOpen}>
                          <DialogTrigger
                            asChild
                            onClick={() => setDialogOpen(true)}
                          >
                            <button className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 hover:outline hover:outline-red-500 inline-flex py-2 gap-1 items-center transition cursor-pointer rounded-2xl px-2.5">
                              <Trash2 className="size-3" />{" "}
                              <p className="text-xs!">
                                {locale === routing.defaultLocale
                                  ? "Hapus Riwayat Percakapan"
                                  : "Clear Chat History"}
                              </p>
                            </button>
                          </DialogTrigger>
                          <DialogContent className="bg-white z-999 rounded-2xl">
                            <DialogHeader>
                              <DialogTitle asChild>
                                <h6 className="text-red-600">
                                  {locale === routing.defaultLocale
                                    ? "Apakah kamu yakin untuk menghapus seluruh sesi percakapan?"
                                    : "Are you sure to delete all chat session?"}
                                </h6>
                              </DialogTitle>
                              <DialogDescription asChild className="mt-3">
                                <p>
                                  {locale === routing.defaultLocale
                                    ? "Aksi ini tidak dapat dibatalkan. Aksi ini akan menghapus sesi percakapan anda dari basis data kami. Lakukan dengan hati-hati."
                                    : "This action cannot be undone. This will permanently delete all of your chat and remove your data from our servers. Do it carefully."}
                                </p>
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogClose
                                asChild
                                onClick={() => setDialogOpen(false)}
                              >
                                <Button variant={"outline"}>
                                  <X className="size-4" />
                                  {labels.cancel}
                                </Button>
                              </DialogClose>

                              <Button
                                variant={"destructive"}
                                onClick={() => {
                                  handleDeleteAllChatSession(accounts?.id);
                                }}
                              >
                                {loadingDelete ? (
                                  <Spinner />
                                ) : (
                                  <>
                                    <Trash className="size-4" />
                                    {labels.delete}
                                  </>
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <hr className="my-2 mx-4" />
          </>
        )}
      </SidebarContent>
      <SidebarFooter className="bg-white">
        <div className="sticky bottom-0 py-2 bg-linear-to-t from-white via-white px-1">
          {accounts ? (
            <NavUser user={accounts} locale={locale} type="side" />
          ) : publicIDFetch ? (
            <div className="flex items-center gap-3 px-4">
              <Avatar
                name={publicIDFetch}
                className="w-9! h-9!"
                colors={["#3e77ab", "#22b26e", "#f2f26f", "#fff7bd", "#95cfb7"]}
                variant="beam"
                size={16}
              />
              <p className="text-xs! text-muted-foreground text-start">
                <span>
                  {locale === routing.defaultLocale
                    ? "ID Akses Publik"
                    : "Public Access ID"}
                </span>{" "}
                <br />{" "}
                <span className="text-primary uppercase">
                  {publicIDFetch.slice(0, 8)}
                </span>
              </p>
            </div>
          ) : (
            <div>
              <Skeleton className="w-full h-12" />
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
