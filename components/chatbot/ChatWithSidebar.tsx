"use client";

import type React from "react";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { ChatbotSidebar } from "./chatbot-sidebar";
import ChatNavHeader from "../utility/header/ChatNavHeader";
import ChatStart from "./ChatStart";
import type { Account } from "@/types/account.types";
import type { MedicalType } from "@/types/medical.types";
import type { WellnessType } from "@/types/wellness.types";
import type { PackageType } from "@/types/packages.types";
import type { Message } from "./ChatWindow";
import { useEffect, useState } from "react";

interface ChatWithSidebarProps {
  sidebarOpen: boolean;
  onSidebarChange: (open: boolean) => void;
  user?: Account;
  packages: PackageType[];
  medical: MedicalType[];
  wellness: WellnessType[];
  history: any[];
  session?: any[];
  sessionID?: string;
  publicID: string | null;
  publicIDFetch?: string;
  isLoading: boolean;
  sidebarDataLoading: boolean;
  onRefreshHistory: () => void;
  locale: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
  displayedCount?: number;
  total?: number;
  labels?: any;
  status?: string;
  shareSlug?: string;
  type?: "default" | "share" | "preview";
  selectedChat: Message[];
  currentSessionID: string | null;
  chatResetKey: number;
  urgent?: boolean;
}

const ChatWithSidebar: React.FC<ChatWithSidebarProps> = ({
  sidebarOpen,
  onSidebarChange,
  user,
  packages,
  medical,
  wellness,
  history,
  session,
  sessionID,
  publicID,
  publicIDFetch,
  isLoading,
  sidebarDataLoading,
  onRefreshHistory,
  locale,
  hasMore,
  onLoadMore,
  displayedCount,
  total,
  labels,
  status,
  shareSlug,
  type,
  selectedChat,
  currentSessionID,
  chatResetKey,
  urgent,
}) => {
  // Manage messages state locally for new chat transitions
  const [localMessages, setLocalMessages] = useState<Message[]>(selectedChat);
  const [newSessionId, setNewSessionId] = useState<string | null>(null);

  // Reset local state when chatResetKey changes (new chat triggered)
  useEffect(() => {
    if (chatResetKey > 0) {
      setLocalMessages([]);
      setNewSessionId(null);
    }
  }, [chatResetKey]);

  // Update local messages when selectedChat changes
  useEffect(() => {
    if (selectedChat.length > 0) {
      setLocalMessages(selectedChat);
    }
  }, [selectedChat]);

  // Determine if this is a new chat or existing conversation
  const hasExistingChat = currentSessionID || (session && session.length > 0);
  const effectiveSessionID = newSessionId || currentSessionID || sessionID;
  const effectiveMessages =
    localMessages.length > 0 ? localMessages : selectedChat;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 82)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      open={sidebarOpen}
      onOpenChange={onSidebarChange}
      defaultOpen={sidebarOpen}
    >
      <ChatbotSidebar
        variant="inset"
        accounts={user}
        packages={packages}
        medical={medical}
        wellness={wellness}
        history={history}
        session={session}
        sessionID={sessionID}
        publicIDFetch={publicID || publicIDFetch || null}
        isLoading={isLoading}
        sidebarDataLoading={sidebarDataLoading}
        onRefreshHistory={onRefreshHistory}
        locale={locale}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        displayedCount={displayedCount}
        total={total}
        labels={labels}
        defaultOpen={sidebarOpen}
      />
      <SidebarInset className="p-0! m-0! ">
        <ChatNavHeader
          sessionId={sessionID}
          status={status}
          shareSlug={shareSlug}
          type={type}
          locale={locale}
        />

        <ChatStart
          key={
            currentSessionID
              ? `session-${currentSessionID}`
              : `new-chat-${chatResetKey}`
          }
          chat={selectedChat}
          session={session}
          sessionID={currentSessionID || undefined}
          publicID={publicID || ""}
          accounts={user}
          onNewMessage={onRefreshHistory}
          status={status}
          urgent={urgent}
          locale={locale}
          type={type}
        />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ChatWithSidebar;
