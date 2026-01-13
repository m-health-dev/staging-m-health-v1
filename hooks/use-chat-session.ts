"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import type { Message } from "@/components/chatbot/ChatWindow";

export function useChatSession(
  session: any[] | undefined,
  sessionID: string | undefined,
  locale: string
) {
  const [selectedChat, setSelectedChat] = useState<Message[]>(session || []);
  const [isPending, startTransition] = useTransition();
  const [chatResetKey, setChatResetKey] = useState(0);
  const pathname = usePathname();

  // Extract actual sessionID from pathname
  const currentSessionID = pathname.includes("/c/")
    ? pathname.split("/c/")[1]?.split("/")[0] || null
    : null;

  // Check for force new chat on mount
  useEffect(() => {
    const forceNew = window.sessionStorage.getItem("force-new-chat");
    if (forceNew === "true") {
      setSelectedChat([]);
      setChatResetKey((prev) => prev + 1);
      window.sessionStorage.removeItem("force-new-chat");
    }
  }, []);

  // Reset chat when navigating
  useEffect(() => {
    const isRootChatPage =
      pathname === `/${locale}` || pathname === `/${locale}/`;

    if (isRootChatPage && !currentSessionID) {
      // Force clear chat when at root with no session
      setSelectedChat([]);
      setChatResetKey((prev) => prev + 1);
    } else if (session && currentSessionID) {
      // Load session chat
      startTransition(() => {
        setSelectedChat(session);
      });
    }
  }, [pathname, session, currentSessionID, locale]);

  return {
    selectedChat,
    setSelectedChat,
    isPending,
    currentSessionID,
    chatResetKey,
  };
}
