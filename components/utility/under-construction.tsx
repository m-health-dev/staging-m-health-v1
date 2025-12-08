import React from "react";
import ContainerWrap from "./ContainerWrap";
import { Coffee, Construction } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const UnderConstruction = () => {
  return (
    <ContainerWrap>
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="flex flex-col lg:items-center items-start">
          <div className="flex mb-7">
            <Construction className="size-12 text-amber-400 -translate-y-5 -rotate-5" />
            <Coffee className="size-12 text-health rotate-10" />
          </div>
          <h4 className="font-semibold text-primary">
            Something Fresh is Brewing
          </h4>
          <p className="max-w-2xl mt-2 text-muted-foreground lg:text-base! text-sm! lg:text-center text-start">
            Our team is crafting a new experience from the ground up. The page
            isn’t ready yet, but when it is, it’ll be worth the wait. Stay tuned
            for the reveal.
          </p>
          <div className="mt-10">
            <Link href={"/"}>
              <Button className="rounded-full">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </ContainerWrap>
  );
};

export default UnderConstruction;
