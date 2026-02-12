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
import { routing } from "@/i18n/routing";

const PopularMedical = async ({
  data,
  locale,
}: {
  data: any;
  locale: string;
}) => {
  return (
    <div className="bg-health pt-[5vh] pb-[30vh] -mt-[20vh] lg:rounded-t-[5rem] rounded-t-4xl">
      <ContainerWrap>
        <h2 className="font-bold text-white pt-[2vh] pb-[2vh]">
          {locale === routing.defaultLocale
            ? "Paket Medis"
            : "Medical Packages"}
        </h2>
      </ContainerWrap>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <Suspense fallback={<SkeletonComponent />}>
        <Content data={data} locale={locale} />
      </Suspense>
    </div>
  );
};

export default PopularMedical;

const SkeletonComponent = () => {
  return (
    <ContainerWrap>
      <div className="grid 3xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-[380px] w-full rounded-2xl" />
        ))}
      </div>
    </ContainerWrap>
  );
};

const Content = async ({ data, locale }: { data: any; locale: string }) => {
  const t = await getTranslations("utility");

  const medical = Array.isArray(data) ? data : [];
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
