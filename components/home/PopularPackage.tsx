import {
  get5Image,
  get5ImageMedical,
  get5ImageWellness,
} from "@/lib/unsplashImage";
import React from "react";
import PopularPackSlide from "./PopularPackSlide";
import ContainerWrap from "../utility/ContainerWrap";

const PopularPackage = async () => {
  const wellness = await get5ImageWellness();
  const medical = await get5ImageMedical();
  const random = await get5Image();
  const data = [...medical.results, ...random.results];
  return (
    <div>
      <ContainerWrap>
        <h3 className="font-semibold text-primary mt-10">Popular Package</h3>
      </ContainerWrap>
      <PopularPackSlide data={data} />
    </div>
  );
};

export default PopularPackage;
