"use client";

import React from "react";
import { nanoid } from "nanoid";
import Link from "next/link";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import { routing } from "@/i18n/routing";
import SimplePagination from "@/components/utility/simple-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupiah } from "@/helper/rupiah";
import { Check, Loader, User, X } from "lucide-react";
import { TransactionType } from "@/types/transaction.types";
import UserTransactionHistoryCard from "./UserTransactionHistoryCard";

type UserTransactionHistoryClientProps = {
  history: TransactionType[];
  links: any;
  meta: any;
  locale: string;
  perPage: number;
};

const UserTransactionHistoryClient = ({
  history,
  links,
  meta,
  locale,
  perPage,
}: UserTransactionHistoryClientProps) => {
  const [loading, setLoading] = React.useState(false);
  return (
    <div className="mb-[20vh]">
      <div className="flex flex-col divide-y-2 gap-2">
        {history.length === 0 && !loading && (
          <p className="text-start text-muted-foreground py-10">
            {locale === routing.defaultLocale
              ? "Tidak ada riwayat transaksi."
              : "No transaction history."}
          </p>
        )}
        {loading
          ? Array.from({ length: perPage }).map(() => {
              const id = nanoid();
              return (
                <Skeleton key={id} className="rounded-2xl border p-4 h-60" />
              );
            })
          : history.map((h, i) => {
              const id = nanoid();
              return (
                <UserTransactionHistoryCard
                  key={id}
                  history={h}
                  locale={locale}
                />
              );
            })}
      </div>

      {history.length === 0 && !loading && (
        <SimplePagination
          links={links}
          meta={meta}
          show={[10, 25, 50]}
          defaultPerPage={10}
          onLoadingChange={setLoading}
        />
      )}
    </div>
  );
};

export default UserTransactionHistoryClient;
