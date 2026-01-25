"use client";

import type React from "react";
import { useEffect } from "react";
import { usePublicID } from "@/hooks/use-public-id";
import { useChatHistory } from "@/hooks/use-chat-bot-hisstory";
import { useSidebarData } from "@/hooks/use-sidebar-data";
import { useChatSession } from "@/hooks/use-chat-session";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import ChatPreviewMode from "./ChatPreviewMode";
import ChatWithSidebar from "./ChatWithSidebar";
import type { Account } from "@/types/account.types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { routing } from "@/i18n/routing";

const ChatContent = ({
  initialHistory,
  session,
  sessionID,
  userID,
  publicIDFetch,
  locale,
  user,
  urgent,
  type = "default",
  status,
  shareSlug,
  labels,
  consultSession,
}: {
  session?: any[];
  initialHistory?: any[];
  userID?: string;
  sessionID?: string;
  publicIDFetch?: string;
  locale: string;
  user?: Account;
  urgent?: boolean;
  type?: "preview" | "share" | "default";
  status?: string;
  shareSlug?: string;
  labels?: any;
  consultSession?: any;
}) => {
  // Custom hooks for state management
  const { selectedChat, isPending, currentSessionID, chatResetKey } =
    useChatSession(session, sessionID, locale);

  const { sidebarOpen, setSidebarOpen } = useSidebarState();

  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const {
    packages,
    medical,
    wellness,
    isLoading: sidebarLoading,
  } = useSidebarData();

  const { publicID, isLoading: publicIDLoading } = usePublicID(publicIDFetch);

  const {
    history,
    isLoading: historyLoading,
    isLoadingMore,
    refresh,
    loadMore,
    hasMore,
    displayedCount,
    total,
    removeChat,
  } = useChatHistory(user?.id, initialHistory || []);

  // Realtime chat history polling - refresh every 10 seconds
  useEffect(() => {
    if (!publicID) return;

    const interval = setInterval(() => {
      if (!historyLoading) {
        refresh();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [publicID, historyLoading, refresh]);

  const isShowSidebar = type === "default" || type === "share";

  useEffect(() => {
    if (type === "share" && !session) {
      toast.error(
        locale === routing.defaultLocale
          ? "Sesi chat yang dibagikan tidak ditemukan."
          : "Shared chat session not found.",
        {
          duration: 15000,
        },
      );
    }
  }, []);

  // Preview mode
  if (type === "preview") {
    return (
      <ChatPreviewMode
        urgent={urgent}
        locale={locale}
        userID={userID}
        selectedChat={selectedChat}
        session={session}
        sessionID={sessionID}
        publicID={publicID}
        user={user}
        onNewMessage={refresh}
        consultSession={consultSession}
      />
    );
  }

  // Sidebar mode (default and share)
  if (isShowSidebar && history && initialHistory) {
    return (
      <ChatWithSidebar
        sidebarOpen={sidebarOpen}
        onSidebarChange={setSidebarOpen}
        user={user}
        packages={packages}
        medical={medical}
        wellness={wellness}
        history={history.length > 0 ? history : initialHistory}
        session={session}
        sessionID={sessionID}
        publicID={publicID}
        publicIDFetch={publicIDFetch}
        isLoading={historyLoading || isPending || sidebarLoading}
        isLoadingMore={isLoadingMore}
        sidebarDataLoading={sidebarLoading}
        onRefreshHistory={refresh}
        locale={locale}
        hasMore={hasMore}
        onLoadMore={loadMore}
        displayedCount={displayedCount}
        total={total}
        labels={labels}
        status={status}
        shareSlug={shareSlug}
        type={type}
        selectedChat={selectedChat}
        currentSessionID={currentSessionID}
        chatResetKey={chatResetKey}
        urgent={urgent}
        consultSession={consultSession}
        onRemoveChat={removeChat}
      />
    );
  }

  return null;
};

export default ChatContent;
