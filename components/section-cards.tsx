"use client";

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";

export function SectionCards() {
  const locale = useLocale();
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{locale === routing.defaultLocale ? "Total Pendapatan" : "Total Revenue"}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $1,250.00
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {locale === routing.defaultLocale ? "Naik bulan ini" : "Trending up this month"} <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {locale === routing.defaultLocale ? "Pengunjung 6 bulan terakhir" : "Visitors for the last 6 months"}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{locale === routing.defaultLocale ? "Pelanggan Baru" : "New Customers"}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,234
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {locale === routing.defaultLocale ? "Turun 20% periode ini" : "Down 20% this period"} <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {locale === routing.defaultLocale ? "Akuisisi perlu perhatian" : "Acquisition needs attention"}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{locale === routing.defaultLocale ? "Akun Aktif" : "Active Accounts"}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            45,678
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {locale === routing.defaultLocale ? "Retensi pengguna kuat" : "Strong user retention"} <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">{locale === routing.defaultLocale ? "Keterlibatan melebihi target" : "Engagement exceed targets"}</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{locale === routing.defaultLocale ? "Tingkat Pertumbuhan" : "Growth Rate"}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {locale === routing.defaultLocale ? "Peningkatan performa stabil" : "Steady performance increase"} <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">{locale === routing.defaultLocale ? "Memenuhi proyeksi pertumbuhan" : "Meets growth projections"}</div>
        </CardFooter>
      </Card>
    </div>
  );
}
