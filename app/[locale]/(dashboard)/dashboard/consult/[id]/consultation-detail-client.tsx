"use client";

import ContainerWrap from "@/components/utility/ContainerWrap";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import {
  Check,
  Loader,
  Mars,
  Stethoscope,
  Venus,
  VenusAndMars,
  X,
} from "lucide-react";
import { routing } from "@/i18n/routing";
import Link from "next/link";
import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";

interface ConsultationDetailClientProps {
  id: string;
  initialData: any;
  locale: string;
  translations: {
    male: string;
    female: string;
    unisex: string;
  };
}

const ConsultationDetailClient = ({
  id,
  initialData,
  locale,
  translations,
}: ConsultationDetailClientProps) => {
  const [data, setData] = useState(initialData);
  const c = data;

  // Polling every 5 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/consult/${id}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setData(json.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch consultation data:", error);
      }
    };

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [id]);

  return (
    <div className="mb-20">
      <ContainerWrap>
        <div className="my-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {c.payment_status === "success" ? (
              <p className="text-health bg-green-50 border-green-600 border px-3 py-1 capitalize inline-flex rounded-full text-xs! gap-2 items-center">
                <Check className="size-4" />
                {locale === routing.defaultLocale
                  ? "Pembayaran Berhasil"
                  : "Payment Successful"}
              </p>
            ) : c.payment_status === "waiting" ? (
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

            {c.doctor_id && (
              <p className="text-sky-600 bg-sky-50 border-sky-600 border px-3 py-1 capitalize inline-flex rounded-full text-xs! gap-2 items-center">
                <Stethoscope className="size-4" />
                {locale === routing.defaultLocale
                  ? "Tautan Telekonsultasi Tersedia"
                  : "Meeting Link Available"}
              </p>
            )}
          </div>
          <h3 className="text-primary font-bold">
            {locale === routing.defaultLocale
              ? "Detail Konsultasi"
              : "Consultation Details"}
          </h3>
          <p className="text-muted-foreground mt-2">ID: {id}</p>
          <p>
            {locale === routing.defaultLocale ? "Dibuat pada" : "Created at"} :{" "}
            <LocalDateTime date={c.created_at} />
          </p>
        </div>

        <div className="space-y-5 w-full">
          {c.doctor_id && c.meeting_link && (
            <div className="border-l-4 border-l-primary p-4 bg-white space-y-3">
              {/* <div>
                <p className="text-muted-foreground mb-1">
                  {locale === routing.defaultLocale
                    ? "Dokter Ditugaskan"
                    : "Doctor Assigned"}
                </p>
                {c.doctor_id ? (
                  <AvatarDoctor
                    doctor={c.doctor_id}
                    locale={locale}
                    size="md"
                  />
                ) : (
                  <p className="text-muted-foreground">
                    {locale === routing.defaultLocale
                      ? "Tidak ada dokter yang ditugaskan."
                      : "No doctor assigned."}
                  </p>
                )}
              </div> */}
              <div>
                <p className="text-muted-foreground mb-1">
                  {locale === routing.defaultLocale
                    ? "Link Pertemuan"
                    : "Meeting Link"}
                </p>
                {c.meeting_link ? (
                  <Link href={c.meeting_link} target="_blank">
                    <p className="text-primary underline">{c.meeting_link}</p>
                  </Link>
                ) : (
                  <p className="text-muted-foreground">
                    {locale === routing.defaultLocale
                      ? "Tidak ada link pertemuan yang disediakan."
                      : "No meeting link provided."}
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="border-l-4 border-l-health px-4 bg-green-50 py-3">
            <p className="text-muted-foreground mb-1">
              {locale === routing.defaultLocale
                ? "Tanggal dan Waktu Terjadwal"
                : "Scheduled DateTime"}
            </p>
            <p className="text-health font-semibold">
              <LocalDateTime date={c.scheduled_datetime} />
            </p>
          </div>
          <div className="grid md:grid-cols-2 w-full grid-cols-1 gap-5">
            <div>
              <Link href={`mailto:${c.email}`}>
                <p className="text-muted-foreground mb-1">Email</p>
                <p>{c.email}</p>
              </Link>
            </div>
            <div>
              <Link
                href={`whatsapp://send?phone=${c.phone_number.replaceAll(
                  "+",
                  "",
                )}`}
              >
                <p className="text-muted-foreground mb-1">
                  {locale === routing.defaultLocale
                    ? "Nomor Telepon"
                    : "Phone Number"}
                </p>
                <p>{c.phone_number}</p>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 w-full grid-cols-1 gap-5">
            <div>
              <p className="text-muted-foreground mb-1">
                {locale === routing.defaultLocale ? "Nama Lengkap" : "Fullname"}
              </p>
              <p>{c.fullname}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">
                {locale === routing.defaultLocale ? "Berat" : "Weight"}
              </p>
              <p>{c.weight}kg</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">
                {locale === routing.defaultLocale ? "Tinggi" : "Height"}
              </p>
              <p>{c.height}cm</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">
                {locale === routing.defaultLocale ? "Jenis Kelamin" : "Gender"}
              </p>
              {c.gender === "male" ? (
                <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full border border-primary">
                  <Mars className="size-4 text-primary" />
                  <p className="text-primary text-sm!">{translations.male}</p>
                </div>
              ) : c.gender === "female" ? (
                <div className="inline-flex items-center gap-2 bg-pink-100 px-3 py-1 rounded-full border border-pink-400">
                  <Venus className="size-4 text-pink-500" />
                  <p className="text-pink-500 text-sm!">
                    {translations.female}
                  </p>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-health/10 px-3 py-1 rounded-full border border-health">
                  <VenusAndMars className="size-4 text-health" />
                  <p className="text-health text-sm!">{translations.unisex}</p>
                </div>
              )}
            </div>
            <div>
              <p className="text-muted-foreground mb-1">
                {locale === routing.defaultLocale
                  ? "Domisili/ Lokasi"
                  : "Domicile/ Location"}
              </p>
              <div>
                <p>{c.location.address}</p>
                <p>{c.location.district}</p>
                <p>{c.location.city}</p>
                <p>{c.location.postal_code}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-1">
              {locale === routing.defaultLocale
                ? "Sesi Konsultasi/ Percakapan"
                : "Consultation/ Conversation Session"}
            </p>
            {c.chat_session.length >= 22 ? (
              <Link href={`/${locale}/c/${c.chat_session}`}>
                <p className="text-primary underline">{c.chat_session}</p>
              </Link>
            ) : (
              <p>{c.chat_session}</p>
            )}
          </div>
          {c.complaint && (
            <div>
              <p className="text-muted-foreground mb-1">
                {locale === routing.defaultLocale
                  ? "Kondisi Kesehatan"
                  : "Health Condition"}
              </p>
              <div className=" bg-white py-4 px-4 min-h-12 flex items-center text-gray-800 rounded-2xl text-wrap">
                <p>{c.complaint}</p>
              </div>
            </div>
          )}

          {c.reference_image && c.reference_image.length > 0 && (
            <div>
              <p className="text-muted-foreground mb-1">
                {locale === routing.defaultLocale
                  ? "Gambar Referensi"
                  : "Referenced Image"}
              </p>
              {c.reference_image && c.reference_image.length > 0 ? (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                  {c.reference_image.map((img: string, index: number) => (
                    <ImageZoom key={index}>
                      <Image
                        key={index}
                        src={img}
                        alt={`Reference Image ${index + 1}`}
                        width={400}
                        height={400}
                        className="w-full h-auto object-cover aspect-video rounded-2xl border"
                      />
                    </ImageZoom>
                  ))}
                </div>
              ) : (
                <p>
                  {locale === routing.defaultLocale
                    ? "Tidak ada gambar referensi tersedia."
                    : "No reference images available."}
                </p>
              )}
            </div>
          )}
        </div>
      </ContainerWrap>
    </div>
  );
};

export default ConsultationDetailClient;
