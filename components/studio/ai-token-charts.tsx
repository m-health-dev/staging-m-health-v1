"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { routing } from "@/i18n/routing";

type DailyStat = {
  date: string;
  total_tokens: number;
  request_count: number;
};

type ModelStat = {
  model_version: string;
  total_tokens: number;
  request_count: number;
};

const dailyChartConfig = {
  total_tokens: {
    label: "Total Tokens",
    color: "#3e77ab",
  },
  request_count: {
    label: "Requests",
    color: "#22b26e",
  },
} satisfies ChartConfig;

const modelChartConfig = {
  total_tokens: {
    label: "Total Tokens",
    color: "#3e77ab",
  },
  request_count: {
    label: "Requests",
    color: "#22b26e",
  },
} satisfies ChartConfig;

export function DailyTokenChart({
  data,
  locale,
}: {
  data: DailyStat[];
  locale: string;
}) {
  const [range, setRange] = React.useState("30");

  // Sort by date ascending and slice by range
  const sortedData = React.useMemo(() => {
    const sorted = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const count = parseInt(range);
    return sorted.slice(-count);
  }, [data, range]);

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-0 pb-4">
        <div>
          <h6 className="font-semibold text-primary">
            {locale === routing.defaultLocale
              ? "Statistik Penggunaan Harian"
              : "Daily Token Usage Statistics"}
          </h6>
          <p className="text-xs! text-muted-foreground">
            {locale === routing.defaultLocale
              ? `Menampilkan ${sortedData.length} hari terakhir`
              : `Showing last ${sortedData.length} days`}
          </p>
        </div>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[140px] rounded-full text-xs h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">
              {locale === routing.defaultLocale ? "7 Hari" : "7 Days"}
            </SelectItem>
            <SelectItem value="14">
              {locale === routing.defaultLocale ? "14 Hari" : "14 Days"}
            </SelectItem>
            <SelectItem value="30">
              {locale === routing.defaultLocale ? "30 Hari" : "30 Days"}
            </SelectItem>
            <SelectItem value="90">
              {locale === routing.defaultLocale ? "90 Hari" : "90 Days"}
            </SelectItem>
            <SelectItem value={String(data.length)}>
              {locale === routing.defaultLocale ? "Semua" : "All"}
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-0">
        <ChartContainer
          config={dailyChartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <AreaChart data={sortedData}>
            <defs>
              <linearGradient id="fillTokens" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3e77ab" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3e77ab" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="fillRequests" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22b26e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22b26e" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString(
                  locale === routing.defaultLocale ? "id-ID" : "en-US",
                  { month: "short", day: "numeric" },
                );
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString(
                      locale === routing.defaultLocale ? "id-ID" : "en-US",
                      {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    );
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="total_tokens"
              type="monotone"
              fill="url(#fillTokens)"
              stroke="#3e77ab"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="request_count"
              type="monotone"
              fill="url(#fillRequests)"
              stroke="#22b26e"
              strokeWidth={2}
              stackId="b"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function ModelUsageChart({
  data,
  locale,
}: {
  data: ModelStat[];
  locale: string;
}) {
  // Format model names for display
  const chartData = React.useMemo(() => {
    return data.map((stat) => ({
      ...stat,
      name: stat.model_version.replaceAll("-", " "),
    }));
  }, [data]);

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="px-0 pb-4">
        <div>
          <h6 className="font-semibold text-primary">
            {locale === routing.defaultLocale
              ? "Statistik Penggunaan Model"
              : "Model Usage Statistics"}
          </h6>
          <p className="text-xs! text-muted-foreground">
            {locale === routing.defaultLocale
              ? `${chartData.length} model digunakan`
              : `${chartData.length} models used`}
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <ChartContainer
          config={modelChartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              width={120}
              tickFormatter={(value) => {
                // Capitalize first letter of each word, truncate if long
                const text = String(value);
                return text.length > 16 ? text.slice(0, 16) + "…" : text;
              }}
              className="text-xs capitalize"
            />
            <XAxis type="number" hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(value) => {
                    return String(value)
                      .split(" ")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ");
                  }}
                />
              }
            />
            <Bar
              dataKey="total_tokens"
              fill="#3e77ab"
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
            <Bar
              dataKey="request_count"
              fill="#22b26e"
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
