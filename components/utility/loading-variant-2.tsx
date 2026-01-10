import { Skeleton } from "@/components/ui/skeleton";

import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import React from "react";

const LoadingVariant2 = () => {
  return (
    <Wrapper>
      <ContainerWrap size="lg" className="mt-10 mb-10">
        <div className="space-y-5">
          <Skeleton className="w-1/2 h-12 rounded-2xl" />
          <Skeleton className="w-full h-32 rounded-2xl" />
          <Skeleton className="w-3/4 h-20 rounded-2xl" />
          <Skeleton className="w-1/2 h-20 rounded-2xl" />
        </div>
      </ContainerWrap>
      <ContainerWrap className="mb-10">
        <div>
          <Skeleton className="w-full h-auto aspect-video rounded-2xl" />
        </div>
      </ContainerWrap>
      <ContainerWrap size="lg">
        <div className="space-y-5">
          <Skeleton className="w-full h-12 rounded-2xl" />
          <Skeleton className="w-full h-12 rounded-2xl" />
          <Skeleton className="w-full h-12 rounded-2xl" />
          <Skeleton className="w-full h-12 rounded-2xl" />
          <Skeleton className="w-3/4 h-12 rounded-2xl" />
          <Skeleton className="w-1/2 h-12 rounded-2xl" />
          <Skeleton className="w-full h-12 rounded-2xl" />
        </div>
      </ContainerWrap>
    </Wrapper>
  );
};

export default LoadingVariant2;
