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

const PopularPackage = () => {
  return (
    <div className="mt-[10vh]">
      <ContainerWrap>
        <h1 className="font-bold text-primary mt-10">Popular Package</h1>{" "}
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
      <div className="grid grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-[380px] w-full rounded-2xl" />
        ))}
      </div>
    </ContainerWrap>
  );
};

const Content = async () => {
  const [packages, locale] = await Promise.all([
    (await getAllPackages(1, 10)).data,
    getLocale(),
  ]);
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
