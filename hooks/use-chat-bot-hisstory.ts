"use client";

import { getChatHistoryByUserID } from "@/lib/chatbot/getChatActivity";
import { useEffect, useState } from "react";
import useSWR from "swr";

export function useChatHistory(userID?: string, initialData: any[] = []) {
  const PER_PAGE = 10;

  const [page, setPage] = useState(1);
  // const [history, setHistory] = useState(initialData);
  const [allHistory, setAllHistory] = useState<any[]>(initialData);

  const key = userID ? ["chat-history", userID, page] : null;

  const { data, error, isLoading } = useSWR(
    key,
    () => getChatHistoryByUserID(userID!, page, PER_PAGE),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  );

  const total = data?.meta.total ?? 0;
  const pageData = data?.data?.data ?? [];

  useEffect(() => {
    if (!pageData.length) return;

    setAllHistory((prev) => {
      // 🔒 dedupe by id
      const map = new Map<string, any>();

      // data lama dulu (terbaru di atas)
      prev.forEach((item) => map.set(item.id, item));

      // data baru (lebih lama) → bawah
      pageData.forEach((item: { id: string }) => {
        if (!map.has(item.id)) {
          map.set(item.id, item);
        }
      });

      return Array.from(map.values());
    });
  }, [pageData]);

  const hasMore = page * PER_PAGE < total;

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const refresh = () => {
    if (!userID) return;
    setPage(1);
    setAllHistory([]);
  };

  return {
    history: allHistory,
    total,
    error,
    isLoading,
    hasMore,
    loadMore,
    refresh,
    currentPage: page,
    displayedCount: allHistory.length,
  };
}
