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
import { MedicalEquipmentType } from "@/types/medical-equipment.types";
import type { Metadata, ResolvingMetadata } from "next";
import { routing } from "@/i18n/routing";
import { stripHtml } from "@/helper/removeHTMLTag";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug;

  const locale = await getLocale();

  const data: MedicalEquipmentType = (await getMedicalEquipmentBySlug(slug))
    .data.data;

  const rawContent =
    locale === routing.defaultLocale
      ? data.id_description
      : data.en_description;

  const plainDescription = stripHtml(rawContent);

  return {
    title: `${
      locale === routing.defaultLocale ? data.id_title : data.en_title
    } - M HEALTH`,
    description: `${plainDescription}`,
    openGraph: {
      title: `${
        locale === routing.defaultLocale ? data.id_title : data.en_title
      } - M HEALTH`,
      description: `${plainDescription}`,
      images: [
        {
          url:
            data.highlight_image ||
            `/api/og?title=${encodeURIComponent(
              locale === routing.defaultLocale ? data.id_title : data.en_title
            )}&description=${encodeURIComponent(
              plainDescription
            )}&path=${encodeURIComponent(`m-health.id/equipment/${slug}`)}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

const PackageDetailSlug = async ({ params }: Props) => {
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
