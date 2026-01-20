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
import AssignDoctorForm from "./assign-doctor-form";
import { ConsultScheduleType } from "@/types/consult.types";

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
  return (
    <div className="mb-20">
      <ContainerWrap>
        <div className="my-10">
          <h3 className="text-primary font-bold">Assign Doctor</h3>
          <p className="text-muted-foreground mt-2">Consult ID: {id}</p>
          <p>
            Created at : <LocalDateTime date={c.created_at} />
          </p>
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
            <div className="grid md:grid-cols-2 w-full grid-cols-1 gap-5">
              <div>
                <p className="text-muted-foreground">Email Sent to User</p>
                <p>{c.user_email_status}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email Sent to Doctor</p>
                <p>{c.doctor_email_status}</p>
              </div>
              <div>
                <p className="text-muted-foreground">WhatsApp Sent to User</p>
                <p>{c.user_wa_status}</p>
              </div>
              <div>
                <p className="text-muted-foreground">WhatsApp Sent to Doctor</p>
                <p>{c.doctor_wa_status}</p>
              </div>
            </div>
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
                    ""
                  )}`}
                >
                  <p className="text-muted-foreground">Phone Number</p>
                  <p>{c.phone_number}</p>
                </Link>
              </div>
            </div>
            <div className="grid md:grid-cols-2 w-full grid-cols-1 gap-5">
              <div>
                <p className="text-muted-foreground">Fullname</p>
                <p>{c.fullname}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Weight</p>
                <p>{c.weight}kg</p>
              </div>
              <div>
                <p className="text-muted-foreground">Height</p>
                <p>{c.height}cm</p>
              </div>
              <div>
                <p className="text-muted-foreground">Gender</p>
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
                <p className="text-muted-foreground">Domicile/ Location</p>
                <div>
                  <p>{c.location.address}</p>
                  <p>{c.location.district}</p>
                  <p>{c.location.city}</p>
                  <p>{c.location.postal_code}</p>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-l-gray-400 px-4 bg-gray-50 py-3">
              <p className="text-muted-foreground">Payment Status</p>
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
              <p className="text-muted-foreground">Scheduled Datetime</p>
              <h6 className="text-health bg-white py-2 px-4 border rounded-full inline-flex font-semibold">
                <LocalDateTime date={c.scheduled_datetime} />
              </h6>
            </div>
            <div>
              <p className="text-muted-foreground">
                Consulation/ Conversation Session
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
              <p className="text-muted-foreground">Complaint</p>
              <div className=" bg-white py-2 px-3 min-h-12 flex items-center text-gray-800 border rounded-2xl text-wrap">
                <p>{c.complaint}</p>
              </div>
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
                *Assigning a new doctor will override the previous doctor. After
                button to assign is clicked, the doctor and user will be
                notified and the consultation session will be updated.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white max-h-52 overflow-y-auto text-wrap break-anywhere p-4 rounded-2xl mt-10 border">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </ContainerWrap>
    </div>
  );
};

export default AssignDoctorPage;
