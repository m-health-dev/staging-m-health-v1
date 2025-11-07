"use client";

import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import ChatStart from "./ChatStart";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import ContainerWrap from "../utility/ContainerWrap";
import {
  get5ImageEvents,
  get5ImageMedical,
  get5ImageWellness,
} from "@/lib/unsplashImage";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { Spinner } from "../ui/spinner";
import { useResponsiveSidebar } from "@/hooks/ChatSidebar";
import ChatSidebarShowreels from "./ChatSidebarShowreels";

const ChatContent = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useResponsiveSidebar();
  const [showSidebarContent, setShowSidebarContent] = useState(true);

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
          <motion.div
            animate={{ width: isSidebarOpen ? 380 : 0 }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
            style={{ willChange: "width" }}
            className="bg-white 3xl:max-h-[calc(100vh-8vh)] 3xl:min-h-[calc(100vh-8vh)] lg:max-h-[calc(100vh-13.5vh)] lg:min-h-[calc(100vh-13.5vh)] max-h-[calc(100vh-8vh)] min-h-[calc(100vh-8vh)] overflow-y-auto hide-scroll rounded-2xl ml-5 shadow-sm overflow-hidden flex flex-col lg:max-w-5/6 max-w-4/6"
          >
            {/* Header */}
            <div className="px-4 flex justify-between items-start gap-4 md:w-[380px] w-[300px]">
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
                  <ChatSidebarShowreels />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
          <div
            className={`flex flex-col space-y-2 transition-all duration-700 ${
              isSidebarOpen ? "ml-0" : "-ml-2"
            } `}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleSidebar}
                  className="bg-white text-primary rounded-2xl shadow-sm h-12 w-full px-3 flex items-center justify-between transition-all duration-300 relative z-50 pointer-events-auto cursoir-pointer"
                >
                  <ChevronRight
                    className={`${
                      isSidebarOpen ? "rotate-180" : "rotate-0"
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

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-white text-primary rounded-2xl shadow-sm h-12 w-full px-3 flex items-center justify-between transition-all duration-300 relative z-50 pointer-events-auto cursoir-pointer"
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
            </Tooltip>
          </div>
        </div>
      </div>

      <ContainerWrap
        size="xxl"
        className={`md:flex-1 transition-all duration-300 translate-x-0 ${
          !isSidebarOpen ? "lg:-translate-x-10" : "lg:translate-x-0"
        }`}
      >
        <ChatStart isSidebarOpen={isSidebarOpen} />
      </ContainerWrap>
    </div>
  );
};

export default ChatContent;
