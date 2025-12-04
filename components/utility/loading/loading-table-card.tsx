import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const LoadingTable = ({ count, card }: { count: number; card: boolean }) => {
  return !card ? (
    <div className="space-y-2">
      <div className="flex justify-between items-center gap-2 mb-2">
        <Skeleton className="lg:min-w-sm lg:max-w-sm w-full h-12" />
        <Skeleton className="lg:min-w-xs lg:max-w-xs w-full h-12" />
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="w-full h-12" />
      ))}
    </div>
  ) : (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-2">
        <Skeleton className="lg:min-w-sm lg:max-w-sm w-full h-12" />
        <Skeleton className="lg:min-w-xs lg:max-w-xs w-full h-12" />
      </div>
      <div className="md:grid flex flex-col lg:grid-cols-3 md:grid-cols-2 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="w-full h-76" />
        ))}
      </div>
    </div>
  );
};

export default LoadingTable;
