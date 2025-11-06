"use client";

import { useEffect, useRef, useState } from "react";
import ContainerWrap from "../utility/ContainerWrap";
import { ArrowRight, ArrowUp } from "lucide-react";
import { Input } from "../ui/input";
import ChatWindow from "./ChatWindow";
import { chatDeepseek } from "@/lib/deepseekAI";
import { Textarea } from "../ui/textarea";
import dayjs from "dayjs";
import Link from "next/link";

interface Message {
  id: string;
  message: string;
  sender: "user" | "bot";
  timestamp: string;
}

const ChatStart = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChat, setHasChat] = useState(false);

  const [text, setText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-adjust tinggi textarea sesuai isi
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [text]);

  // Deteksi panjang teks dan ubah style
  useEffect(() => {
    if (text.length > 50) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [text]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && text.trim()) {
      e.preventDefault();
      handleSendMessage(text);
      setText("");
    }
  };

  const handleSendMessage = async (userMessage: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      message: userMessage,
      sender: "user",
      timestamp: `${new Date()}`,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setHasChat(true);

    try {
      const data = await chatDeepseek(userMessage);

      console.log(data);

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        message:
          data.message || "Maaf, saya tidak dapat memproses pertanyaan Anda.",
        sender: "bot",
        timestamp: `${new Date()}`,
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("[v0] Error sending message:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        message: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        sender: "bot",
        timestamp: `${new Date()}`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (hasChat) {
    return (
      <ChatWindow
        isSidebarOpen={isSidebarOpen}
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    );
  }

  return (
    <>
      <div className="justify-center items-center max-h-[calc(100vh-15vh)] min-h-[calc(100vh-15vh)] flex">
        <div className="flex flex-col lg:items-center">
          <div className="start_conversation mb-16 lg:text-center text-start">
            <h2 className="text-primary font-bold mb-2 wrap-break-word">
              Sedang nggak enak badan?
            </h2>
            <h3 className="text-primary">Tenang, aku di sini buat bantu</h3>
          </div>
          <div className="quicklinks flex flex-wrap w-full items-center lg:justify-center md:space-y-0 space-y-3 md:space-x-3 space-x-0 mb-5 lg:scale-95">
            <Link href={`/medical`} className="group">
              <button className="cursor-pointer pointer-events-auto bg-white py-1.5 pl-2 pr-3 rounded-full inline-flex lg:w-fit w-full gap-3 items-center shadow-sm group-hover:bg-primary transition-all duration-300">
                <div className="bg-background w-10 h-10 rounded-full flex items-center justify-center text-primary">
                  <ArrowRight className="-rotate-45 group-hover:rotate-0 transition-all duration-300" />
                </div>
                <p className="text-primary font-medium text-[18px] group-hover:text-white transition-all duration-300">
                  Paket Medis
                </p>
              </button>
            </Link>
            <Link href={`/wellness`} className="group">
              <button className="cursor-pointer pointer-events-auto bg-white py-1.5 pl-2 pr-3 rounded-full inline-flex lg:w-fit w-full gap-3 items-center shadow-sm group-hover:bg-primary transition-all duration-300">
                <div className="bg-background w-10 h-10 rounded-full flex items-center justify-center text-primary">
                  <ArrowRight className="-rotate-45 group-hover:rotate-0 transition-all duration-300" />
                </div>
                <p className="text-primary font-medium text-[18px] group-hover:text-white transition-all duration-300">
                  Paket Kesehatan
                </p>
              </button>
            </Link>
            <Link href={`/events`} className="group">
              <button className="cursor-pointer pointer-events-auto bg-white py-1.5 pl-2 pr-3 rounded-full inline-flex lg:w-fit w-full gap-3 items-center shadow-sm group-hover:bg-primary transition-all duration-300">
                <div className="bg-background w-10 h-10 rounded-full flex items-center justify-center text-primary">
                  <ArrowRight className="-rotate-45 group-hover:rotate-0 transition-all duration-300" />
                </div>
                <p className="text-primary font-medium text-[18px] group-hover:text-white transition-all duration-300">
                  Acara Terbaru
                </p>
              </button>
            </Link>
          </div>
          <div className="input_conversation lg:w-3xl w-full lg:mt-0 mt-10">
            <div className="flex w-full justify-center">
              <div className="relative w-full max-w-3xl h-auto">
                <Textarea
                  placeholder="Jangan ragu untuk tanyakan apapun."
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      handleSendMessage(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                  disabled={isLoading}
                  className={`hide-scroll overflow-y-auto resize-none bg-white px-5 py-5 min-h-16 max-h-40 border-0 focus-visible:ring-0 placeholder:font-sans placeholder:text-base! font-sans text-base! placeholder:text-primary/50 shadow-sm disabled:opacity-50 transition-all duration-300 ${
                    isExpanded ? "rounded-2xl" : "rounded-full"
                  }`}
                />
                <button className="absolute right-3 bottom-2.5 text-primary cursor-pointer bg-background rounded-full p-3 hover:opacity-70 disabled:opacity-50 transition-opacity">
                  <ArrowUp className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatStart;
