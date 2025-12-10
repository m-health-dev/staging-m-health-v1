import PackageDetailClient from "@/components/package/PackageDetailClient";
import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import { getPackageBySlug } from "@/lib/packages/get-packages";
import { getImagePackageDetail } from "@/lib/unsplashImage";
import { getLocale } from "next-intl/server";
import Image from "next/image";
import React from "react";

const PackageDetailSlug = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const locale = await getLocale();
  const data = (await getPackageBySlug(slug)).data.data;

  return (
    <Wrapper>
      <PackageDetailClient package={data} locale={locale} />
    </Wrapper>
  );
};

export default PackageDetailSlug;
