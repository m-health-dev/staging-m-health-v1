"use client";

import ContainerWrap from "@/components/utility/ContainerWrap";
import { routing } from "@/i18n/routing";
import { Settings, Telescope, Unplug, Wrench } from "lucide-react";
import { getLocale } from "next-intl/server";
import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import { motion, Variants } from "motion/react";
import { useLocale } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { getCurrentTime } from "@/lib/time/get-current-time";
import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import { getMaintenanceStatus } from "@/lib/maintenance/get-maintenance-status";

const wiggle: Variants = {
  animate: {
    rotate: [0, -6, 6, -4, 4, 0],
    x: [0, -2, 2, -1, 1, 0],
    transition: {
      duration: 4, // pelan biar calm
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 0.5, // ada jeda biar nggak capek dilihat
    },
  },
};

const MaintenanceMode = () => {
  const locale = useLocale();

  const params = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = React.useState(false);
  const [time, setTime] = React.useState("");
  const [geoData, setGeoData] = useState<{ ip: string; geo: any } | null>(null);
  const [loading, setLoading] = useState(true);

  const [maintenance, setMaintenance] = useState<boolean | null>(null);

  const redirectData = params.get("redirect");

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const runCycle = async () => {
      setStatus(true);

      // spinner hilang setelah 5 detik
      setTimeout(() => setStatus(false), 5000);

      try {
        const statusData = (await getMaintenanceStatus()).status;
        setMaintenance(statusData);

        const response = await fetch("/api/geo");
        const responseTime = await getCurrentTime();
        if (responseTime) setTime(responseTime);

        if (response.ok) {
          const data = await response.json();
          setGeoData(data);
        }

        // ✅ keputusan pakai data langsung
        if (statusData === false) {
          const target = redirectData
            ? redirectData.startsWith("/")
              ? redirectData
              : `/${redirectData}`
            : `/${locale}/home`;

          if (typeof window !== "undefined") {
            window.location.replace(target);
          } else {
            router.replace(target);
          }

          return;
        }

        // kalau masih maintenance → ulang lagi 10 detik
        timer = setTimeout(runCycle, 30000);
      } catch (err) {
        console.error(err);
        timer = setTimeout(runCycle, 30000);
      }
    };

    runCycle();

    return () => clearTimeout(timer);
  }, [redirectData, locale, router]);

  return (
    <div className="bg-white min-h-screen w-full">
      <div>
        <Image
          src={"/batik_2.jpg"}
          fill
          className="w-full min-h-screen object-cover opacity-2.5 absolute top-0 left-0 h-32 -full bg-repeat"
          alt="M-HEALTH Logo"
        />
      </div>
      <ContainerWrap
        size="md"
        className="flex justify-center lg:items-center items-start flex-col min-h-screen w-full"
      >
        <div className="space-y-4 flex lg:items-center items-start flex-col">
          <div className="mb-10">
            <Image
              src={
                "https://hoocfkzapbmnldwmedrq.supabase.co/storage/v1/object/public/m-health-public/static/mhealth_logo.PNG"
              }
              width={140}
              height={60}
              className="object-contain"
              alt="M-HEALTH Logo"
            />
          </div>
          <h4 className="text-primary font-semibold lg:text-center">
            {locale === routing.defaultLocale
              ? "Sedang Pemeliharaan"
              : "Under Maintenance"}
          </h4>
          <p className="text-muted-foreground lg:text-center lg:max-w-3/5 w-full lg:text-base! text-sm!">
            {locale === routing.defaultLocale
              ? "Saat ini kami sedang dalam tahap pemeliharaan demi memberikan pengalaman yang terbaik untuk kamu. Kami akan segera kembali."
              : "We are currently undergoing maintenance stage to provide the best experience for you. We will be back shortly."}
          </p>
        </div>
        {/* <div className="inline-flex gap-3 mt-10">
          <motion.div variants={wiggle} animate="animate">
            <Telescope className="mx-auto h-6 w-6 text-health" />
          </motion.div>

          <Settings className="mx-auto h-6 w-6 text-health  animate-[spin_20s_linear_infinite]" />

          <Unplug className="mx-auto h-6 w-6 text-health animate-[pulse_3s_linear_infinite]" />
        </div> */}

        <div
          className={cn(
            "mt-10 inline-flex gap-1 text-muted-foreground items-center transition-all duration-300 p-1",
            status
              ? "opacity-100 translate-y-0 bg-gray-50 rounded-full"
              : "opacity-0 translate-y-2",
          )}
        >
          <Spinner className="text-muted-foreground " />
          <p className="text-sm! line-clamp-1">
            {locale === routing.defaultLocale
              ? "Memeriksa Status Pemeliharaan"
              : "Checking Maintenance Status"}
          </p>{" "}
        </div>
      </ContainerWrap>{" "}
      <div className="absolute bottom-0 flex w-full px-4">
        <div className="flex w-full lg:justify-center justify-start lg:items-center items-start py-10">
          <p className="text-xs! text-muted-foreground lg:text-center text-start">
            {/* {maintenance
              ? "Maintenance Mode Active"
              : "Maintenance Mode Inactive"}
            <br /> */}
            {geoData?.geo.cfray ?? "N/A"}, {geoData?.geo.cfcountry ?? "N/A"}{" "}
            <br />
            <LocalDateTime
              date={time}
              specificFormat={
                locale === routing.defaultLocale
                  ? "DD MMMM YYYY, HH:mm:ss WIB"
                  : "MMMM DD, YYYY, HH:mm:ss UTC"
              }
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMode;
