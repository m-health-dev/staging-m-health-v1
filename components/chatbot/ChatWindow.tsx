"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import { ArrowUp, Eye, EyeClosed, ScanEye, Stethoscope } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Spinner } from "../ui/spinner";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import type { Account } from "@/types/account.types";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { SetChatStatus } from "@/lib/chatbot/chat-status";
import { toast } from "sonner";
import { Toggle } from "../ui/toggle";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import SignInClient from "@/app/[locale]/(auth)/sign-in/SignIn-Client";
import { set } from "zod";

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
  type?: "default" | "preview" | "share";
  status?: string;
  urgent?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  accounts,
  onSendMessage,
  sessionId,
  isLoading = false,
  pendingSessionId,
  type = "default",
  status,
  urgent,
}) => {
  const locale = useLocale();
  const [inputValue, setInputValue] = useState("");
  const [replyMessage, setReplyMessage] = useState<string | null>(null);
  const [dialogSignIn, setDialogSignIn] = useState(false);
  const [hasSignedIn, setHasSignedIn] = useState(false);

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
  const isNotRedirect = type !== "share";

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
    if (
      !accounts &&
      !hasSignedIn &&
      messages.length > 5 &&
      type !== "preview" &&
      isNotRedirect
    ) {
      setDialogSignIn(true);
    } else {
      setDialogSignIn(false);
    }
  }, [accounts, hasSignedIn, messages.length, type, isNotRedirect]);

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
    if (e.key === "Enter" && e.shiftKey && !isLoading) {
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

  const isShowInput = type === "preview" || type === "share";

  return (
    <div className="relative flex flex-col min-h-screen">
      <Dialog open={dialogSignIn}>
        <DialogContent
          className="bg-white rounded-2xl px-5 lg:min-w-4xl lg:max-w-4xl max-w-sm"
          showCloseButton={false}
        >
          <DialogTitle className="hidden" />

          <SignInClient
            component
            SignInToChat
            onSignInSuccess={() => {
              setHasSignedIn(true);
              setDialogSignIn(false);
              toast.success(
                locale === routing.defaultLocale
                  ? "Silakan lanjutkan percakapan"
                  : "You can continue the conversation"
              );
            }}
          />
        </DialogContent>
      </Dialog>
      <div className="flex-1 pb-4">
        <div className="w-full max-w-4xl mx-auto px-2 lg:px-6">
          <div className={cn(type === "preview" ? "py-0" : "py-6")}>
            {messages.length === 0 ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-muted-foreground">
                  {locale === routing.defaultLocale
                    ? "Mulai Percakapan Baru"
                    : "Start New Chat"}
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {urgent && (
                  <div className="w-full max-w-4xl mx-auto sticky top-24 z-50">
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
                {type === "preview" && (
                  <div className="bg-linear-to-b from-background via-background  sticky top-0 z-20 py-6">
                    <div className="bg-blue-100 text-blue-500 border border-blue-500 p-4 rounded-2xl flex flex-row items-center gap-3">
                      <div className="bg-white p-1 rounded-full w-8 h-8 flex justify-center items-center border border-blue-500">
                        <ScanEye className="size-5 w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold">
                          {" "}
                          {locale === routing.defaultLocale
                            ? "Mode Pratinjau"
                            : "Preview Mode"}
                        </p>
                        <p className="text-sm!">
                          {" "}
                          {locale === routing.defaultLocale
                            ? "Anda tidak dapat memodifikasi chat ini."
                            : "You cannot modify this chat."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {type === "share" && (
                  <div className="sticky top-24 z-20">
                    <div className="bg-amber-100 text-amber-500 border border-amber-500 p-4 rounded-2xl flex flex-row items-center gap-3">
                      <div className="bg-white p-1 rounded-full w-8 h-8 flex justify-center items-center border border-amber-500">
                        <ScanEye className="size-5 w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold">
                          {" "}
                          {locale === routing.defaultLocale
                            ? "Percakapan yang dibagikan hanya dapat dilihat."
                            : "Shared conversations can only be viewed."}
                        </p>
                        <p className="text-sm!">
                          {" "}
                          {locale === routing.defaultLocale
                            ? "Anda tidak dapat memodifikasi percakapan ini."
                            : "You cannot modify this chat."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.6s]" />
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.9s]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-[50vh]" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm z-20">
        <div className="w-full max-w-4xl mx-auto px-2 lg:px-6">
          <div className="py-3">
            {!isShowInput && (
              <>
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
                      className={`flex-1 resize-none border-0 shadow-none rounded-none wrap-anywhere bg-transparent text-primary placeholder:text-primary/50 focus-visible:ring-0 focus:outline-none hide-scroll transition-all duration-300 leading-relaxed h-auto ${
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
              </>
            )}
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
