import PackageDetailClient from "@/components/package/PackageDetailClient";
import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import WellnessDetailClient from "@/components/wellness/WellnessDetailClient";
import { getPackageBySlug } from "@/lib/packages/get-packages";
import { getImagePackageDetail } from "@/lib/unsplashImage";
import { getWellnessBySlug } from "@/lib/wellness/get-wellness";
import { getLocale } from "next-intl/server";
import Image from "next/image";
import React from "react";

const WellnessDetailSlug = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const locale = await getLocale();
  const data = (await getWellnessBySlug(slug)).data.data;

  return (
    <Wrapper>
      <WellnessDetailClient wellness={data} locale={locale} />
    </Wrapper>
  );
};

export default WellnessDetailSlug;
