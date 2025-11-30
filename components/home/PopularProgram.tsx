import {
  get5Image,
  get5ImageMedical,
  get5ImageWellness,
} from "@/lib/unsplashImage";
import React from "react";
import PopularPackSlide from "./PopularPackSlide";
import ContainerWrap from "../utility/ContainerWrap";
import PopularProgramGrid from "./PopularProgramGrid";

const PopularProgram = async () => {
  const wellness = await get5ImageWellness();
  const medical = await get5ImageMedical();
  const random = await get5Image();
  const data = [...wellness.results, ...random.results];
  return (
    <div className="bg-primary pt-[5vh] pb-[30vh] mt-[7vh] lg:rounded-t-[5rem] rounded-t-4xl">
      <ContainerWrap>
        <h1 className="font-bold text-white pt-[2vh] pb-[6vh]">
          Popular Program
        </h1>
        <PopularProgramGrid data={data} />
      </ContainerWrap>
    </div>
  );
};

export default PopularProgram;
