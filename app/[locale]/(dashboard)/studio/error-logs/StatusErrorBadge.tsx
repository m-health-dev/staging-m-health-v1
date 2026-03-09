"use client";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { da } from "date-fns/locale";
import { Check, ClipboardClock, SearchCheck, Settings } from "lucide-react";

import React, { useState, useEffect } from "react";

const statusCache: Record<string, any> = {};

export function invalidateStatusCache(id: string) {
  delete statusCache[id];
}

const StatusErrorBadge = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setData(null);
        setLoading(false);
        return;
      }

      const key = `${id}`;

      // kalau sudah ada di cache → langsung pakai
      if (statusCache[key]) {
        setData(statusCache[key]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        let res = null;

        const supabase = await createClient();
        res = await supabase
          .from("errors")
          .select("status")
          .eq("id", id)
          .maybeSingle();

        const result = res ?? null;

        statusCache[key] = result; // simpan cache
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const interval = setInterval(() => {
      // hapus cache agar selalu ambil data terbaru
      delete statusCache[`${id}`];
      loadData();
    }, 15_000);

    return () => clearInterval(interval);
  }, [id]);

  return data?.data?.status === "recorded" ||
    data?.data?.status === "acknowledge" ||
    data?.data?.status === "maintenance" ||
    data?.data?.status === "resolved" ? (
    <span
      className={cn(
        "capitalize py-1 px-2 rounded-full text-xs! border inline-flex items-center gap-1 font-sans",
        loading && "animate-pulse",
        data?.data?.status === "recorded"
          ? "bg-gray-100 text-gray-700 hover:text-gray-700 border-gray-400 hover:bg-gray-200"
          : data?.data?.status === "acknowledge"
            ? "bg-yellow-100 text-yellow-700 hover:text-yellow-700 border-yellow-400 hover:bg-yellow-200"
            : data?.data?.status === "maintenance"
              ? "bg-blue-100 text-blue-700 hover:text-blue-700 border-blue-400 hover:bg-blue-200"
              : data?.data?.status === "resolved"
                ? "bg-green-100 text-green-700 hover:text-green-700 border-green-400 hover:bg-green-200"
                : "bg-gray-100 text-gray-700 hover:text-gray-700 border-gray-400 hover:bg-gray-200",
      )}
    >
      {data?.data?.status === "recorded" && (
        <ClipboardClock className="size-3" />
      )}
      {data?.data?.status === "acknowledge" && (
        <SearchCheck className="size-3" />
      )}
      {data?.data?.status === "maintenance" && <Settings className="size-3" />}
      {data?.data?.status === "resolved" && <Check className="size-3" />}
      {loading && <Spinner className="size-3" />}
      {loading ? "Loading..." : data.data.status || "Unknown Status"}
    </span>
  ) : (
    <span
      className={cn(
        "capitalize py-1 px-2 rounded-full text-xs! border inline-flex items-center gap-1 font-sans",
        loading && "animate-pulse",
      )}
    >
      {loading && <Spinner className="size-3" />}
      {loading ? "Loading..." : "Unknown Status"}
    </span>
  );
};

export default StatusErrorBadge;
