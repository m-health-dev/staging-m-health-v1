import PackageDetailClient from "@/components/package/PackageDetailClient";
import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import WellnessDetailClient from "@/components/wellness/WellnessDetailClient";
import { stripHtml } from "@/helper/removeHTMLTag";
import { routing } from "@/i18n/routing";
import { getUserInfo } from "@/lib/auth/getUserInfo";
import { getPackageBySlug } from "@/lib/packages/get-packages";
import { getImagePackageDetail } from "@/lib/unsplashImage";
import { getWellnessBySlug } from "@/lib/wellness/get-wellness";
import { WellnessType } from "@/types/wellness.types";
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

  const data: WellnessType = (await getWellnessBySlug(slug)).data.data;

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
          url: `/api/og?title=${encodeURIComponent(
            locale === routing.defaultLocale ? data.id_title : data.en_title
          )}&description=${encodeURIComponent(
            plainDescription
          )}&path=${encodeURIComponent(`m-health.id/wellness/${slug}`)}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

const WellnessDetailSlug = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const locale = await getLocale();
  const data = (await getWellnessBySlug(slug)).data.data;
  const t = await getTranslations("utility");

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let account = null;
  if (!session) {
    return (account = null);
  } else {
    const accessToken = session.access_token;
    account = await getUserInfo(accessToken);
  }

  return (
    <Wrapper>
      <WellnessDetailClient
        wellness={data}
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
        }}
      />
    </Wrapper>
  );
};

export default WellnessDetailSlug;
