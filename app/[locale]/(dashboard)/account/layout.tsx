import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import ContainerWrap from "@/components/utility/ContainerWrap";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { SiteHeaderDashboard } from "@/components/site-header-dashboard";
import { createClient } from "@/utils/supabase/server";
import { getUserInfo } from "@/lib/auth/getUserInfo";
import type { Metadata } from "next";
type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: "Account Settings - M HEALTH",
};

export default async function Page({ children }: Props) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <div className="p-6 text-red-600 font-medium">
        Failed to get user session
      </div>
    );
  }

  const userData = await getUserInfo(session?.access_token);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <DashboardSidebar variant="inset" accounts={userData} />
      <SidebarInset className="p-0! m-0! rounded-none!">
        <SiteHeaderDashboard accounts={userData} />
        <ContainerWrap size="xxl">{children}</ContainerWrap>
      </SidebarInset>
    </SidebarProvider>
  );
}
