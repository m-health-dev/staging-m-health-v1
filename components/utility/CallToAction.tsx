import React from "react";
import ContainerWrap from "./ContainerWrap";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <>
      <ContainerWrap>
        <div className="flex flex-col justify-center items-center h-[50vh]">
          <h1 className="font-extrabold text-primary">
            Explore the World,{" "}
            <span className="text-health">Restore Your Health</span>
          </h1>
          <h4 className="font-medium mt-4 text-muted-foreground">
            M Health - Wellness & Healing, Anytime, Anywhere
          </h4>
        </div>
      </ContainerWrap>
      <div className="bg-linear-to-b from-background to-white w-full h-52" />
    </>
  );
};

export default CallToAction;
