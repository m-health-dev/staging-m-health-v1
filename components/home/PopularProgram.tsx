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

const PopularProgram = () => {
  return (
    <div className="bg-primary pt-[5vh] pb-[30vh] mt-[7vh] lg:rounded-t-[5rem] rounded-t-4xl">
      <ContainerWrap>
        <h1 className="font-bold text-white pt-[2vh] pb-[6vh]">
          Popular Wellness
        </h1>
        <Suspense fallback={<SkeletonComponent />}>
          <Content />
        </Suspense>
      </ContainerWrap>
    </div>
  );
};

export default PopularProgram;

const SkeletonComponent = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton
          key={i}
          className="h-[350px] w-full aspect-square! rounded-2xl"
        />
      ))}
    </div>
  );
};

const Content = async () => {
  const [wellnessResult, locale] = await Promise.all([
    getAllWellness(1, 10),
    getLocale(),
  ]);
  const wellness = Array.isArray(wellnessResult.data)
    ? wellnessResult.data
    : [];
  return <PopularProgramGrid data={wellness} locale={locale} />;
};
