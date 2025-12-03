import { StudioSidebar } from "@/components/studio-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeaderStudio } from "@/components/site-header-studio";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import data from "./data.json";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { createClient } from "@/utils/supabase/server";
import { getUserInfo } from "@/lib/auth/getUserInfo";
type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function Page({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

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
      <StudioSidebar variant="inset" accounts={userData} />
      <SidebarInset>
        <SiteHeaderStudio accounts={userData} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
