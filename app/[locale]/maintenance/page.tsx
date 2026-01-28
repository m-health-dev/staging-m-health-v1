import ContainerWrap from "@/components/utility/ContainerWrap";
import { routing } from "@/i18n/routing";
import { Settings } from "lucide-react";
import { getLocale } from "next-intl/server";
import React from "react";

const MaintenanceMode = async () => {
  const locale = await getLocale();
  return (
    <div className="bg-white min-h-screen w-full">
      <ContainerWrap
        size="md"
        className="flex justify-center items-center flex-col min-h-screen w-full"
      >
        <div className="space-y-4 flex items-center flex-col">
          <Settings className="mx-auto h-10 w-10 text-primary animate-pulse" />
          <h4 className="text-primary font-semibold text-center">
            {locale === routing.defaultLocale
              ? "Sedang Pemeliharaan"
              : "Under Maintenance"}
          </h4>
          <p className="text-muted-foreground text-center max-w-3/5">
            {locale === routing.defaultLocale
              ? "Saat ini kami sedang dalam tahap pemeliharaan demi memberikan pengalaman yang terbaik untuk kamu."
              : "We are currently undergoing maintenance stage to provide the best experience for you."}
          </p>
        </div>
      </ContainerWrap>{" "}
    </div>
  );
};

export default MaintenanceMode;
