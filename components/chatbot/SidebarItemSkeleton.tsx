import { Skeleton } from "@/components/ui/skeleton";

export default function SidebarItemSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-3 items-center rounded-xl py-2 mb-4"
        >
          <div className="px-2 col-span-1">
            <Skeleton className="aspect-square w-full rounded-xl" />
          </div>
          <div className="col-span-2 pr-3 space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </>
  );
}
