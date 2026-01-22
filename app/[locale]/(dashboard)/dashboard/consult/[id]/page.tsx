import { getConsultationByID } from "@/lib/consult/get-consultation";
import { getLocale, getTranslations } from "next-intl/server";
import React from "react";
import ConsultationDetailClient from "./consultation-detail-client";

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
    <ConsultationDetailClient
      id={id}
      initialData={c}
      locale={locale}
      translations={{
        male: t("male"),
        female: t("female"),
        unisex: t("unisex"),
      }}
    />
  );
};

export default ConsultationDetailsPage;
