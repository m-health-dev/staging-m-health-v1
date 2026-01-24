"use client";

import React from "react";
import { nanoid } from "nanoid";
import Link from "next/link";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import { routing } from "@/i18n/routing";
import SimplePagination from "@/components/utility/simple-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Lock, Trash, Trash2, Unlock, X } from "lucide-react";
import {
  DeleteAllChatSession,
  DeleteChatSession,
} from "@/lib/chatbot/delete-chat-activity";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Account } from "@/types/account.types";

type ChatActivityClientProps = {
  history: any[];
  links: any;
  meta: any;
  locale: string;
  perPage: number;
  account: Account;
};

const ChatActivityClient = ({
  history,
  links,
  meta,
  locale,
  perPage,
  account,
}: ChatActivityClientProps) => {
  const [loading, setLoading] = React.useState(false);
  const [loadDelete, setLoadDelete] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("utility");
  const [dialogOpen, setDialogOpen] = React.useState(false);

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
  return (
    <div className="mb-[20vh]">
      <div className="flex flex-col gap-5">
        {history.length >= 1 && (
          <Dialog open={dialogOpen}>
            <DialogTrigger asChild onClick={() => setDialogOpen(true)}>
              <Button
                variant={"destructive_outline"}
                className="rounded-full w-fit"
              >
                <Trash2 className="size-3" />{" "}
                <p className="text-xs!">
                  {locale === routing.defaultLocale
                    ? "Hapus Semua Riwayat Percakapan"
                    : "Clear All Chat History"}
                </p>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white z-999 rounded-2xl">
              <DialogHeader>
                <DialogTitle asChild>
                  <h5 className="text-red-600">
                    {locale === routing.defaultLocale
                      ? "Apakah kamu yakin untuk menghapus seluruh sesi percakapan?"
                      : "Are you sure to delete all chat session?"}
                  </h5>
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
                <DialogClose asChild onClick={() => setDialogOpen(false)}>
                  <Button variant={"outline"}>
                    <X className="size-4" />
                    {t("cancel")}
                  </Button>
                </DialogClose>

                <Button
                  variant={"destructive"}
                  onClick={() => {
                    handleDeleteAllChatSession(account?.id);
                  }}
                >
                  {loadDelete ? (
                    <Spinner />
                  ) : (
                    <>
                      <Trash className="size-4" />
                      {t("delete")}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        {loading
          ? Array.from({ length: perPage }).map(() => {
              const id = nanoid();
              return (
                <Skeleton key={id} className="rounded-2xl border p-4 h-32" />
              );
            })
          : history.map((h, i) => {
              const id = nanoid();
              return (
                <div
                  key={id}
                  className="bg-white rounded-2xl border p-4 relative"
                >
                  <Link href={`/${locale}/c/${h.id}`} target="_blank">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {h.urgent && (
                          <p className="capitalize bg-red-50 border border-red-600 text-red-600 inline-flex px-2 py-1 rounded-full text-xs!">
                            {locale === routing.defaultLocale
                              ? "Darurat"
                              : "Urgent"}
                          </p>
                        )}
                        {h.status === "public" ? (
                          <p className="capitalize bg-blue-50 border border-blue-600 text-blue-600 inline-flex px-2 py-1 rounded-full text-xs! items-center gap-1">
                            <Eye className="size-3" />
                            {locale === routing.defaultLocale
                              ? "Publik"
                              : "Public"}
                          </p>
                        ) : (
                          <p className="capitalize bg-amber-50 border border-amber-600 text-amber-600 inline-flex px-2 py-1 rounded-full text-xs! items-center gap-1">
                            <Lock className="size-3" />{" "}
                            {locale === routing.defaultLocale
                              ? "Pribadi"
                              : "Private"}
                          </p>
                        )}
                      </div>
                    </div>
                    <h5 className="text-primary font-semibold  capitalize">
                      {h.title}
                    </h5>
                    <p className="text-sm! text-muted-foreground">
                      <LocalDateTime date={h.created_at} />
                    </p>
                  </Link>
                  <Button
                    variant={"destructive_outline"}
                    className="w-8 h-8 rounded-full absolute right-2 top-2"
                    onClick={() => handleDeleteChatSession(h.id)}
                  >
                    {loadDelete ? <Spinner /> : <Trash className="size-3" />}
                  </Button>
                </div>
              );
            })}
      </div>

      <SimplePagination
        links={links}
        meta={meta}
        show={[10, 25, 50]}
        defaultPerPage={10}
        onLoadingChange={setLoading}
      />
    </div>
  );
};

export default ChatActivityClient;
