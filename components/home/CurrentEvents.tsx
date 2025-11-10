import React from "react";
import ContainerWrap from "../utility/ContainerWrap";
import { get10ImageEvents } from "@/lib/unsplashImage";
import CurrentEventsGrid from "./CurrentEventsGrid";

const CurrentEvents = async () => {
  const e = await get10ImageEvents();
  return (
    <div className="bg-background pt-[5vh] -mt-[25vh] lg:rounded-t-[5rem] pb-[5vh] rounded-t-4xl">
      <ContainerWrap>
        <h1 className="font-bold text-primary mt-8 mb-20">Current Events</h1>
        <CurrentEventsGrid data={e.results} />
      </ContainerWrap>
    </div>
  );
};

export default CurrentEvents;
