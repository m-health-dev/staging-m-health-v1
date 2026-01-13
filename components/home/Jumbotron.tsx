import { get3Image } from "@/lib/unsplashImage";
import React from "react";
import JumbotronSlide from "./JumbotronSlide";
import ContainerWrap from "../utility/ContainerWrap";
import QuickAction from "./QuickAction";
import { getAllActiveHero } from "@/lib/hero/get-hero";

const Jumbotron = async () => {
  const { data } = await getAllActiveHero();
  return (
    <>
      <ContainerWrap size="xl">
        <JumbotronSlide data={data} />
        <div className="flex w-full justify-center">
          <div className="max-w-3xl md:block hidden">
            <QuickAction includeSearchBar />
          </div>
          <div className="w-full md:hidden block">
            <QuickAction forPhone includeSearchBar />
          </div>
        </div>
      </ContainerWrap>
    </>
  );
};

export default Jumbotron;
