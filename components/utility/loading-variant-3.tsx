import { Skeleton } from "@/components/ui/skeleton";

import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import React from "react";

const LoadingVariant3 = () => {
  return (
    <Wrapper>
      <ContainerWrap className="my-20">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-10">
          <Skeleton className="w-full h-auto aspect-square rounded-2xl" />
          <div className="space-y-5">
            <Skeleton className="w-full h-12 aspect-square rounded-2xl" />
            <Skeleton className="w-1/2 h-12 aspect-square rounded-2xl" />
            <Skeleton className="w-3/4 h-12 aspect-square rounded-2xl" />
            <Skeleton className="w-full h-12 aspect-square rounded-2xl" />
          </div>
        </div>
      </ContainerWrap>
    </Wrapper>
  );
};

export default LoadingVariant3;
