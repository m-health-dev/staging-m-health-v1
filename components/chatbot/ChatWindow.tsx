"use client";

import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import { ArrowUp, Plus, Undo2 } from "lucide-react";
import { Input } from "../ui/input";
import ContainerWrap from "../utility/ContainerWrap";
import { Textarea } from "../ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Spinner } from "../ui/spinner";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { Account } from "@/types/account.types";
import { usePathname, useRouter } from "next/navigation";

export interface Message {
  id: string;
  message: string;
  sender: "user" | "bot";
  timestamp: string;
  replyTo?: string | null;
}

interface ChatWindowProps {
  messages: Message[];
  accounts?: Account;
  onSendMessage: (message: string, replyTo?: string | null) => void; // ✅ izinkan 2 argumen
  isLoading?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  accounts,
  onSendMessage,
  isLoading = false,
}) => {
  const locale = useLocale();
  const [inputValue, setInputValue] = React.useState("");
  const [isHandleReply, setIsHandleReply] = React.useState(false);
  const [replyMessage, setReplyMessage] = React.useState<string | null>(null);

  const messageStartRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [scrollToMessageId, setScrollToMessageId] = useState<string | null>(
    null
  );

  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [inputValue]);

  useEffect(() => {
    setIsExpanded(inputValue.length > 40);
  }, [inputValue]);

  useEffect(() => {
    if (!accounts && messages.length > 3) {
      router.replace(
        `/${locale}/sign-in?redirect=${encodeURIComponent(path)}&continue=chat`
      );
    }
  });

  // useEffect(() => {
  //   messageStartRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      setShouldScrollToBottom(true); // ⬅️ scroll ke bawah
      onSendMessage(inputValue, replyMessage ?? null);
      setInputValue("");
      setReplyMessage(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 🟢 Fungsi baru untuk menerima pesan dari tombol Reply

  const handleReply = (message: string) => {
    setReplyMessage(message);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    // Skenario 1: Scroll ke pesan tertentu (misal saat reply)
    if (scrollToMessageId) {
      const el = document.getElementById(scrollToMessageId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Skenario 2: Scroll ke paling bawah (pesan baru)
    if (shouldScrollToBottom) {
      // Ubah target ke messagesEndRef
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, scrollToMessageId, shouldScrollToBottom]); // Tambahkan dependencies yang benar

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg) return;

    if (lastMsg.sender === "bot" && lastMsg.replyTo) {
      setShouldScrollToBottom(false);
      setScrollToMessageId(lastMsg.replyTo);
    } else {
      setShouldScrollToBottom(true);
      setScrollToMessageId(null);
    }
  }, [messages]);

  return (
    <div className="overflow-y-auto flex flex-col items-center hide-scroll">
      <div className="flex flex-col min-h-[calc(100vh-15vh)] max-h-[calc(100vh-15vh)] w-full">
        {/* <div className="h-16 w-full bg-linear-to-b from-background fixed top-22 z-10"></div> */}
        <div className="container mx-auto lg:max-w-4xl w-full lg:px-6">
          {/* Messages Container */}
          <div className="flex-1 min-h-[calc(100vh-10vh)] max-h-[calc(100vh-10vh)] lg:px-10">
            {/* <div>
              <p className="lg:text-sm! text-xs! text-muted-foreground/50 text-center mb-10 mt-2">
                {locale === routing.defaultLocale
                  ? "Kami menggunakan cookies agar tetap terhubung. Anda dapat menggunakan Health AI Assistant ini untuk mencari tahu tentang permasalahan kesehatan anda secara gratis."
                  : "We use cookies to stay connected. You can use this Health AI Assistant to find out about your health issues for free."}
              </p>
            </div> */}
            {/* <div ref={messageStartRef} /> */}
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">
                  {locale === routing.defaultLocale
                    ? "Mulai Percakapan Baru"
                    : "Start New Chat"}
                </p>
              </div>
            ) : (
              <div className="space-y-10">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    id={msg.id}
                    message={msg.message}
                    sender={msg.sender}
                    timestamp={msg.timestamp}
                    onReply={handleReply}
                    replyTo={msg.replyTo}
                  />
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce delay-100" />
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
            <div className="pb-[10vh]" />
          </div>
        </div>
        {/* <div className="h-16 w-full bg-linear-to-t from-background fixed bottom-30 z-10"></div> */}
      </div>
      {/* Input Area */}
      <div
        className={`absolute bottom-0 bg-background lg:border-t-0 border-t border-primary/10 w-full z-10 lg:px-10 px-3`}
      >
        <div
          className={`flex  w-full justify-center transition-all duration-300`}
        >
          <div className="relative w-full max-w-3xl h-auto bg-background pt-3">
            {replyMessage && (
              <div className="bg-white/80 p-4 rounded-2xl mb-1 flex justify-between items-start shadow-sm border border-border">
                <div className="max-w-[85%]">
                  <p className="text-sm! font-bold text-primary mb-1 flex items-center gap-2">
                    <Undo2 className="size-4" />{" "}
                    {locale === routing.defaultLocale
                      ? "Membalas Pesan:"
                      : "Replying To:"}
                  </p>
                  <p className="text-muted-foreground line-clamp-2">
                    {replyMessage}
                  </p>
                </div>
                <button
                  onClick={() => setReplyMessage(null)}
                  className="text-xs text-muted-foreground hover:text-foreground transition"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="input_conversation lg:w-3xl w-full">
              <div className="flex w-full justify-center">
                <div
                  className={`flex w-full max-w-3xl bg-white border border-border shadow-sm transform-content ${
                    isExpanded
                      ? "flex-col rounded-2xl px-2 pt-2 pb-2 items-end"
                      : "flex-row rounded-2xl pl-2 pr-3 py-2 max-h-16 items-center"
                  }`}
                >
                  <Textarea
                    ref={textareaRef}
                    placeholder="Ketik pertanyaanmu di sini..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={isLoading}
                    className={`flex-1 resize-none border-0 shadow-none rounded-none wrap-anywhere bg-transparent text-primary placeholder:text-primary/50 focus-visible:ring-0 focus:outline-none hide-scroll transition-all duration-300 leading-relaxed ${
                      isExpanded
                        ? "max-h-52 py-2 text-base"
                        : "min-h-12 text-base py-3"
                    }`}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !inputValue.trim()}
                    className={`ml-2 shrink-0 flex items-center justify-center rounded-full transition-all duration-300 ${
                      isLoading || !inputValue.trim()
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-primary text-white hover:bg-primary/90"
                    } ${isExpanded ? "w-11 h-11" : "w-11 h-11"}`}
                  >
                    {isLoading ? <Spinner /> : <ArrowUp className="size-5" />}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs! text-muted-foreground my-2 text-center">
                {locale === routing.defaultLocale
                  ? "M-Health AI can make mistakes. Check important information."
                  : "M-Health AI dapat membuat kesalahan. Periksa info penting."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
