"use client";

import { routing } from "@/i18n/routing";
import { ConsultScheduleType } from "@/types/consult.types";
import { TransactionType } from "@/types/transaction.types";
import React, { useEffect, useRef, useState } from "react";
import ConsultScheduleHistoryCard from "../dashboard/consult/schedule/ConsultScheduleHistoryCard";
import { nanoid } from "nanoid";
import UserTransactionHistoryCard from "../dashboard/transactions/UserTransactionHistoryCard";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { ChatHistory } from "@/types/chat.types";
import ChatActivityCard from "../dashboard/chat-activity/ChatActivityCard";

type StudioComponentProps = {
  initialDataConsult: ConsultScheduleType[];
  initialDataTransaction: TransactionType[];
  initialChatData: ChatHistory[];
  locale: string;
};

const StudioComponent = ({
  initialDataConsult,
  initialDataTransaction,
  initialChatData,
  locale,
}: StudioComponentProps) => {
  const [live, setLive] = useState(false);
  const [dataConsult, setDataConsult] =
    useState<ConsultScheduleType[]>(initialDataConsult);
  const [dataTransaction, setDataTransaction] = useState<TransactionType[]>(
    initialDataTransaction,
  );
  const [dataChat, setDataChat] = useState<ChatHistory[]>(initialChatData);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (live) {
      intervalRef.current = setInterval(async () => {
        try {
          setLoading(true);
          const resConsult = await fetch(
            `/api/live/consultation?page=1&per_page=3`,
          );
          const resTransaction = await fetch(
            `/api/live/transaction?page=1&per_page=3`,
          );
          const resChat = await fetch(
            `/api/live/chat-activity?page=1&per_page=3`,
          );
          if (!resConsult.ok || !resTransaction.ok || !resChat.ok) {
            throw new Error("Failed to fetch live data");
          }
          if (resConsult.ok && resTransaction.ok && resChat.ok) {
            const json = await resConsult.json();
            const jsonTrans = await resTransaction.json();
            const jsonChat = await resChat.json();
            setDataTransaction(jsonTrans.data ?? []);
            setDataConsult(json.data ?? []);
            setDataChat(jsonChat.data ?? []);
            setLoading(false);
          }
        } catch (e) {
          throw new Error("Catch Error:Failed to fetch live data");
        }
      }, 5000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [live]);
  return (
    <div className="mt-10">
      <div>
        <h4 className="text-primary font-semibold">
          {locale === routing.defaultLocale
            ? "Live Area"
            : "Area Otomatis Pembaruan"}
        </h4>
        <div className="flex items-center gap-2 mt-2">
          <Switch checked={live} onCheckedChange={setLive} id="live-switch" />
          <label
            htmlFor="live-switch"
            className={cn(
              "text-sm font-sans inline-flex items-center gap-1",
              loading && "animate-pulse",
            )}
          >
            Live Updates {loading && <Spinner className="size-4" />}
          </label>
        </div>
      </div>

      <div className="mb-10 mt-5 grid 3xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-5">
        <div className="bg-white rounded-2xl p-4 h-auto">
          <h4 className="font-semibold text-primary mt-2 mb-6">
            {locale === routing.defaultLocale
              ? "Riwayat Percakapan Terbaru"
              : "Recent Conversation History"}
          </h4>
          <div className="flex flex-col gap-5 w-full">
            {dataChat.length === 0 && (
              <p className="text-start text-muted-foreground py-10">
                {locale === routing.defaultLocale
                  ? "Tidak ada riwayat percakapan."
                  : "No conversation history."}
              </p>
            )}
            {dataChat.map((h) => {
              const id = nanoid();
              return (
                <ChatActivityCard
                  key={id}
                  history={h}
                  locale={locale}
                  adminView
                />
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 h-auto">
          <h4 className="font-semibold text-primary mt-2 mb-6">
            {locale === routing.defaultLocale
              ? "Riwayat Konsultasi Terbaru"
              : "Recent Consultation History"}
          </h4>
          <div className="flex flex-col gap-5 w-full">
            {dataConsult.length === 0 && (
              <p className="text-start text-muted-foreground py-10">
                {locale === routing.defaultLocale
                  ? "Tidak ada riwayat konsultasi."
                  : "No consultation history."}
              </p>
            )}
            {dataConsult.map((h) => {
              const id = nanoid();
              return (
                <ConsultScheduleHistoryCard
                  key={id}
                  consult={h}
                  locale={locale}
                  adminView
                />
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 h-auto">
          <h4 className="font-semibold text-primary mt-2 mb-6">
            {locale === routing.defaultLocale
              ? "Riwayat Transaksi Terbaru"
              : "Recent Transaction History"}
          </h4>
          <div className="flex flex-col gap-5 w-full">
            {dataTransaction.length === 0 && (
              <p className="text-start text-muted-foreground py-10">
                {locale === routing.defaultLocale
                  ? "Tidak ada riwayat transaksi."
                  : "No transaction history."}
              </p>
            )}
            {dataTransaction.map((h) => {
              const id = nanoid();
              return (
                <UserTransactionHistoryCard
                  key={id}
                  history={h}
                  locale={locale}
                  adminView
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioComponent;
