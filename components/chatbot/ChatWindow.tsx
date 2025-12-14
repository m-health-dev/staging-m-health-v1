"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import { ArrowUp } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Spinner } from "../ui/spinner";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import type { Account } from "@/types/account.types";
import { usePathname, useRouter } from "next/navigation";

export interface Message {
  id: string;
  message: string;
  sender: "user" | "bot";
  timestamp: string;
  replyTo?: {
    message?: string | null;
    sender?: string | null;
  };
  urgent?: boolean;
}

interface ChatWindowProps {
  messages: Message[];
  accounts?: Account;
  onSendMessage: (message: string, replyTo?: string | null) => void;
  isLoading?: boolean;
  sessionId?: string;
  pendingSessionId?: string | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  accounts,
  onSendMessage,
  sessionId,
  isLoading = false,
  pendingSessionId,
}) => {
  const locale = useLocale();
  const [inputValue, setInputValue] = useState("");
  const [replyMessage, setReplyMessage] = useState<string | null>(null);
  // const [isExpanded, setIsExpanded] = useState(false);
  // const [isRouting, setIsRouting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const path = usePathname();

  const isRouting = useMemo(() => {
    if (!pendingSessionId) return false;

    const expectedPath = `/${locale}/c/${pendingSessionId}`;
    return path !== expectedPath;
  }, [pendingSessionId, path, locale]);

  const showLoading = isLoading || isRouting;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [inputValue]);

  const isExpanded = inputValue.length > 40 || inputValue.includes("\n");

  // useEffect(() => {
  //   if (!sessionId) return;

  //   const expectedPath = `/${locale}/c/${sessionId}`;

  //   if (path !== expectedPath) {
  //     setIsRouting(true);
  //   } else {
  //     setIsRouting(false);
  //   }
  // }, [path, sessionId, locale]);

  useEffect(() => {
    if (!accounts && messages.length > 3) {
      router.replace(
        `/${locale}/sign-in?redirect=${encodeURIComponent(path)}&continue=chat`
      );
    }
  }, [accounts, messages.length, router, locale, path]);

  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [messages.length]);

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue, replyMessage ?? null);
      setInputValue("");
      setReplyMessage(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      return; // biarkan newline
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReply = (message: string) => {
    setReplyMessage(message);
    textareaRef.current?.focus();
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const active = document.activeElement;
      if (
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          (active as HTMLElement).isContentEditable)
      ) {
        return;
      }

      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key.length === 1) {
        textarea.focus();

        const start = textarea.selectionStart ?? textarea.value.length;
        const end = textarea.selectionEnd ?? textarea.value.length;

        textarea.value =
          textarea.value.slice(0, start) + e.key + textarea.value.slice(end);

        const pos = start + 1;
        textarea.setSelectionRange(pos, pos);

        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  return (
    <div className="relative flex flex-col h-[calc(100vh-var(--header-height))]">
      <div className="flex-1 overflow-y-auto hide-scroll pb-4">
        <div className="w-full max-w-4xl mx-auto px-2 lg:px-6">
          <div className="py-6">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center min-h-[60vh]">
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
                    sessionId={sessionId}
                    urgent={msg.urgent}
                  />
                ))}
                {showLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.3s]" />
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.6s]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-10" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm z-20">
        <div className="w-full max-w-4xl mx-auto px-2 lg:px-6">
          <div className="py-3">
            {replyMessage && (
              <div className="bg-white/80 p-4 rounded-2xl mb-2 flex justify-between items-start shadow-sm border border-border animate-in slide-in-from-bottom-2">
                <div className="max-w-[85%]">
                  <p className="text-sm font-bold text-primary mb-1 flex items-center gap-2">
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

            <div className="flex w-full">
              <div
                className={`flex w-full bg-white border border-border shadow-sm transition-all duration-200 ${
                  isExpanded
                    ? "flex-col rounded-2xl px-2 pt-2 pb-2 items-end"
                    : "flex-row rounded-2xl pl-2 pr-3 py-2 max-h-16 items-center"
                }`}
              >
                <Textarea
                  ref={textareaRef}
                  placeholder={
                    locale === routing.defaultLocale
                      ? "Ketik pertanyaanmu di sini..."
                      : "Type your question here..."
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className={`flex-1 resize-none border-0 shadow-none rounded-none wrap-anywhere bg-transparent text-primary placeholder:text-primary/50 focus-visible:ring-0 focus:outline-none hide-scroll transition-all duration-300 leading-relaxed ${
                    isExpanded
                      ? "max-h-52 py-2 text-base"
                      : "min-h-12 text-base py-3"
                  }`}
                />
                <button
                  onClick={handleSend}
                  disabled={showLoading || !inputValue.trim()}
                  className={`ml-2 shrink-0 flex items-center justify-center rounded-full transition-all duration-300 ${
                    showLoading || !inputValue.trim()
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary/90 active:scale-95"
                  } w-11 h-11`}
                >
                  {showLoading ? (
                    <Spinner className="size-5" />
                  ) : (
                    <ArrowUp className="size-5" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs! text-muted-foreground mt-2 text-center">
              {locale === routing.defaultLocale
                ? "M-Health AI dapat membuat kesalahan. Periksa info penting."
                : "M HEALTH AI can make mistakes. Check important information."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
