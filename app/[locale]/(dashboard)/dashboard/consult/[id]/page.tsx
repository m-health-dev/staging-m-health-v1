import ContainerWrap from "@/components/utility/ContainerWrap";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import { getConsultationByID } from "@/lib/consult/get-consultation";
import { Mars, Venus, VenusAndMars } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { get } from "node:http";
import React from "react";
import Image from "next/image";
import Avatar from "boring-avatars";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import AvatarDoctor from "@/components/utility/AvatarDoctor";

const ConsultationDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { data } = await getConsultationByID(id);
  const t = await getTranslations("utility");
  const c = data.data;
  const locale = await getLocale();
  return (
    <div className="mb-20">
      <ContainerWrap>
        <div className="my-10">
          <h3 className="text-primary font-bold">
            {locale === "id" ? "Detail Konsultasi" : "Consultation Details"}
          </h3>
          <p className="text-muted-foreground mt-2">ID: {id}</p>
          <p>
            {locale === "id" ? "Dibuat pada" : "Created at"} :{" "}
            <LocalDateTime date={c.created_at} />
          </p>
        </div>

        <div className="space-y-5 w-full">
          {c.doctor_id && c.meeting_link && (
            <div className="border-l-4 border-l-primary p-4 bg-white space-y-3">
              <div>
                <p className="text-muted-foreground mb-1">
                  {locale === "id" ? "Dokter Ditugaskan" : "Doctor Assigned"}
                </p>
                {c.doctor_id ? (
                  <AvatarDoctor
                    doctor={c.doctor_id}
                    locale={locale}
                    size="md"
                  />
                ) : (
                  <p className="text-muted-foreground">
                    {locale === "id"
                      ? "Tidak ada dokter yang ditugaskan."
                      : "No doctor assigned."}
                  </p>
                )}
              </div>
              <div>
                <p className="text-muted-foreground mb-1">
                  {locale === "id" ? "Link Pertemuan" : "Meeting Link"}
                </p>
                {c.meeting_link ? (
                  <Link href={c.meeting_link} target="_blank">
                    <p className="text-primary underline">{c.meeting_link}</p>
                  </Link>
                ) : (
                  <p className="text-muted-foreground">
                    {locale === "id"
                      ? "Tidak ada link pertemuan yang disediakan."
                      : "No meeting link provided."}
                  </p>
                )}
              </div>
            </div>
          )}

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
                  {locale === "id" ? "Nomor Telepon" : "Phone Number"}
                </p>
                <p>{c.phone_number}</p>
              </Link>
            </div>
          </div>
          <div className="grid md:grid-cols-2 w-full grid-cols-1 gap-5">
            <div>
              <p className="text-muted-foreground mb-1">
                {locale === "id" ? "Nama Lengkap" : "Fullname"}
              </p>
              <p>{c.fullname}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">
                {locale === "id" ? "Berat" : "Weight"}
              </p>
              <p>{c.weight}kg</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">
                {locale === "id" ? "Tinggi" : "Height"}
              </p>
              <p>{c.height}cm</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">
                {locale === "id" ? "Jenis Kelamin" : "Gender"}
              </p>
              {c.gender === "male" ? (
                <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full border border-primary">
                  <Mars className="size-4 text-primary" />
                  <p className="text-primary text-sm!">{t("male")}</p>
                </div>
              ) : c.gender === "female" ? (
                <div className="inline-flex items-center gap-2 bg-pink-100 px-3 py-1 rounded-full border border-pink-400">
                  <Venus className="size-4 text-pink-500" />
                  <p className="text-pink-500 text-sm!">{t("female")}</p>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-health/10 px-3 py-1 rounded-full border border-health">
                  <VenusAndMars className="size-4 text-health" />
                  <p className="text-health text-sm!">{t("unisex")}</p>
                </div>
              )}
            </div>
            <div>
              <p className="text-muted-foreground mb-1">
                {locale === "id" ? "Domisili/ Lokasi" : "Domicile/ Location"}
              </p>
              <div>
                <p>{c.location.address}</p>
                <p>{c.location.district}</p>
                <p>{c.location.city}</p>
                <p>{c.location.postal_code}</p>
              </div>
            </div>
          </div>
          <div className="border-l-4 border-l-gray-400 px-4 bg-gray-50 py-3">
            <p className="text-muted-foreground mb-1">
              {locale === "id" ? "Status Pembayaran" : "Payment Status"}
            </p>
            {c.payment_status === "success" ? (
              <p className="text-health bg-green-50 border-green-600 border px-3 py-1 capitalize inline-flex rounded-full">
                {c.payment_status}
              </p>
            ) : c.payment_status === "waiting" ? (
              <p className="text-yellow-600 bg-yellow-50 border-yellow-600 border px-3 py-1 capitalize inline-flex rounded-full">
                {c.payment_status}
              </p>
            ) : (
              <p className="text-red-600 bg-red-50 border-red-600 border px-3 py-1 capitalize inline-flex rounded-full">
                {c.payment_status}
              </p>
            )}
          </div>
          <div className="border-l-4 border-l-health px-4 bg-green-50 py-3">
            <p className="text-muted-foreground mb-1">
              {locale === "id"
                ? "Tanggal dan Waktu Terjadwal"
                : "Scheduled DateTime"}
            </p>
            <p className="text-health bg-white py-2 px-4 border rounded-full inline-flex font-semibold">
              <LocalDateTime date={c.scheduled_datetime} />
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">
              {locale === "id"
                ? "Sesi Konsultasi/ Percakapan"
                : "Consultation/ Conversation Session"}
            </p>
            {c.chat_session.length >= 22 ? (
              <Link
                href={`/${locale}/studio/chat-activity/preview/${c.chat_session}`}
              >
                <p className="text-primary underline">{c.chat_session}</p>
              </Link>
            ) : (
              <p>{c.chat_session}</p>
            )}
          </div>
          <div>
            <p className="text-muted-foreground mb-1">
              {locale === "id" ? "Kondisi Kesehatan" : "Health Condition"}
            </p>
            <div className=" bg-white py-2 px-3 min-h-12 flex items-center text-gray-800 border rounded-2xl text-wrap">
              <p>{c.complaint}</p>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">
              {locale === "id" ? "Gambar Referensi" : "Referenced Image"}
            </p>
            {c.reference_image && c.reference_image.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {c.reference_image.map((img: string, index: number) => (
                  <ImageZoom key={index}>
                    <Image
                      key={index}
                      src={img}
                      alt={`Reference Image ${index + 1}`}
                      width={300}
                      height={300}
                      className="w-full h-48 object-cover rounded-2xl border"
                    />
                  </ImageZoom>
                ))}
              </div>
            ) : (
              <p>
                {locale === "id"
                  ? "Tidak ada gambar referensi tersedia."
                  : "No reference images available."}
              </p>
            )}
          </div>

          {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        </div>
      </ContainerWrap>
    </div>
  );
};

export default ConsultationDetailsPage;
