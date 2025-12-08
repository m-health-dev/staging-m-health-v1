import {
  get5Image,
  get5ImageMedical,
  get5ImageWellness,
} from "@/lib/unsplashImage";
import React from "react";
import PopularPackSlide from "./PopularPackSlide";
import ContainerWrap from "../utility/ContainerWrap";

import { getLocale } from "next-intl/server";
import { getAllPackages } from "@/lib/packages/get-packages";
import { PackageType } from "@/types/packages.types";

const PopularPackage = async () => {
  const locale = await getLocale();

  const packages: PackageType[] = (await getAllPackages(1, 10)).data;

  return (
    <div className="mt-[10vh]">
      <ContainerWrap>
        <h1 className="font-bold text-primary mt-10">Popular Package</h1>{" "}
      </ContainerWrap>
      <PopularPackSlide packages={packages} locale={locale} />
    </div>
  );
};

export default PopularPackage;
