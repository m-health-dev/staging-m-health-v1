import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import { routing } from "@/i18n/routing";
import { getConsultationByID } from "@/lib/consult/get-consultation";
import { ConsultScheduleType } from "@/types/consult.types";
import { ro } from "date-fns/locale";
import { locale } from "dayjs";
import { getLocale } from "next-intl/server";
import React from "react";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const page = async ({ params }: Props) => {
  const { id } = await params;

  const { data } = await getConsultationByID(id);
  const locale = await getLocale();
  const detail: ConsultScheduleType = data.data;
  return (
    <div>
      <div className="my-10">
        <h3 className="text-primary font-bold">
          {locale === routing.defaultLocale
            ? "Detail Konsultasi"
            : "Consultation Detail"}
        </h3>
      </div>
      <p className="text-muted-foreground mb-2 text-sm!">
        {locale === routing.defaultLocale
          ? "Jadwal Konsultasi"
          : "Consultation Schedule"}
      </p>
      <div className="bg-white px-4 py-2 border rounded-2xl mb-10 inline-flex">
        <h6 className="font-semibold text-health">
          <LocalDateTime date={detail.scheduled_datetime} />
        </h6>
      </div>
      <pre>{JSON.stringify(detail, null, 2)}</pre>
    </div>
  );
};

export default page;
