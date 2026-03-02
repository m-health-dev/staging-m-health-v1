"use client";

import { useEffect, useState, useTransition } from "react";
import { useRealPathname } from "@/hooks/use-real-pathname";
import type { Message } from "@/components/chatbot/ChatWindow";

export function useChatSession(
  session: any[] | undefined,
  sessionID: string | undefined,
  locale: string,
) {
  const [selectedChat, setSelectedChat] = useState<Message[]>(session || []);
  const [isPending, startTransition] = useTransition();
  const [chatResetKey, setChatResetKey] = useState(0);
  const [currentSessionID, setCurrentSessionID] = useState<string | null>(
    sessionID || null,
  );
  const pathname = useRealPathname();

  // Extract sessionID from pathname (used only for navigation detection)
  const pathnameSessionID = pathname.includes("/c/")
    ? pathname.split("/c/")[1]?.split("/")[0] || null
    : null;

  // Check for force new chat on mount
  useEffect(() => {
    const forceNew = window.sessionStorage.getItem("force-new-chat");
    if (forceNew === "true") {
      setSelectedChat([]);
      setCurrentSessionID(null);
      setChatResetKey((prev) => prev + 1);
      window.sessionStorage.removeItem("force-new-chat");
    }
  }, []);

  // Reset chat when navigating
  useEffect(() => {
    const isRootChatPage =
      pathname === `/${locale}` || pathname === `/${locale}/`;

    if (isRootChatPage && !pathnameSessionID) {
      // Force clear chat when at root with no session
      setSelectedChat([]);
      setCurrentSessionID(null);
      setChatResetKey((prev) => prev + 1);
    } else if (session && pathnameSessionID) {
      // Only update currentSessionID when the server has provided actual
      // session data — this avoids resetting the component when ChatStart
      // silently updates the URL via history.replaceState().
      startTransition(() => {
        setSelectedChat(session);
        setCurrentSessionID(pathnameSessionID);
      });
    }
    // When pathnameSessionID exists but session is undefined, it means the
    // URL was updated via replaceState (silent update from ChatStart).
    // Do NOT update currentSessionID so the key on ChatStart stays stable.
  }, [pathname, session, pathnameSessionID, locale]);

  return {
    selectedChat,
    setSelectedChat,
    isPending,
    currentSessionID,
    chatResetKey,
  };
}
