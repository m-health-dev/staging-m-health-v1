"use client";

import { getChatHistoryByUserID } from "@/lib/chatbot/getChatActivity";
import { useEffect, useState } from "react";
import useSWR from "swr";

export function useChatHistory(userID?: string, initialData: any[] = []) {
  const PER_PAGE = 10;
  const INITIAL_LOAD = 20; // Load 20 items on first load

  const [page, setPage] = useState(2); // Start at page 2 since we load 20 initially
  const [allHistory, setAllHistory] = useState<any[]>(initialData);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Initial load of 20 items
  const initialKey =
    userID && isFirstLoad ? ["chat-history-initial", userID] : null;
  const { data: initialLoadData } = useSWR(
    initialKey,
    () => getChatHistoryByUserID(userID!, 1, INITIAL_LOAD),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const key = userID && !isFirstLoad ? ["chat-history", userID, page] : null;

  const { data, error, isLoading } = useSWR(
    key,
    () => getChatHistoryByUserID(userID!, page, PER_PAGE),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  );

  const total = data?.meta.total ?? initialLoadData?.meta.total ?? 0;
  const pageData = data?.data?.data ?? [];
  const initialPageData = initialLoadData?.data?.data ?? [];

  // Handle initial load of 20 items
  useEffect(() => {
    if (initialPageData.length > 0 && isFirstLoad) {
      // Replace all with fresh 20 items (not append to initialData)
      setAllHistory(initialPageData);
      setIsFirstLoad(false);
    }
  }, [initialPageData, isFirstLoad]);

  // Handle subsequent pagination loads
  useEffect(() => {
    if (!pageData.length || isFirstLoad) return;

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

  const hasMore = allHistory.length < total;

  const loadMore = () => {
    if (!isLoading && hasMore && !isFirstLoad) {
      setPage((prev) => prev + 1);
    }
  };

  const refresh = () => {
    if (!userID) return;
    setPage(2);
    setAllHistory([]);
    setIsFirstLoad(true);
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
