import { Skeleton } from "@/components/ui/skeleton";

import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import React from "react";

const LoadingVariant4 = () => {
  return (
    <Wrapper>
      <ContainerWrap className="my-20">
        <Skeleton className="w-full h-32 mb-5 rounded-2xl" />
        <Skeleton className="w-1/2 h-12 mb-20 rounded-2xl" />
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-10">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton
              key={i}
              className="w-full h-auto aspect-video rounded-2xl"
            />
          ))}
        </div>
      </ContainerWrap>
    </Wrapper>
  );
};

export default LoadingVariant4;
