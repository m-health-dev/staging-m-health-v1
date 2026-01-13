"use client";

import React from "react";
import { nanoid } from "nanoid";
import Link from "next/link";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import { routing } from "@/i18n/routing";
import SimplePagination from "@/components/utility/simple-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupiah } from "@/helper/rupiah";

type UserTransactionHistoryClientProps = {
  history: any[];
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
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
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
                <div key={id} className="bg-white rounded-2xl border p-4">
                  <Link
                    href={`/${locale}/pay/status?order_id=${h.transaction_id}`}
                    target="_blank"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <p className="bg-gray-50 text-gray-700 border border-gray-500 px-3 py-1 rounded-full capitalize">
                          {h.payment_status}
                        </p>
                      </div>
                    </div>
                    <p className="text-health text-sm!">{h.transaction_id}</p>
                    <h5 className="text-primary font-semibold mb-4">
                      {h.product_data.name}
                    </h5>

                    <div className="mb-5 border-l-4 border-l-primary bg-blue-50 p-4">
                      <p className="text-sm! text-muted-foreground">
                        {locale === routing.defaultLocale
                          ? "Total Pembayaran"
                          : "Total Payment"}
                      </p>
                      <h6 className="text-primary font-bold">
                        {formatRupiah(h.product_data.total)}
                      </h6>
                    </div>

                    <p className="text-sm! text-muted-foreground">
                      {locale === routing.defaultLocale
                        ? "Dibuat pada"
                        : "Created at"}
                    </p>
                    <p>
                      <LocalDateTime date={h.created_at} />
                    </p>
                  </Link>
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

export default UserTransactionHistoryClient;
