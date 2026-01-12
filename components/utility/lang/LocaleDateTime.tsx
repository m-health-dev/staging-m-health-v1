"use client";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/id";
import "dayjs/locale/en";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function LocalDateTime({
  date,
  specificFormat,
}: {
  date: string | Date;
  specificFormat?: string;
}) {
  const params = useParams<{ locale: string }>();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering on client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with consistent format during SSR
    return (
      <span suppressHydrationWarning>{dayjs(date).format("DD MMM YYYY")}</span>
    );
  }

  let formattedDate: string;

  if (params.locale === "id") {
    // Indonesia → WIB (Asia/Jakarta, UTC+7)
    formattedDate = dayjs(date)
      .tz("Asia/Jakarta")
      .locale("id")
      .format(specificFormat || "dddd, DD MMMM YYYY - HH:mm WIB");
  } else {
    // English → Pacific Time (America/Los_Angeles)
    formattedDate = dayjs(date)
      .tz("UTC")
      .locale("en")
      .format(specificFormat || "dddd,DD MMMM YYYY - HH:mm UTC");
  }

  return <span suppressHydrationWarning>{formattedDate}</span>;
}
