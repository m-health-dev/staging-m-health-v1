"use client";

import {
  ChevronDown,
  ChevronRight,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import ChatStart from "./ChatStart";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import ContainerWrap from "../utility/ContainerWrap";

import { useResponsiveSidebar } from "@/hooks/ChatSidebar";
import ChatSidebarShowreels from "./ChatSidebarShowreels";
import { Message } from "./ChatWindow";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { nanoid } from "nanoid";

const ChatContent = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useResponsiveSidebar();
  const [showSidebarContent, setShowSidebarContent] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const [selectedChat, setSelectedChat] = useState<Message[]>([]);

  const [openSheet, setOpenSheet] = useState(false);

  const handleSelectChat = (chatId: string) => {
    const allChats = JSON.parse(
      localStorage.getItem("mhealth_chat_sessions") || "[]"
    );
    const selected = allChats.find((c: any) => c.id === chatId);
    if (selected) {
      setSelectedChat(selected.messages);
    }
  };

  // const handleSelectChat = (id: string) => {
  //   setSelectedChatId(id);
  // };

  // const handleNewChat = () => {
  //   setSelectedChatId(null); // mulai baru
  // };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!isSidebarOpen) {
      // Saat tutup: hilangkan konten dulu
      setShowSidebarContent(false);
      // Setelah 400ms (fade out selesai), baru tutup sidebar
      timer = setTimeout(() => {
        setIsSidebarOpen(false);
      }, 400);
    }

    return () => clearTimeout(timer);
  }, [isSidebarOpen]);

  const startNewChat = () => {
    const newId = nanoid();
    localStorage.setItem("mhealth_active_chat_id", newId);
  };

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
    <div className="flex lg:flex-row flex-col lg:flex-wrap lg:min-h-[calc(100vh-13.5vh)] 3xl:min-h-[calc(100vh-8vh)]">
      <div className="lg:flex hidden">
        <div className="flex flex-row items-start gap-2">
          <motion.nav
            animate={{ width: isSidebarOpen ? 380 : 0 }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
            style={{ willChange: "width" }}
            className="print:hidden bg-transparent 3xl:max-h-[calc(100vh-8vh)] 3xl:min-h-[calc(100vh-8vh)] lg:max-h-[calc(100vh-13.5vh)] lg:min-h-[calc(100vh-13.5vh)] max-h-[calc(100vh-8vh)] min-h-[calc(100vh-8vh)] overflow-y-auto hide-scroll ml-5 overflow-hidden flex flex-col lg:max-w-5/6 max-w-4/6"
          >
            {/* Header */}
            <div className="flex justify-between items-start gap-4 md:w-[380px] w-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key="sidebar-content"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.3, // ⏱️ delay 1 detik sebelum muncul
                    ease: "easeOut",
                  }}
                  className="flex flex-col"
                >
                  <ChatSidebarShowreels onSelectChat={handleSelectChat} />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.nav>
          <div
            className={`flex flex-col space-y-2 transition-all duration-700 ${
              isSidebarOpen ? "ml-0" : "-ml-2"
            } `}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleSidebar}
                  className="bg-white text-primary border rounded-2xl shadow-sm h-12 w-full px-3 flex items-center justify-between transition-all duration-300 relative z-50 pointer-events-auto cursoir-pointer"
                >
                  <PanelRightOpen
                    className={`${
                      isSidebarOpen ? "rotate-0" : "rotate-180"
                    } transition-all duration-500`}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-white text-primary font-medium"
              >
                <p>{isSidebarOpen ? "Tutup Menu" : "Buka Menu"}</p>
              </TooltipContent>
            </Tooltip>

            {/* <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    window.location.reload(), startNewChat();
                  }}
                  className="bg-white text-primary border rounded-2xl shadow-sm h-12 w-full px-3 flex items-center justify-between transition-all duration-300 relative z-50 pointer-events-auto cursoir-pointer"
                >
                  <Plus />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-white text-primary font-medium"
              >
                <p>Mulai Obrolan Baru</p>
              </TooltipContent>
            </Tooltip> */}
          </div>
        </div>
      </div>
      <div className="lg:hidden flex bg-transparent fixed z-10 top-26 left-3 w-full">
        <div
          className={`flex flex-row justify-between w-[calc(100%-7%)] space-x-2 transition-all duration-700 bg-transparent!`}
        >
          <Sheet open={openSheet}>
            <SheetTrigger>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="bg-white border border-primary/20 text-primary rounded-full shadow-sm h-12 w-12 px-3 flex items-center justify-between transition-all duration-300 z-50 pointer-events-auto cursoir-pointer"
                    onClick={() => setOpenSheet(true)}
                  >
                    <PanelLeftOpen />
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-white text-primary font-medium"
                >
                  <p>{"Buka Menu"}</p>
                </TooltipContent>
              </Tooltip>
            </SheetTrigger>
            <SheetContent side="left" className="p-3 bg-white z-999">
              <SheetTitle />
              <SheetClose
                className="flex items-center justify-end pointer-events-auto gap-2 cursor-pointer -mt-3"
                onClick={() => setOpenSheet(false)}
              >
                <h4 className="text-primary font-extrabold">Tutup</h4>
                <div className="text-primary bg-background p-2 rounded-full">
                  <X />
                </div>
              </SheetClose>
              <div className="flex flex-col space-y-7 overflow-y-scroll hide-scroll">
                <ChatSidebarShowreels
                  onSelectChat={handleSelectChat}
                  setOpenSheet={setOpenSheet} // ✅ kirim fungsi setter
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <ContainerWrap
        size="xxl"
        className={`md:flex-1 transition-all bg-transparent duration-300 translate-x-0 overflow-hidden ${
          !isSidebarOpen ? "lg:-translate-x-8" : "lg:-translate-x-5"
        }`}
      >
        <ChatStart chat={selectedChat} />
      </ContainerWrap>
    </div>
  );
};

export default ChatContent;
