import { Skeleton } from "@/components/ui/skeleton";
import ContainerWrap from "@/components/utility/ContainerWrap";

export function PopularPackageSkeleton() {
  return (
    <ContainerWrap className="py-12">
      <div className="space-y-6">
        <Skeleton className="h-18 lg:w-1/2 w-full" />
        <Skeleton className="h-10 lg:w-1/3 w-full" />
        <div className="grid 3xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-[380px] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </ContainerWrap>
  );
}

export function PopularProgramSkeleton() {
  return (
    <ContainerWrap className="py-12">
      <div className="space-y-6">
        <Skeleton className="h-18 lg:w-1/2 w-full" />
        <Skeleton className="h-10 lg:w-1/3 w-full" />
        <div className="grid 3xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-[380px] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </ContainerWrap>
  );
}

export function PopularMedicalSkeleton() {
  return (
    <ContainerWrap className="py-12">
      <div className="space-y-6">
        <Skeleton className="h-18 lg:w-1/2 w-full" />
        <Skeleton className="h-10 lg:w-1/3 w-full" />
        <div className="grid 3xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-[380px] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </ContainerWrap>
  );
}

export function CurrentEventsSkeleton() {
  return (
    <ContainerWrap className="py-12">
      <div className="space-y-6">
        <Skeleton className="h-18 lg:w-1/2 w-full" />
        <Skeleton className="h-10 lg:w-1/3 w-full" />
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[250px] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </ContainerWrap>
  );
}

export function OurNewsSkeleton() {
  return (
    <ContainerWrap className="py-12">
      <div className="space-y-6">
        <Skeleton className="h-18 lg:w-1/2 w-full" />
        <Skeleton className="h-10 lg:w-1/3 w-full" />
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[380px] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </ContainerWrap>
  );
}
