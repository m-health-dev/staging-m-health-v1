import { get3Image } from "@/lib/unsplashImage";
import React from "react";
import JumbotronSlide from "./JumbotronSlide";
import ContainerWrap from "../utility/ContainerWrap";
import QuickAction from "./QuickAction";
import { getAllActiveHero } from "@/lib/hero/get-hero";

const Jumbotron = async () => {
  const image = await get3Image();
  const { data } = await getAllActiveHero();
  return (
    <ContainerWrap size="xl">
      <JumbotronSlide data={data} />
      <QuickAction includeSearchBar />
    </ContainerWrap>
  );
};

export default Jumbotron;
