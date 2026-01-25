"use client";

import React from "react";
import { nanoid } from "nanoid";
import Link from "next/link";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import { routing } from "@/i18n/routing";
import SimplePagination from "@/components/utility/simple-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupiah } from "@/helper/rupiah";
import { ConsultScheduleType } from "@/types/consult.types";
import { Check, Loader, Stethoscope, X } from "lucide-react";
import ConsultScheduleHistoryCard from "./ConsultScheduleHistoryCard";

type ConsultScheduleHistoryClientProps = {
  consult: ConsultScheduleType[];
  links: any;
  meta: any;
  locale: string;
  perPage: number;
};

const ConsultScheduleHistoryClient = ({
  consult: c,
  links,
  meta,
  locale,
  perPage,
}: ConsultScheduleHistoryClientProps) => {
  const [loading, setLoading] = React.useState(false);
  return (
    <div className="mb-[20vh]">
      <div className="grid lg:grid-cols-1 grid-cols-1 gap-4">
        {loading
          ? Array.from({ length: perPage }).map(() => {
              const id = nanoid();
              return (
                <Skeleton key={id} className="rounded-2xl border p-4 h-60" />
              );
            })
          : c.map((cons, i) => {
              const id = nanoid();
              return (
                <ConsultScheduleHistoryCard
                  key={id}
                  consult={cons}
                  locale={locale}
                />
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

export default ConsultScheduleHistoryClient;
