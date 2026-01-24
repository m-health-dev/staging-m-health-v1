import {
  get5Image,
  get5ImageMedical,
  get5ImageWellness,
} from "@/lib/unsplashImage";
import React, { Suspense } from "react";
import PopularPackSlide from "./PopularPackSlide";
import ContainerWrap from "../utility/ContainerWrap";

import { getLocale, getTranslations } from "next-intl/server";
import { getAllPackages } from "@/lib/packages/get-packages";
import { PackageType } from "@/types/packages.types";
import { Skeleton } from "../ui/skeleton";
import { routing } from "@/i18n/routing";

const PopularPackage = async ({
  data,
  locale,
}: {
  data: any;
  locale: string;
}) => {
  return (
    <div className="mt-[10vh]">
      <ContainerWrap>
        <h2 className="font-bold text-primary mt-10">
          {locale === routing.defaultLocale
            ? "Program Kebugaran & Medis"
            : "Wellness & Medical Programs"}
        </h2>
      </ContainerWrap>
      <Suspense fallback={<SkeletonComponent />}>
        <Content data={data} locale={locale} />
      </Suspense>
    </div>
  );
};

export default PopularPackage;

const SkeletonComponent = () => {
  return (
    <ContainerWrap className="mt-10">
      <div className="grid 3xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-[380px] w-full rounded-2xl" />
        ))}
      </div>
    </ContainerWrap>
  );
};

const Content = async ({ data, locale }: { data: any; locale: string }) => {
  const packages = Array.isArray(data) ? data : [];

  const t = await getTranslations("utility");
  return (
    <PopularPackSlide
      packages={packages}
      locale={locale}
      labels={{
        days: t("days"),
        night: t("night"),
      }}
    />
  );
};
