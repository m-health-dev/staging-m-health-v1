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
import LoadingComponent from "../utility/loading-component";
import { useChatHistory } from "@/hooks/use-chat-bot-hisstory";
import { Stethoscope } from "lucide-react";
import { routing } from "@/i18n/routing";

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
  urgent,
  type = "default",
  status,
}: {
  packages?: PackageType[];
  medical?: MedicalType[];
  wellness?: WellnessType[];
  session?: any[];
  initialHistory?: any[];
  sessionID?: string;
  publicIDFetch?: string;
  locale: string;
  user?: Account;
  urgent?: boolean;
  type?: "preview" | "default";
  status?: string;
}) => {
  const [selectedChat, setSelectedChat] = useState<Message[]>(session || []);
  const [isPending, startTransition] = useTransition();

  const { publicID, isLoading: publicIDLoading } = usePublicID(publicIDFetch);

  useEffect(() => {
    if (publicID) {
      refresh();
    }
  }, [publicID]);

  const {
    history,
    isLoading: historyLoading,
    refresh,
    loadMore,
    hasMore,
    displayedCount,
    total,
  } = useChatHistory(publicID);

  // console.log("[v0] Chat history:", {
  //   historyLength: history.length,
  //   total,
  //   hasMore,
  //   displayedCount,
  // });

  useEffect(() => {
    startTransition(() => {
      setSelectedChat(session || []);
    });
  }, [session]);

  if (
    publicIDLoading &&
    packages &&
    medical &&
    wellness &&
    history &&
    initialHistory
  ) {
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
          isLoading={true}
          locale={locale}
          onRefreshHistory={refresh}
        />
        <SidebarInset className="p-0! m-0! flex flex-col">
          <NavHeader />
          <div className="flex items-center justify-center flex-1">
            <LoadingComponent />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (type === "preview") {
    return (
      <>
        {urgent && (
          <div className="w-full max-w-4xl mx-auto px-2 lg:px-6 sticky top-24 z-50">
            <div className="bg-green-50 text-green-600 border border-green-600 rounded-2xl p-4 flex flex-row items-center gap-4">
              <div className="w-6! h-6! bg-white rounded-full border border-green-600 text-green-600 flex justify-center items-center">
                <Stethoscope className="size-3 w-6" />
              </div>
              <p className="text-sm!">
                {locale === routing.defaultLocale
                  ? "Sebagian informasi, dalam percakapan ini AI menyarankan untuk berkonsultasi dengan dokter agar mendapatkan penanganan yang tepat."
                  : "For your information, in this conversation, AI recommends consulting a doctor for appropriate treatment."}
              </p>
            </div>
          </div>
        )}
        <ChatStart
          chat={selectedChat}
          type="preview"
          session={session}
          sessionID={sessionID}
          publicID={publicID}
          accounts={user}
          onNewMessage={refresh}
        />
      </>
    );
  }

  if (
    type === "default" &&
    packages &&
    medical &&
    wellness &&
    history &&
    initialHistory
  ) {
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
          hasMore={hasMore}
          onLoadMore={loadMore}
          displayedCount={displayedCount}
          total={total}
        />
        <SidebarInset className="p-0! m-0! flex flex-col">
          <NavHeader />
          {urgent && (
            <div className="w-full max-w-4xl mx-auto px-2 lg:px-6 sticky top-24 z-50">
              <div className="bg-green-50 text-green-600 border border-green-600 rounded-2xl p-4 flex flex-row items-center gap-4">
                <div className="w-6! h-6! bg-white rounded-full border border-green-600 text-green-600 flex justify-center items-center">
                  <Stethoscope className="size-3 w-6" />
                </div>
                <p className="text-sm!">
                  {locale === routing.defaultLocale
                    ? "Sebagian informasi, dalam percakapan ini AI menyarankan untuk berkonsultasi dengan dokter agar mendapatkan penanganan yang tepat."
                    : "For your information, in this conversation, AI recommends consulting a doctor for appropriate treatment."}
                </p>
              </div>
            </div>
          )}
          <ChatStart
            chat={selectedChat}
            session={session}
            sessionID={sessionID}
            publicID={publicID}
            accounts={user}
            onNewMessage={refresh}
            status={status}
          />
        </SidebarInset>
      </SidebarProvider>
    );
  }
};

export default ChatContent;
