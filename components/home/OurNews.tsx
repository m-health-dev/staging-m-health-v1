import React from "react";
import ContainerWrap from "../utility/ContainerWrap";
import { get10ImageEvents, get5ImageNews } from "@/lib/unsplashImage";
import CurrentEventsGrid from "./CurrentEventsGrid";
import OurNewsGrid from "./OurNewsGrid";

const OurNews = async () => {
  const n = await get5ImageNews();
  return (
    <div className="mt-[5vh] bg-white border-t lg:rounded-t-[5rem] rounded-t-4xl">
      <ContainerWrap className="py-[5vh]">
        <h1 className="font-bold text-primary mt-5 mb-16 text-center">News</h1>
        <OurNewsGrid data={n.results.slice(0, 4)} />
      </ContainerWrap>
      <div className="bg-linear-to-b from-white to-background w-full h-52" />
    </div>
  );
};

export default OurNews;
