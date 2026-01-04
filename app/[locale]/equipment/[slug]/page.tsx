import PackageDetailClient from "@/components/package/PackageDetailClient";
import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import { getMedicalEquipmentBySlug } from "@/lib/medical-equipment/get-medical-equipment";
import { getPackageBySlug } from "@/lib/packages/get-packages";
import { getImagePackageDetail } from "@/lib/unsplashImage";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import React from "react";
import EquipmentClientPage from "../euipment-page-client";
import EquipmentDetailClient from "@/components/equipment/EquipmentDetailClient";

const PackageDetailSlug = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const locale = await getLocale();
  const data = (await getMedicalEquipmentBySlug(slug)).data.data;
  const t = await getTranslations("utility");

  return (
    <Wrapper>
      <EquipmentDetailClient
        equipment={data}
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
          vendor: t("vendor"),
          price_info: t("price_info"),
        }}
      />
    </Wrapper>
  );
};

export default PackageDetailSlug;
