import ContainerWrap from "@/components/utility/ContainerWrap";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import { getConsultationByID } from "@/lib/consult/get-consultation";
import { Check, Mars, Venus, VenusAndMars, X } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { get } from "node:http";
import React from "react";
import Image from "next/image";
import Avatar from "boring-avatars";
import AssignDoctorForm from "./assign-doctor-form";
import { ConsultScheduleType } from "@/types/consult.types";
import { cn } from "@/lib/utils";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import { getAgeDetail } from "@/helper/getAge";
import { routing } from "@/i18n/routing";
import AvatarDoctor from "@/components/utility/AvatarDoctor";

const formatDOBStringToISO = (dateString?: string) => {
  if (!dateString) return null;

  const parts = dateString.split("-");
  if (parts.length !== 3) return null;

  const [day, month, year] = parts;

  // pastikan numeric
  if (!day || !month || !year) return null;

  return new Date(`${year}-${month}-${day}T00:00:00Z`).toISOString();
};

const AssignDoctorPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { data } = await getConsultationByID(id);
  const t = await getTranslations("utility");
  const c: ConsultScheduleType = data.data;
  const locale = await getLocale();

  const dobISO = formatDOBStringToISO(c.date_of_birth);
  const ageDetail = dobISO ? getAgeDetail(new Date(dobISO)) : null;

  return (
    <div className="mb-20">
      <ContainerWrap>
        <div className="my-10">
          <h3 className="text-primary font-bold">Assign Doctor</h3>
          <p className="text-muted-foreground mt-2">Consult ID: {id}</p>
        </div>
        <div className="grid lg:grid-cols-3 grid-cols-1 w-full gap-10">
          <div className="space-y-5 lg:col-span-2 w-full">
            {c.user.avatar_url ? (
              <Image
                src={c.user.avatar_url}
                height={300}
                width={300}
                alt={c.user.fullname}
                className="aspect-square object-cover w-32 h-32 rounded-full"
              />
            ) : c.user.google_avatar ? (
              <Image
                src={c.user.google_avatar}
                height={300}
                width={300}
                alt={c.user.fullname}
                className="aspect-square object-cover w-32 h-32 rounded-full"
              />
            ) : (
              <Avatar
                name={c.user.fullname}
                className="w-32! h-32!"
                colors={["#3e77ab", "#22b26e", "#f2f26f", "#fff7bd", "#95cfb7"]}
                variant="beam"
                size={32}
              />
            )}
            {c.doctor_id && c.meeting_link && (
              <div className="border-l-4 border-l-primary p-4 bg-white space-y-3">
                <div>
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
                </div>
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

            <div className="grid md:grid-cols-2 w-full grid-cols-1 gap-5">
              <div>
                <Link href={`mailto:${c.email}`}>
                  <p className="text-muted-foreground">Email</p>
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
                  <p className="text-muted-foreground">
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
                <p className="text-muted-foreground">
                  {locale === routing.defaultLocale
                    ? "Nama Lengkap"
                    : "Fullname"}
                </p>
                <p>{c.fullname}</p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  {locale === routing.defaultLocale
                    ? "Tanggal Lahir"
                    : "Date of Birth"}
                </p>
                <p className="inline-flex gap-2 items-center">
                  <span>{c.date_of_birth}</span>
                  {ageDetail && (
                    <span className="bg-gray-50 border border-gray-500 px-3 font-sans text-sm! py-1 rounded-full inline-flex w-fit text-muted-foreground">
                      {ageDetail.years}{" "}
                      {locale === routing.defaultLocale ? "Tahun" : "Years"}{" "}
                      {ageDetail.months}{" "}
                      {locale === routing.defaultLocale ? "Bulan" : "Months"}
                    </span>
                  )}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">
                  {locale === routing.defaultLocale ? "Berat Badan" : "Weight"}
                </p>
                <p>{c.weight}kg</p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  {locale === routing.defaultLocale ? "Tinggi Badan" : "Height"}
                </p>
                <p>{c.height}cm</p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  {locale === routing.defaultLocale
                    ? "Jenis Kelamin"
                    : "Gender"}
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
                <p className="text-muted-foreground">
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
            <div className="grid md:grid-cols-2 w-full grid-cols-1 gap-5 bg-white p-4 rounded-2xl border">
              <div>
                <p className="text-muted-foreground mb-1">
                  {locale === routing.defaultLocale
                    ? "Dibuat pada"
                    : "Created at"}
                </p>
                <p>
                  <LocalDateTime date={c.created_at} />
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">
                  {locale === routing.defaultLocale
                    ? "Diperbarui pada"
                    : "Updated at"}
                </p>
                <p>
                  <LocalDateTime date={c.updated_at} />
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">
                  {locale === routing.defaultLocale
                    ? "Email Terkirim ke Pengguna"
                    : "Email Sent to User"}
                </p>
                <p
                  className={cn(
                    "inline-flex items-center gap-1 text-sm!",
                    c.user_email_status === "sent"
                      ? "bg-green-50 border-green-500 text-green-500 border rounded-full px-3 py-1"
                      : "bg-amber-50 border-amber-500 text-amber-500 border rounded-full px-3 py-1",
                  )}
                >
                  {c.user_email_status === "sent" ? (
                    <Check className="size-5" />
                  ) : (
                    <X className="size-5" />
                  )}
                  {c.user_email_status === "sent" ? "Sent" : "Not Sent"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">
                  {locale === routing.defaultLocale
                    ? "Email Terkirim ke Dokter"
                    : "Email Sent to Doctor"}
                </p>
                <p
                  className={cn(
                    "inline-flex items-center gap-1 text-sm!",
                    c.doctor_email_status === "sent"
                      ? "bg-green-50 border-green-500 text-green-500 border rounded-full px-3 py-1"
                      : "bg-amber-50 border-amber-500 text-amber-500 border rounded-full px-3 py-1",
                  )}
                >
                  {c.doctor_email_status === "sent" ? (
                    <Check className="size-5" />
                  ) : (
                    <X className="size-5" />
                  )}
                  {c.doctor_email_status === "sent" ? "Sent" : "Not Sent"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">
                  {locale === routing.defaultLocale
                    ? "WhatsApp Terkirim ke Pengguna"
                    : "WhatsApp Sent to User"}
                </p>
                <p
                  className={cn(
                    "inline-flex items-center gap-1 text-sm!",
                    c.user_wa_status === "sent"
                      ? "bg-green-50 border-green-500 text-green-500 border rounded-full px-3 py-1"
                      : "bg-amber-50 border-amber-500 text-amber-500 border rounded-full px-3 py-1",
                  )}
                >
                  {c.user_wa_status === "sent" ? (
                    <Check className="size-5" />
                  ) : (
                    <X className="size-5" />
                  )}
                  {c.user_wa_status === "sent" ? "Sent" : "Not Sent"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">
                  {locale === routing.defaultLocale
                    ? "WhatsApp Terkirim ke Dokter"
                    : "WhatsApp Sent to Doctor"}
                </p>
                <p
                  className={cn(
                    "inline-flex items-center gap-1 text-sm!",
                    c.doctor_wa_status === "sent"
                      ? "bg-green-50 border-green-500 text-green-500 border rounded-full px-3 py-1"
                      : "bg-amber-50 border-amber-500 text-amber-500 border rounded-full px-3 py-1",
                  )}
                >
                  {c.doctor_wa_status === "sent" ? (
                    <Check className="size-5" />
                  ) : (
                    <X className="size-5" />
                  )}
                  {c.doctor_wa_status === "sent" ? "Sent" : "Not Sent"}
                </p>
              </div>
            </div>
            <div className="border-l-4 border-l-gray-400 px-4 bg-gray-50 py-3">
              <p className="text-muted-foreground mb-1">
                {locale === routing.defaultLocale
                  ? "Status Pembayaran"
                  : "Payment Status"}
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
                {locale === routing.defaultLocale
                  ? "Jadwal Waktu"
                  : "Scheduled Datetime"}
              </p>
              <p className="text-health bg-white py-2 px-4 border rounded-full inline-flex font-semibold">
                <LocalDateTime date={c.scheduled_datetime} />
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">
                {locale === routing.defaultLocale
                  ? "ID Sesi Konsultasi/ Chat"
                  : "Consultation/ Chat Session ID"}
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
                {locale === routing.defaultLocale
                  ? "Kondisi Kesehatan"
                  : "Health Condition"}
              </p>
              <div className=" bg-white py-2 px-3 min-h-12 flex items-center text-gray-800 border rounded-2xl text-wrap">
                <p>{c.complaint}</p>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">
                {locale === routing.defaultLocale
                  ? "Gambar Referensi"
                  : "Reference Images"}
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
                  {locale === routing.defaultLocale
                    ? "Tidak ada gambar referensi."
                    : "No reference images available."}
                </p>
              )}
            </div>

            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
          </div>
          <div className="lg:col-span-1 w-full">
            <AssignDoctorForm
              consultID={id}
              locale={locale}
              readDoctorID={c.doctor_id}
            />
            <div className="border-l-4 border-l-red-500 bg-red-50 px-4 py-3 mt-4">
              <p className="text-red-600 text-sm!">
                {locale === routing.defaultLocale
                  ? "Perhatian: Dengan menugaskan dokter, sistem akan secara otomatis mengirimkan email dan WhatsApp kepada dokter dan pengguna mengenai detail konsultasi. Jika terdapat pergantian dokter, mohon pastikan untuk menginformasikan kepada kedua belah pihak secara manual."
                  : "Attention: By assigning a doctor, the system will automatically send emails and WhatsApp messages to both the doctor and the user regarding the consultation details. If there is a change of doctor, please ensure to inform both parties manually."}
              </p>
            </div>
          </div>
        </div>
        {/* <div className="bg-white max-h-52 overflow-y-auto text-wrap break-anywhere p-4 rounded-2xl mt-10 border">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div> */}
      </ContainerWrap>
    </div>
  );
};

export default AssignDoctorPage;
