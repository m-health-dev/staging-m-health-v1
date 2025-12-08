"use client";

import { Suspense, useEffect, useState } from "react";
import ChatStart from "./ChatStart";
import ContainerWrap from "../utility/ContainerWrap";

import { useResponsiveSidebar } from "@/hooks/ChatSidebar";

import { Message } from "./ChatWindow";

import { getChatHistory } from "@/lib/chatbot/getChatActivity";

import NavHeader from "../utility/header/NavHeader";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { ChatbotSidebar } from "./chatbot-sidebar";
import { Account } from "@/types/account.types";
import { MedicalType } from "@/types/medical.types";
import { WellnessType } from "@/types/wellness.types";
import { PackageType } from "@/types/packages.types";

const ChatContent = ({
  packages,
  medical,
  wellness,
  history,
  session,
  sessionID,
  publicIDFetch,
  user,
}: {
  packages: PackageType[];
  medical: MedicalType[];
  wellness: WellnessType[];
  session?: any[];
  history: any[];
  sessionID?: string;
  publicIDFetch: string;
  user?: Account;
}) => {
  const { isSidebarOpen, setIsSidebarOpen } = useResponsiveSidebar();
  const [showSidebarContent, setShowSidebarContent] = useState(true);

  // State chat yang sedang aktif
  const [selectedChat, setSelectedChat] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [publicID, setPublicID] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPublicID() {
      try {
        const res = await fetch("/api/public-id");
        const data = await res.json();
        setPublicID(data.publicID);
      } catch (err) {
        console.error("Failed to fetch Public ID:", err);
      }
    }

    fetchPublicID();
  }, []);

  useEffect(() => {
    if (!publicID) return;

    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const historyData = await getChatHistory(publicID);
        setChatHistory(historyData.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 60000);
    return () => clearInterval(interval);
  }, [publicID]);

  useEffect(() => {
    if (session) {
      setSelectedChat(session);
    } else if (!session) {
      setSelectedChat([]);
    }
  }, [session]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!isSidebarOpen) {
      setShowSidebarContent(false);
      timer = setTimeout(() => {
        setIsSidebarOpen(false);
      }, 400);
    }

    return () => clearTimeout(timer);
  }, [isSidebarOpen]);

  // Handler toggle
  const toggleSidebar = () => {
    if (isSidebarOpen) {
      // Saat menutup → jalankan urutan di atas
      setShowSidebarContent(false);
      setIsSidebarOpen(false);
    } else {
      // Saat membuka → buka lebar dulu baru isi muncul
      setIsSidebarOpen(true);
      setShowSidebarContent(true);
    }
  };

  return (
    <>
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
          history={chatHistory}
          session={session}
          sessionID={sessionID}
          publicIDFetch={publicID!}
          isLoading={isLoading}
        />
        <SidebarInset className="p-0! m-0! ">
          <NavHeader />
          <ContainerWrap size="xxl">
            <ChatStart
              chat={selectedChat}
              session={session}
              sessionID={sessionID}
              publicID={publicID!}
              accounts={user}
            />
          </ContainerWrap>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default ChatContent;
