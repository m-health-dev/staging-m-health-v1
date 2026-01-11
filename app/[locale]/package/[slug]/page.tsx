import PackageDetailClient from "@/components/package/PackageDetailClient";
import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import { stripHtml } from "@/helper/removeHTMLTag";
import { routing } from "@/i18n/routing";
import { getPackageBySlug } from "@/lib/packages/get-packages";
import { getImagePackageDetail } from "@/lib/unsplashImage";
import { PackageType } from "@/types/packages.types";
import type { Metadata, ResolvingMetadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import React from "react";
import { getAccessToken, getUser } from "../../(auth)/actions/auth.actions";
import { getUserDetail } from "@/lib/auth/getUserDetail";
import { getUserInfo } from "@/lib/auth/getUserInfo";
import { createClient } from "@/utils/supabase/server";

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

  const data: PackageType = (await getPackageBySlug(slug)).data.data;

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
            )}&path=${encodeURIComponent(`m-health.id/package/${slug}`)}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

const PackageDetailSlug = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const locale = await getLocale();
  const data = (await getPackageBySlug(slug)).data.data;
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
      <PackageDetailClient
        package={data}
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
        }}
      />
    </Wrapper>
  );
};

export default PackageDetailSlug;
