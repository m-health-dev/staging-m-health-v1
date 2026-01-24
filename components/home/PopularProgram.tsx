import {
  get5Image,
  get5ImageMedical,
  get5ImageWellness,
} from "@/lib/unsplashImage";
import React, { Suspense } from "react";
import PopularPackSlide from "./PopularPackSlide";
import ContainerWrap from "../utility/ContainerWrap";
import PopularProgramGrid from "./PopularProgramGrid";
import { getAllWellness } from "@/lib/wellness/get-wellness";
import { WellnessType } from "@/types/wellness.types";
import { Skeleton } from "../ui/skeleton";
import { getLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

const PopularProgram = async ({
  data,
  locale,
}: {
  data: any;
  locale: string;
}) => {
  return (
    <div className="bg-primary pt-[5vh] pb-[30vh] mt-[7vh] lg:rounded-t-[5rem] rounded-t-4xl">
      <ContainerWrap>
        <h2 className="font-bold text-white pt-[2vh] pb-[6vh]">
          {locale === routing.defaultLocale
            ? "Program Kebugaran"
            : "Wellness Programs"}
        </h2>
        <Suspense fallback={<SkeletonComponent />}>
          <Content data={data} locale={locale} />
        </Suspense>
      </ContainerWrap>
    </div>
  );
};

export default PopularProgram;

const SkeletonComponent = () => {
  return (
    <div className="grid 3xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6">
      {[...Array(4)].map((_, i) => (
        <Skeleton
          key={i}
          className="h-[350px] w-full aspect-square! rounded-2xl"
        />
      ))}
    </div>
  );
};

const Content = async ({ data, locale }: { data: any; locale: string }) => {
  const wellness = Array.isArray(data) ? data : [];
  return <PopularProgramGrid data={wellness} locale={locale} />;
};
