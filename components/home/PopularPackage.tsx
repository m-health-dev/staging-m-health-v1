import {
  get5Image,
  get5ImageMedical,
  get5ImageWellness,
} from "@/lib/unsplashImage";
import React from "react";
import PopularPackSlide from "./PopularPackSlide";
import ContainerWrap from "../utility/ContainerWrap";
import { getAllPackages } from "@/lib/packages/getPackages";
import { getLocale } from "next-intl/server";

const PopularPackage = async () => {
  const { data: packages } = await getAllPackages();
  const locale = await getLocale();

  return (
    <div className="mt-[10vh]">
      <ContainerWrap>
        <h1 className="font-bold text-primary mt-10">Popular Package</h1>{" "}
      </ContainerWrap>
      <PopularPackSlide packages={packages.slice(0, 10)} locale={locale} />
    </div>
  );
};

export default PopularPackage;
