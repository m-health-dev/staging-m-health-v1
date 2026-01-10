import { Skeleton } from "@/components/ui/skeleton";

import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import React from "react";

const LoadingVariant1 = () => {
  return (
    <Wrapper>
      <ContainerWrap className="grid lg:grid-cols-8 grid-cols-1 gap-5 my-20">
        <div className="lg:col-span-2">
          <Skeleton className="w-full h-auto aspect-square rounded-2xl" />
        </div>
        <div className="lg:col-span-4 space-y-5">
          <Skeleton className="w-32 h-12 rounded-2xl" />
          <Skeleton className="w-full h-32 rounded-2xl" />
          <Skeleton className="w-1/2 h-20 rounded-2xl" />
          <Skeleton className="w-full h-12 rounded-2xl" />
          <Skeleton className="w-full h-12 rounded-2xl" />
          <Skeleton className="w-full h-12 rounded-2xl" />
          <Skeleton className="w-full h-12 rounded-2xl" />
          <Skeleton className="w-3/4 h-12 rounded-2xl" />
          <Skeleton className="w-1/2 h-12 rounded-2xl" />
          <Skeleton className="w-full h-12 rounded-2xl" />
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="w-full h-auto aspect-video rounded-2xl" />
        </div>
      </ContainerWrap>
    </Wrapper>
  );
};

export default LoadingVariant1;
