"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

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

import {
  BotMessageSquare,
  ClipboardClock,
  MessagesSquare,
  PenSquare,
  Plus,
  ScanBarcode,
  Search,
  Trash,
  Trash2,
} from "lucide-react";
import { IconHelp, IconSettings } from "@tabler/icons-react";
import { Account } from "@/types/account.types";
import { Button } from "../ui/button";

import { Skeleton } from "../ui/skeleton";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";
import FailedGetDataNotice from "../utility/FailedGetDataNotice";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import Avatar from "boring-avatars";
import { MedicalType } from "@/types/medical.types";
import { WellnessType } from "@/types/wellness.types";
import { PackageType } from "@/types/packages.types";
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
  locale: string;
  onRefreshHistory?: () => void; // Add callback for manual refresh
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
  locale,
  onRefreshHistory,
  ...props
}: ChatbotSidebarProps) {
  const router = useRouter();
  const [loadingDelete, setLoadDelete] = React.useState(false);

  const handleDeleteChatSession = async (sessionID: string) => {
    setLoadDelete(true);
    try {
      const res = await DeleteChatSession(sessionID);

      if (res.success) {
        toast.success("Successfully Deleted Chat Session!", {
          description: sessionID.slice(0, 8).toUpperCase(),
        });
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
      } else {
        toast.error("Failed to Delete All Chat Session", {
          description: res.error,
        });
        setLoadDelete(false);
      }
    } catch (error) {
      console.error(error);
      setLoadDelete(false);
    }
  };
  return (
    <Sidebar className="p-0" collapsible="offcanvas" {...props}>
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
            <Link href={`/${locale}?new=true`}>
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
            <Link href={`/${locale}?new=true`}>
              <button
                className="flex gap-3 w-full rounded-full items-center text-primary hover:bg-muted py-2 hover:outline px-3 cursor-pointer"
                type="button"
              >
                <MessagesSquare className="size-5" />
                <p>
                  {locale === routing.defaultLocale
                    ? "Percakapan Baru"
                    : "New Chat"}
                </p>
              </button>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="hide-scroll mt-5 bg-white!">
        <div className="px-4">
          <p className="text-muted-foreground text-sm! px-2">
            {locale === routing.defaultLocale
              ? "Riwayat Percakapan"
              : "Chat History"}
          </p>
          <div className="space-y-5 pt-3">
            <div className="space-y-2">
              {isLoading ? (
                <>
                  <Skeleton className="w-full h-16" />
                  <Skeleton className="w-full h-16" />
                  <Skeleton className="w-full h-16" />
                </>
              ) : (
                <>
                  {history.length > 0 ? (
                    history.map((s) => (
                      <React.Suspense key={s.id} fallback={<Spinner />}>
                        <div
                          key={s.id}
                          className="w-full text-left group/hst cursor-pointer relative p-2 hover:bg-muted hover:shadow-sm rounded-2xl hover:outline"
                        >
                          <div className="flex justify-between items-center">
                            <Link href={`/${locale}/c/${s.id}`}>
                              <div>
                                <p className="text-primary text-base! line-clamp-1 wrap-break-word z-5">
                                  {s.title === "" ? "M HEALTH Chat" : s.title}
                                </p>
                                <p className="text-xs! uppercase text-muted-foreground z-5">
                                  {s.id.slice(0, 8)}
                                </p>
                              </div>
                            </Link>
                            <Button
                              variant={"destructive_outline"}
                              className="w-6 h-6 rounded-full group-hover/hst:translate-x-0 group-hover/hst:opacity-100 translate-x-5 opacity-0 overflow-hidden transition-all duration-300 ease-in-out"
                              onClick={() => handleDeleteChatSession(s.id)}
                            >
                              {loadingDelete ? (
                                <Spinner />
                              ) : (
                                <Trash className="size-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </React.Suspense>
                    ))
                  ) : history.length > 0 ? (
                    <div className="space-y-3">
                      <Skeleton className="w-full h-12" />
                      <Skeleton className="w-full h-12" />
                      <Skeleton className="w-full h-12" />
                    </div>
                  ) : (
                    <div className="px-3 bg-muted py-2 rounded-2xl">
                      <p className="text-muted-foreground text-sm!">
                        {locale === routing.defaultLocale
                          ? "Belum ada riwayat percakapan saat ini."
                          : "No chat history available yet."}
                      </p>
                    </div>
                  )}
                  {history.length >= 1 && accounts?.id && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 hover:outline hover:outline-red-500 flex w-full py-2 gap-1 items-center transition cursor-pointer rounded-2xl px-2">
                          <Trash2 className="size-3" />{" "}
                          <p className="text-xs!">
                            {locale === routing.defaultLocale
                              ? "Hapus Riwayat Percakapan"
                              : "Clear Chat History"}
                          </p>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="bg-white z-999">
                        <DialogHeader>
                          <DialogTitle asChild>
                            <h5 className="text-red-600">
                              Are you sure to Delete All Chat Session?
                            </h5>
                          </DialogTitle>
                          <DialogDescription>
                            <p>
                              This action cannot be undone. This will
                              permanently delete all of your chat and remove
                              your data from our servers.
                            </p>
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose>
                            <Button variant={"outline"}>Cancel</Button>
                          </DialogClose>
                          <DialogClose>
                            <Button
                              variant={"destructive"}
                              onClick={() => {
                                handleDeleteAllChatSession(accounts?.id);
                              }}
                            >
                              Yes
                            </Button>
                          </DialogClose>
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

        <div className="px-4">
          <p className="font-extrabold text-primary mb-3 px-2">
            {locale === routing.defaultLocale ? "Paket" : "Packages"}
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
                        src={img.highlight_image}
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
            {packages.length === 0 && <FailedGetDataNotice size="sm" />}
          </div>
        </div>

        <hr className="my-2 mx-4" />

        <div className="px-4">
          <p className="font-extrabold text-primary mb-3 px-2">
            {locale === routing.defaultLocale ? "Kesehatan" : "Wellness"}
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
                        src={img.highlight_image}
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
            {wellness.length === 0 && <FailedGetDataNotice size="sm" />}
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
                        src={img.highlight_image}
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
            {medical.length === 0 && <FailedGetDataNotice size="sm" />}
          </div>
        </div>
      </SidebarContent>
      <SidebarFooter className="bg-white">
        <div className="sticky bottom-0 py-2 bg-linear-to-t from-white via-white px-1">
          {accounts ? (
            <NavUser user={accounts} type="side" />
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
