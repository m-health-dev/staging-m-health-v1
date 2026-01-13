import { Skeleton } from "@/components/ui/skeleton";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function ChatContentSkeleton() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 82)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      defaultOpen={false}
    >
      {/* Sidebar Skeleton */}
      <aside className="hidden lg:flex flex-col w-[var(--sidebar-width)] border-r bg-white p-4 space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-10 w-full rounded-full" />
        <Skeleton className="h-10 w-full rounded-full" />
        <div className="space-y-3 mt-4">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <SidebarInset className="p-0 m-0">
        {/* Header Skeleton */}
        <nav className="sticky top-0 px-5 bg-background z-99">
          <header className="py-5 flex items-center w-full justify-between gap-5">
            <Skeleton className="h-10 w-32" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-20 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </header>
        </nav>

        {/* Chat Content Skeleton */}
        <div className="justify-center items-center min-h-[70vh] flex px-4">
          <div className="flex flex-col items-center max-w-3xl w-full space-y-6">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-8 w-1/2" />

            {/* Quick Actions Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full mt-8">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>

            {/* Input Skeleton */}
            <div className="w-full mt-10">
              <Skeleton className="h-16 w-full rounded-full" />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
