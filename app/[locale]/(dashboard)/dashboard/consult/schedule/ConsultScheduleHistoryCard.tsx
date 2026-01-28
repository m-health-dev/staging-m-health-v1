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

type ConsultScheduleHistoryClientProps = {
  consult: ConsultScheduleType;
  locale: string;
  adminView?: boolean;
};

const ConsultScheduleHistoryCard = ({
  consult: cons,
  locale,
  adminView = false,
}: ConsultScheduleHistoryClientProps) => {
  return (
    <div key={cons.id} className="bg-white rounded-2xl border p-4">
      <Link
        href={
          !adminView
            ? `/${locale}/dashboard/consult/${cons.id}`
            : `/${locale}/studio/consult/assign-doctor/${cons.id}`
        }
      >
        <div className="flex flex-wrap gap-2">
          {cons.payment_status === "success" ? (
            <p className="text-health bg-green-50 border-green-600 border px-3 py-1 capitalize inline-flex rounded-full text-xs! gap-2 items-center">
              <Check className="size-4" />
              {locale === routing.defaultLocale
                ? "Pembayaran Berhasil"
                : "Payment Successful"}
            </p>
          ) : cons.payment_status === "waiting" ? (
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

          {cons.doctor_id && (
            <p className="text-sky-600 bg-sky-50 border-sky-600 border px-3 py-1 capitalize inline-flex rounded-full text-xs! gap-2 items-center">
              <Stethoscope className="size-4" />
              {locale === routing.defaultLocale
                ? "Tautan Telekonsultasi Tersedia"
                : "Meeting Link Available"}
            </p>
          )}
        </div>

        {adminView && cons.fullname && (
          <>
            <p className="text-muted-foreground mb-0 text-sm! mt-5">
              {locale === routing.defaultLocale
                ? "Nama Pasien/ Pengguna"
                : "Patient/ User Name"}
            </p>
            <h6 className="text-health font-semibold">{cons.fullname}</h6>
          </>
        )}

        <p className="text-muted-foreground mb-0 text-sm! mt-5">
          {locale === routing.defaultLocale
            ? "Tanggal dan Waktu Terjadwal"
            : "Scheduled Date and Time"}
        </p>

        <h5 className="text-primary font-semibold mb-4">
          <LocalDateTime date={cons.scheduled_datetime} />
        </h5>
        <p className="text-sm! text-muted-foreground mt-5">
          {locale === routing.defaultLocale ? "Keluhan" : "Complaint"}
        </p>
        <p className="text-gray-700 text-sm! line-clamp-3">{cons.complaint}</p>

        {/* <div className="mb-5 border-l-4 border-l-primary bg-blue-50 p-4">
                      <p className="text-sm! text-muted-foreground">
                        {locale === routing.defaultLocale
                          ? "Total Pembayaran"
                          : "Total Payment"}
                      </p>
                      <h6 className="text-primary font-bold">
                        {formatRupiah(h.product_data.total)}
                      </h6>
                    </div> */}

        <p className="text-sm! text-muted-foreground mt-8">
          {locale === routing.defaultLocale ? "Dibuat pada" : "Created at"}
        </p>
        <p>
          <LocalDateTime date={cons.created_at} />
        </p>
      </Link>
    </div>
  );
};

export default ConsultScheduleHistoryCard;
