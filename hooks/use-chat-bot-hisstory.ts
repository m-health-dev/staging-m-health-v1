"use client";

import useSWR from "swr";
import { getChatHistory } from "@/lib/chatbot/getChatActivity";

export function useChatHistory(publicID: string) {
  const { data, error, isLoading, mutate } = useSWR(
    publicID ? ["chat-history", publicID] : null,
    () => getChatHistory(publicID),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 0,
      dedupingInterval: 2000,
    }
  );

  return {
    history: data?.data || [],
    total: data?.total || 0,
    error,
    isLoading,
    refresh: mutate,
  };
}
