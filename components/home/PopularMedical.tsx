import {
  get10ImageHospital,
  get5Image,
  get5ImageMedical,
  get5ImageWellness,
} from "@/lib/unsplashImage";
import React, { Suspense } from "react";
import PopularPackSlide from "./PopularPackSlide";
import ContainerWrap from "../utility/ContainerWrap";
import PopularProgramGrid from "./PopularProgramGrid";
import PopularMedSlide from "./PopularMedSlide";
import { getDummyRS, getRSByCity, getRSByProvince } from "@/lib/dummyRS";

import { getLocale, getTranslations } from "next-intl/server";
import { MedicalType } from "@/types/medical.types";
import { Skeleton } from "../ui/skeleton";
import { getAllMedical } from "@/lib/medical/get-medical";

const PopularMedical = () => {
  return (
    <div className="bg-health pt-[5vh] pb-[30vh] -mt-[20vh] lg:rounded-t-[5rem] rounded-t-4xl">
      <ContainerWrap>
        <h1 className="font-bold text-white pt-[2vh] pb-[6vh]">
          Popular Medical
        </h1>
      </ContainerWrap>
      <Suspense fallback={<SkeletonComponent />}>
        <Content />
      </Suspense>
    </div>
  );
};

export default PopularMedical;

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
  const [medicalResult, locale] = await Promise.all([
    await getAllMedical(1, 10),
    getLocale(),
  ]);

  const t = await getTranslations("utility");

  const medical = Array.isArray(medicalResult.data) ? medicalResult.data : [];
  return (
    <PopularMedSlide
      data={medical}
      locale={locale}
      labels={{
        days: t("days"),
        night: t("night"),
      }}
    />
  );
};
