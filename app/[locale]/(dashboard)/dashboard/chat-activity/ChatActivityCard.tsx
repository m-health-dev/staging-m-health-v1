"use client";

import React from "react";
import { nanoid } from "nanoid";
import Link from "next/link";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import { routing } from "@/i18n/routing";
import SimplePagination from "@/components/utility/simple-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Eye,
  Lock,
  MessageCircle,
  Trash,
  Trash2,
  Unlock,
  X,
} from "lucide-react";
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
import { ChatHistory } from "@/types/chat.types";

type ChatActivityClientProps = {
  history: any;
  locale: string;
  account: Account;
};

const ChatActivityCard = ({
  history: h,
  locale,
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
    <div key={h.id} className="bg-white rounded-2xl border p-4 relative">
      <Link href={`/${locale}/c/${h.id}`} target="_blank">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {h.urgent && (
              <p className="capitalize bg-red-50 border border-red-600 text-red-600 inline-flex px-2 py-1 rounded-full text-xs!">
                {locale === routing.defaultLocale ? "Darurat" : "Urgent"}
              </p>
            )}
            {h.status === "public" ? (
              <p className="capitalize bg-blue-50 border border-blue-600 text-blue-600 inline-flex px-2 py-1 rounded-full text-xs! items-center gap-1">
                <Eye className="size-3" />
                {locale === routing.defaultLocale ? "Publik" : "Public"}
              </p>
            ) : (
              <p className="capitalize bg-amber-50 border border-amber-600 text-amber-600 inline-flex px-2 py-1 rounded-full text-xs! items-center gap-1">
                <Lock className="size-3" />{" "}
                {locale === routing.defaultLocale ? "Pribadi" : "Private"}
              </p>
            )}
          </div>
        </div>
        <h5 className="text-primary font-semibold  capitalize">{h.title}</h5>
        <p className="text-sm! text-muted-foreground mt-1">
          <LocalDateTime date={h.created_at} />
        </p>
      </Link>
      <div className="mt-4 flex lg:justify-end justify-between gap-4">
        <Link href={`/${locale}/c/${h.id}`}>
          <Button
            variant={"outline"}
            className="w-fit h-10 rounded-full text-primary"
          >
            <span>{locale === routing.defaultLocale ? "Lihat" : "View"}</span>
            <MessageCircle className="size-4" />
          </Button>
        </Link>
        <Button
          variant={"destructive_outline"}
          className="w-fit h-10 rounded-full"
          onClick={() => handleDeleteChatSession(h.id)}
        >
          <span className="lg:block hidden">
            {locale === routing.defaultLocale ? "Hapus" : "Delete"}
          </span>
          {loadDelete ? <Spinner /> : <Trash className="size-4" />}
        </Button>
      </div>
    </div>
  );
};

export default ChatActivityCard;
