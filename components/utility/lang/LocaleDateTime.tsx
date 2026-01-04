"use client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/id";
import "dayjs/locale/en";
import { useLocale } from "next-intl";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function LocalDateTime({
  date,
  specificFormat,
}: {
  date: string | Date;
  specificFormat?: string;
}) {
  let formattedDate: string;
  const locale = useLocale();

  if (locale === "id") {
    // Indonesia → WIB (Asia/Jakarta, UTC+7)
    formattedDate = dayjs(date)
      .tz("Asia/Jakarta")
      .locale("id")
      .format(specificFormat || "DD MMMM YYYY - HH:mm");
  } else {
    // English → Pacific Time (America/Los_Angeles)
    formattedDate = dayjs(date)
      .tz("UTC")
      .locale("en")
      .format(specificFormat || "DD MMMM YYYY - HH:mm UTC");
  }

  return <span>{formattedDate}</span>;
}
