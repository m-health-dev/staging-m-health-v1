"use client";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/id";
import "dayjs/locale/en";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { routing } from "@/i18n/routing";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function LocalDateTime({
  date,
  specificFormat,
  withSeconds,
}: {
  date: string | Date;
  specificFormat?: string;
  withSeconds?: boolean;
}) {
  const params = useParams<{ locale: string }>();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering on client
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with consistent format during SSR
    return (
      <span suppressHydrationWarning>{dayjs(date).format("DD MMM YYYY")}</span>
    );
  }

  let formattedDate: string;

  if (params.locale === routing.defaultLocale) {
    // Indonesia → WIB (Asia/Jakarta, UTC+7)
    formattedDate = dayjs(date)
      .tz("Asia/Jakarta")
      .locale("id")
      .format(
        specificFormat ||
          (withSeconds
            ? "dddd, DD MMMM YYYY - HH:mm:ss WIB"
            : "dddd, DD MMMM YYYY - HH:mm WIB"),
      );
  } else {
    // English → Pacific Time (America/Los_Angeles)
    formattedDate = dayjs(date)
      .tz("UTC")
      .locale("en")
      .format(
        specificFormat ||
          (withSeconds
            ? "dddd, DD MMMM YYYY - HH:mm:ss UTC"
            : "dddd, DD MMMM YYYY - HH:mm UTC"),
      );
  }

  return <span suppressHydrationWarning>{formattedDate}</span>;
}
