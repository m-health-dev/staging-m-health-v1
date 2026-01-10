import { Skeleton } from "@/components/ui/skeleton";

import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import React from "react";

const LoadingVariant5 = () => {
  return (
    <Wrapper>
      <ContainerWrap className="mt-10">
        <Skeleton className="w-full h-auto aspect-20/7 mb-5 rounded-2xl" />
        <Skeleton className="w-3/4 h-32 mx-auto mb-5 rounded-2xl" />
      </ContainerWrap>

      <ContainerWrap size="md" className="mt-10 mb-20">
        <Skeleton className="w-full h-18 mb-5 rounded-2xl" />
        <Skeleton className="w-full h-12 mb-5 rounded-2xl" />
        <Skeleton className="w-full h-32 mb-5 rounded-2xl" />
        <Skeleton className="w-1/2 h-32 mb-5 rounded-2xl" />
        <Skeleton className="w-3/4 h-32 mb-5 rounded-2xl" />
        <Skeleton className="w-1/2 h-32 mb-5 rounded-2xl" />
        <Skeleton className="w-full h-32 mb-5 rounded-2xl" />
        <div className="mt-10 grid lg:grid-cols-3 grid-cols-1 gap-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className="aspect-video w-full h-auto rounded-2xl"
            />
          ))}
        </div>
      </ContainerWrap>
    </Wrapper>
  );
};

export default LoadingVariant5;
