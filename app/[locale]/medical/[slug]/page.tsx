import MedicalDetailClient from "@/components/medical/MedicalDetailClient";
import PackageDetailClient from "@/components/package/PackageDetailClient";
import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import { getMedicalBySlug } from "@/lib/medical/get-medical";
import { getPackageBySlug } from "@/lib/packages/get-packages";
import { getImagePackageDetail } from "@/lib/unsplashImage";
import { getLocale } from "next-intl/server";
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

  return (
    <Wrapper>
      <MedicalDetailClient medical={data} locale={locale} />
    </Wrapper>
  );
};

export default MedicalDetailSlug;
