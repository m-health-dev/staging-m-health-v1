import MedicalDetailClient from "@/components/medical/MedicalDetailClient";
import PackageDetailClient from "@/components/package/PackageDetailClient";
import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import { getMedicalBySlug } from "@/lib/medical/get-medical";
import { getPackageBySlug } from "@/lib/packages/get-packages";
import { getImagePackageDetail } from "@/lib/unsplashImage";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import React from "react";

const MedicalDetailSlug = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const locale = await getLocale();
  const data = (await getMedicalBySlug(slug)).data.data;
  const t = await getTranslations("utility");

  return (
    <Wrapper>
      <MedicalDetailClient
        medical={data}
        locale={locale}
        labels={{
          detail: t("detail"),
          medical: t("medical"),
          wellness: t("wellness"),
          buy: t("buy"),
          male: t("male"),
          female: t("female"),
          unisex: t("unisex"),
          hospital: t("hospital"),
          price_info: t("price_info"),
          vendor: t("vendor"),
        }}
      />
    </Wrapper>
  );
};

export default MedicalDetailSlug;
