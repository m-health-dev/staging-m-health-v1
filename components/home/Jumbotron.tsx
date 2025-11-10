import { get3Image } from "@/lib/unsplashImage";
import React from "react";
import JumbotronSlide from "./JumbotronSlide";
import ContainerWrap from "../utility/ContainerWrap";
import QuickAction from "./QuickAction";

const Jumbotron = async () => {
  const image = await get3Image();
  return (
    <ContainerWrap size="xl">
      <JumbotronSlide data={image.results} />
      <QuickAction includeSearchBar />
    </ContainerWrap>
  );
};

export default Jumbotron;
