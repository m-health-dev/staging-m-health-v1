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

const PopularPackage = async () => {
  const locale = await getLocale();
  return (
    <div className="mt-[10vh]">
      <ContainerWrap>
        <h1 className="font-bold text-primary mt-10">
          {locale === routing.defaultLocale
            ? "Paket Kebugaran & Medis"
            : "Wellness & Medical Packages"}
        </h1>
      </ContainerWrap>
      <Suspense fallback={<SkeletonComponent />}>
        <Content />
      </Suspense>
    </div>
  );
};

export default PopularPackage;

const SkeletonComponent = () => {
  return (
    <ContainerWrap>
      <div className="grid 3xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-[380px] w-full rounded-2xl" />
        ))}
      </div>
    </ContainerWrap>
  );
};

const Content = async () => {
  const [packagesResult, locale] = await Promise.all([
    getAllPackages(1, 10),
    getLocale(),
  ]);

  const packages = Array.isArray(packagesResult.data)
    ? packagesResult.data
    : [];

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
