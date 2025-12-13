"use client";

import type React from "react";

import { useEffect, useState, useTransition } from "react";
import ChatStart from "./ChatStart";
import type { Message } from "./ChatWindow";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { ChatbotSidebar } from "./chatbot-sidebar";
import type { Account } from "@/types/account.types";
import type { MedicalType } from "@/types/medical.types";
import type { WellnessType } from "@/types/wellness.types";
import type { PackageType } from "@/types/packages.types";
import NavHeader from "../utility/header/NavHeader";
import { usePublicID } from "@/hooks/use-public-id";
import { useChatHistory } from "@/hooks/use-chat-bot-hisstory";

const ChatContent = ({
  packages,
  medical,
  wellness,
  initialHistory,
  session,
  sessionID,
  publicIDFetch,
  locale,
  user,
}: {
  packages: PackageType[];
  medical: MedicalType[];
  wellness: WellnessType[];
  session?: any[];
  initialHistory: any[];
  sessionID?: string;
  publicIDFetch?: string;
  locale: string;
  user?: Account;
}) => {
  const [selectedChat, setSelectedChat] = useState<Message[]>(session || []);
  const [isPending, startTransition] = useTransition();

  const { publicID, isLoading: publicIDLoading } = usePublicID(publicIDFetch);

  const {
    history,
    isLoading: historyLoading,
    refresh,
  } = useChatHistory(publicID);

  useEffect(() => {
    startTransition(() => {
      setSelectedChat(session || []);
    });
  }, [session]);

  if (publicIDLoading) {
    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 82)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <ChatbotSidebar
          variant="inset"
          accounts={user}
          packages={packages}
          medical={medical}
          wellness={wellness}
          history={initialHistory}
          session={session}
          sessionID={sessionID}
          publicIDFetch={publicID}
          isLoading={true}
          locale={locale}
          onRefreshHistory={refresh}
        />
        <SidebarInset className="p-0 m-0 flex flex-col">
          <NavHeader />
          <div className="flex items-center justify-center flex-1">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 82)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <ChatbotSidebar
        variant="inset"
        accounts={user}
        packages={packages}
        medical={medical}
        wellness={wellness}
        history={history.length > 0 ? history : initialHistory}
        session={session}
        sessionID={sessionID}
        publicIDFetch={publicID}
        isLoading={historyLoading || isPending}
        onRefreshHistory={refresh}
        locale={locale}
      />
      <SidebarInset className="p-0 m-0 flex flex-col">
        <NavHeader />
        <ChatStart
          chat={selectedChat}
          session={session}
          sessionID={sessionID}
          publicID={publicID}
          accounts={user}
          onNewMessage={refresh}
        />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ChatContent;
