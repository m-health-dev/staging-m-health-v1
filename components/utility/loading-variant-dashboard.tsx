import { Skeleton } from "@/components/ui/skeleton";

import ContainerWrap from "@/components/utility/ContainerWrap";
import Wrapper from "@/components/utility/Wrapper";
import React from "react";

const LoadingVariantDashboard = () => {
  return (
    <ContainerWrap className="my-10">
      <Skeleton className="w-full h-28 mb-5 rounded-2xl" />
      <Skeleton className="w-1/2 h-12 mb-20 rounded-2xl" />
      <div className="grid 3xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-full h-auto aspect-video rounded-2xl"
          />
        ))}
      </div>
    </ContainerWrap>
  );
};

export default LoadingVariantDashboard;
