import MedicalDetailClient from "@/components/medical/MedicalDetailClient";
import PackageDetailClient from "@/components/package/PackageDetailClient";
import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import { stripHtml } from "@/helper/removeHTMLTag";
import { routing } from "@/i18n/routing";
import { getUserInfo } from "@/lib/auth/getUserInfo";
import { getMedicalBySlug } from "@/lib/medical/get-medical";
import { getPackageBySlug } from "@/lib/packages/get-packages";
import { getImagePackageDetail } from "@/lib/unsplashImage";
import { MedicalType } from "@/types/medical.types";
import { createClient } from "@/utils/supabase/server";
import type { Metadata, ResolvingMetadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import React from "react";

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

  const data: MedicalType = (await getMedicalBySlug(slug)).data.data;

  const rawContent =
    locale === routing.defaultLocale ? data.id_tagline : data.en_tagline;

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
            )}&path=${encodeURIComponent(`m-health.id/medical/${slug}`)}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

const MedicalDetailSlug = async ({ params }: Props) => {
  const { slug } = await params;

  const locale = await getLocale();
  const data = (await getMedicalBySlug(slug)).data.data;
  const t = await getTranslations("utility");

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let account = null;
  if (session) {
    const accessToken = session.access_token;
    account = await getUserInfo(accessToken);
  }

  return (
    <Wrapper>
      <MedicalDetailClient
        medical={data}
        locale={locale}
        account={account}
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
          days: t("days"),
          night: t("night"),
        }}
      />
    </Wrapper>
  );
};

export default MedicalDetailSlug;
