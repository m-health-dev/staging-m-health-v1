import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BreadcrumbAuto from "./utility/BreadcrumbsAuto";
import { NavUser } from "./nav-user";
import { Account } from "@/types/account.types";
import { useLocale } from "next-intl";
import Link from "next/link";

export function SiteHeaderStudio({ accounts }: { accounts: Account }) {
  const locale = useLocale();
  return (
    <header className="flex h-20 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-20">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Link href={`/${locale}/studio`}>
          <h4 className="text-base font-bold text-primary">Studio</h4>
        </Link>
        <div className="max-w-xs ml-auto">
          <NavUser user={accounts} locale={locale} type="header" />
        </div>
      </div>
    </header>
  );
}
