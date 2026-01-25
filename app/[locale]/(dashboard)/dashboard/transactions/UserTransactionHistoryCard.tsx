"use client";

import React from "react";
import { nanoid } from "nanoid";
import Link from "next/link";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import { routing } from "@/i18n/routing";
import SimplePagination from "@/components/utility/simple-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupiah } from "@/helper/rupiah";
import { Check, Loader, X } from "lucide-react";
import { TransactionType } from "@/types/transaction.types";

type UserTransactionHistoryClientProps = {
  history: TransactionType;
  locale: string;
};

const UserTransactionHistoryCard = ({
  history: h,
  locale,
}: UserTransactionHistoryClientProps) => {
  const [loading, setLoading] = React.useState(false);
  const id = nanoid();
  return (
    <div key={id} className="bg-white rounded-2xl border p-4 ">
      <Link
        href={`/${locale}/pay/status?order_id=${h.transaction_id}`}
        target="_blank"
        className="flex flex-col md:flex-row md:justify-between gap-4"
      >
        <div>
          <div className="inline-flex mb-4">
            {h.payment_status === "settlement" ||
            h.payment_status === "capture" ? (
              <p className="text-health bg-green-50 border-green-600 border px-3 py-1 capitalize inline-flex rounded-full text-xs! gap-2 items-center">
                <Check className="size-4" />
                {locale === routing.defaultLocale
                  ? "Pembayaran Berhasil"
                  : "Payment Successful"}
              </p>
            ) : h.payment_status === "pending" ? (
              <p className="text-yellow-600 bg-yellow-50 border-yellow-600 border px-3 py-1 capitalize inline-flex rounded-full text-xs! gap-2 items-center">
                <Loader className="size-4" />
                {locale === routing.defaultLocale
                  ? "Menunggu Pembayaran"
                  : "Waiting for Payment"}
              </p>
            ) : (
              <p className="text-red-600 bg-red-50 border-red-600 border px-3 py-1 capitalize inline-flex rounded-full text-xs! gap-2 items-center">
                <X className="size-4" />
                {locale === routing.defaultLocale
                  ? "Pembayaran Gagal"
                  : "Payment Failed"}
              </p>
            )}
          </div>
          <p className="text-health text-xs!">{h.transaction_id}</p>
          <h6 className="text-primary font-semibold mb-4">
            {h.product_data.name}
          </h6>
          <p className="text-xs! text-muted-foreground">
            {locale === routing.defaultLocale ? "Dibuat pada" : "Created at"}
          </p>
          <p className="text-sm! text-muted-foreground mb-0">
            <LocalDateTime date={h.created_at} />
          </p>
        </div>

        <div className="text-end">
          <p className="text-sm! text-muted-foreground">
            {locale === routing.defaultLocale
              ? "Total Pembayaran"
              : "Total Payment"}
          </p>
          <h6 className="text-primary font-bold">
            {formatRupiah(h.product_data.total)}
          </h6>
        </div>
      </Link>
    </div>
  );
};

export default UserTransactionHistoryCard;
