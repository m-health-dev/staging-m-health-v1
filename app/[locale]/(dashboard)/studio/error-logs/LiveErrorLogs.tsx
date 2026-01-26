"use client";
import React, { useEffect, useState, useRef } from "react";
import { Studio1DataTable } from "@/components/package-wellness-medical/studio-1-data-table";
import { Switch } from "@/components/ui/switch";
import { TransactionType } from "@/types/transaction.types";
import { columns } from "./columns";
import { ChevronDown, ChevronRight, Database } from "lucide-react";
import { routing } from "@/i18n/routing";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface LiveErrorLogsProps {
  initialData: any[];
  meta: any;
  links: any;
  locale: string;
  page?: number;
  per_page?: number;
}

const LiveErrorLogs: React.FC<LiveErrorLogsProps> = ({
  initialData,
  meta,
  links,
  locale,
  page,
  per_page,
}) => {
  const [live, setLive] = useState(false);
  const [data, setData] = useState<any[]>(initialData);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (live) {
      intervalRef.current = setInterval(async () => {
        try {
          setLoading(true);
          const res = await fetch(
            `/api/live/log-errors?page=${page}&per_page=${per_page}`,
          );
          if (res.ok) {
            const json = await res.json();
            setData(json.data ?? []);
            setLoading(false);
          }
        } catch (e) {
          // Optionally handle error
        }
      }, 5000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [live]);

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Switch checked={live} onCheckedChange={setLive} id="live-switch" />
        <label
          htmlFor="live-switch"
          className={cn(
            "text-sm font-sans inline-flex items-center gap-1",
            loading && "animate-pulse",
          )}
        >
          Live Updates {loading && <Spinner className="size-4" />}
        </label>
      </div>
      <div className="summary bg-white p-4 rounded-2xl border mb-4 flex flex-wrap gap-4 items-center">
        <p className="text-sm! text-muted-foreground inline-flex gap-2 items-center bg-accent px-3 py-1 rounded-xl">
          <Database className="size-4" />
          <span>
            {locale === routing.defaultLocale
              ? "Ringkasan Data"
              : "Data Summary"}
          </span>
        </p>
        <p className="font-light text-sm! text-muted-foreground">
          <ChevronRight className="size-4 lg:flex hidden" />
          <ChevronDown className="size-4 lg:hidden flex" />
        </p>
        <div className="flex flex-wrap gap-4 items-center">
          <p className=" bg-teal-300 rounded-xl px-3 py-1 text-sm! w-fit">
            {meta.total} Logs
          </p>
        </div>
      </div>
      <Studio1DataTable
        columns={columns}
        data={data}
        meta={meta}
        links={links}
        type="error-logs"
        locale={locale}
      />
    </>
  );
};

export default LiveErrorLogs;
