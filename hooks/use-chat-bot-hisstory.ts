"use client";

import { getChatHistoryByUserID } from "@/lib/chatbot/getChatActivity";
import { useCallback, useEffect, useRef, useState } from "react";

export function useChatHistory(userID?: string, initialData: any[] = []) {
  const PER_PAGE = 25;
  // const INITIAL_LOAD = 50;

  const [page, setPage] = useState(1);
  const [allHistory, setAllHistory] = useState<any[]>(initialData);
  const [total, setTotal] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  // Track if initial data was already loaded to prevent re-fetching
  const initialLoadDone = useRef(false);
  const isMounted = useRef(true);

  // Initial load - only once
  useEffect(() => {
    if (!userID || initialLoadDone.current) return;

    const loadInitial = async () => {
      try {
        setIsInitialLoading(true);
        const result = await getChatHistoryByUserID(userID, 1, PER_PAGE);
        setPage(2);

        if (!isMounted.current) return;

        const items = result?.data?.data ?? [];
        setAllHistory(items);
        setTotal(result?.meta?.total ?? 0);
        initialLoadDone.current = true;
      } catch (err) {
        if (isMounted.current) {
          setError(err);
        }
      } finally {
        if (isMounted.current) {
          setIsInitialLoading(false);
        }
      }
    };

    // If initialData is provided, use it and skip fetch
    if (initialData.length > 0) {
      setAllHistory(initialData);
      initialLoadDone.current = true;
      setIsInitialLoading(false);
    } else {
      loadInitial();
    }

    return () => {
      isMounted.current = false;
    };
  }, [userID]);

  // Load more function for infinite scroll
  const loadMore = useCallback(async () => {
    if (!userID || isLoadingMore || isInitialLoading) return;
    if (total !== 0 && allHistory.length >= total) return;

    try {
      setIsLoadingMore(true);
      const result = await getChatHistoryByUserID(userID, page, PER_PAGE);
      setPage((p) => p + 1);

      if (!isMounted.current) return;

      const newItems = result?.data?.data ?? [];

      if (newItems.length > 0) {
        setAllHistory((prev) => {
          // Dedupe by id
          const existingIds = new Set(prev.map((item) => item.id));
          const uniqueNewItems = newItems.filter(
            (item: { id: string }) => !existingIds.has(item.id),
          );
          return [...prev, ...uniqueNewItems];
        });
        setPage((p) => p + 1);
      }

      setTotal(result?.meta?.total ?? 0);
    } catch (err) {
      if (isMounted.current) {
        setError(err);
      }
    } finally {
      if (isMounted.current) {
        setIsLoadingMore(false);
      }
    }
  }, [userID, page, isLoadingMore, allHistory.length, total]);

  // Add new chat to the top (for real-time updates)
  const addNewChat = useCallback((newChat: any) => {
    setAllHistory((prev) => {
      // Check if already exists
      if (prev.some((item) => item.id === newChat.id)) {
        return prev;
      }
      return [newChat, ...prev];
    });
    setTotal((t) => t + 1);
  }, []);

  // Refresh only fetches newest items and prepends them
  const refresh = useCallback(async () => {
    if (!userID) return;

    try {
      // Only fetch first page to check for new items
      const result = await getChatHistoryByUserID(userID, 1, PER_PAGE);

      if (!isMounted.current) return;

      const newItems = result?.data?.data ?? [];

      setAllHistory((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const uniqueNewItems = newItems.filter(
          (item: { id: string }) => !existingIds.has(item.id),
        );

        if (uniqueNewItems.length > 0) {
          return [...uniqueNewItems, ...prev];
        }
        return prev;
      });

      setTotal(result?.meta?.total ?? 0);
    } catch (err) {
      console.error("Failed to refresh chat history:", err);
    }
  }, [userID, total]);

  const removeChat = useCallback((id: string) => {
    setAllHistory((prev) => prev.filter((item) => item.id !== id));
    setTotal((t) => Math.max(0, t - 1));
  }, []);

  const hasMore = !isInitialLoading && total > 0 && allHistory.length < total;

  // console.log({ hasMore });

  return {
    history: allHistory,
    total,
    error,
    isLoading: isInitialLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    refresh,
    addNewChat,
    currentPage: page,
    displayedCount: allHistory.length,
    removeChat,
  };
}
