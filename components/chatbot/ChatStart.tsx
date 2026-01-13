"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, ChevronDown, Plus, SlidersHorizontal } from "lucide-react";
import { Textarea } from "../ui/textarea";
import ChatWindow from "./ChatWindow";
import { chatGemini } from "@/lib/chatbot/geminiAPI";
import QuickAction from "../home/QuickAction";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import type { Account } from "@/types/account.types";
import type { Message } from "@/types/message.types";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";

const ChatStart = ({
  chat,
  session,
  publicID,
  sessionID,
  accounts,
  type,
  onNewMessage, // Add callback to refresh history when new message is sent
  status,
  urgent,
}: {
  chat: Message[];
  session?: any[];
  sessionID?: string;
  publicID: string;
  accounts?: Account;
  type?: "default" | "preview" | "share";
  onNewMessage?: () => void;
  status?: string;
  urgent?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<Message[]>(chat);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChat, setHasChat] = useState(chat.length > 0);
  const [text, setText] = useState("");
  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);

  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    setMessages(chat);
    setHasChat(chat.length > 0);
  }, [chat]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [text]);

  useEffect(() => {
    setIsExpanded(text.length > 50);
  }, [text]);

  const handleSendMessage = async (
    userMessage: string,
    replyTo?: string | null
  ) => {
    if (!userMessage.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      message: userMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
      replyTo: {
        message: replyTo ?? null,
        sender: "user",
      },
    };

    // tampilkan pesan user langsung
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setHasChat(true);
    setText("");

    // Create bot message placeholder for streaming
    const botMessageId = (Date.now() + 1).toString();
    const botPlaceholder: Message = {
      id: botMessageId,
      message: "",
      sender: "bot",
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, botPlaceholder]);

    try {
      const formattedMessages = [...messages, userMsg].map((m) => ({
        sender: m.sender === "bot" ? "assistant" : "user",
        message: m.message,
        // replyTo: m.replyTo,
        urgent: m.urgent,
      }));

      const payload = {
        messages: formattedMessages,
        prompt: userMessage,
        replyTo: {
          message: replyTo,
          sender: "user",
        },
        public_id: publicID,
        user_id: accounts?.id,
        session_id: sessionID,
      };

      // Call streaming API via client-side route
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok || !response.body) {
        throw new Error("Streaming response failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullMessage = "";
      let sessionId = "";
      let isUrgent = false;
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        let currentEvent = "";

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (currentEvent === "connected") {
                // Connected event - do nothing or log
                console.log("Stream connected:", data);
              } else if (currentEvent === "complete") {
                // Complete event - extract metadata
                sessionId = data.session_id;
                isUrgent = data.urgent;
                fullMessage = data.reply;

                // Update message dengan final text
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMessageId
                      ? {
                          ...msg,
                          message: fullMessage,
                          urgent: isUrgent,
                          isStreaming: false,
                        }
                      : msg
                  )
                );

                // Update URL when session ID is received
                if (!session && sessionId) {
                  const newUrl = `/${locale}/c/${sessionId}`;
                  setPendingSessionId(sessionId);

                  // Use window.history.replaceState for silent update
                  window.history.replaceState(
                    { ...window.history.state, as: newUrl, url: newUrl },
                    "",
                    newUrl
                  );

                  // Dispatch custom event to notify URL change
                  window.dispatchEvent(new Event("urlchange"));
                }

                // Trigger history refresh immediately after message complete
                onNewMessage?.();
              } else if (data.text) {
                // Streaming token event
                fullMessage = data.text;
                // Update message progressively
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMessageId
                      ? { ...msg, message: fullMessage }
                      : msg
                  )
                );
              }

              currentEvent = ""; // Reset event
            } catch (e) {
              console.error("Error parsing SSE:", e);
            }
          }
        }
      }

      // Trigger history refresh for new session after streaming complete
      if (!session && sessionId) {
        setTimeout(() => onNewMessage?.(), 500);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                message: "Maaf, terjadi kesalahan. Silakan coba lagi.",
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      // Begitu Enter ditekan, paksa expanded
      setIsExpanded(true);

      // Enter tanpa Shift = kirim
      if (!e.shiftKey) {
        e.preventDefault();
        handleSendMessage(text);
      }
    }
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

  if (hasChat) {
    return (
      <ChatWindow
        messages={messages}
        type={type}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        accounts={accounts}
        sessionId={sessionID}
        pendingSessionId={pendingSessionId}
        status={status}
        urgent={urgent}
      />
    );
  }

  return (
    <div className="justify-center items-center lg:max-h-[calc(100vh-15vh)] lg:min-h-[calc(100vh-15vh)] max-h-[calc(100vh-25vh)] min-h-[calc(100vh-25vh)] lg:mt-0 mt-[8vh] flex px-4">
      <div className="flex flex-col lg:items-center items-start max-w-2xl">
        <div className="start_conversation lg:mb-7 mb-5 lg:text-center text-start">
          <h3 className="text-primary font-extrabold mb-2">
            {accounts?.fullname
              ? locale === routing.defaultLocale
                ? `Halo, ${accounts.fullname.split(" ")[0]}! 👋`
                : `Hi, ${accounts.fullname.split(" ")[0]}! 👋`
              : locale === routing.defaultLocale
              ? `Halo! Senang bertemu denganmu!`
              : `Hi! Nice to meet you!`}
          </h3>
          <h4 className="text-primary">
            {locale === routing.defaultLocale
              ? "Tanyakan apapun tentang kesehatanmu."
              : "Ask me anything about your health."}
          </h4>
        </div>

        <div className="input_conversation w-full">
          <div className="flex w-full">
            <div className="w-full rounded-3xl border border-primary bg-white shadow px-2 pt-2 pb-1">
              <Textarea
                ref={textareaRef}
                placeholder={
                  locale === routing.defaultLocale
                    ? "Ketik pertanyaanmu di sini..."
                    : "Type your question here..."
                }
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className={`min-h-[56px] resize-none border-0 bg-transparent shadow-none px-4 py-3 text-gray-800 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-0 rounded-2xl hide-scroll transition-all duration-200 leading-relaxed ${
                  isExpanded ? "max-h-52" : "max-h-40"
                }`}
              />

              <div className="flex items-center justify-end px-1 pb-1">
                <div className="flex items-center gap-1">
                  <Button
                    onClick={() => handleSendMessage(text)}
                    disabled={isLoading || !text.trim()}
                    size="icon"
                    className={`rounded-full ${
                      isLoading || !text.trim()
                        ? "bg-background text-primary"
                        : "bg-primary text-white hover:bg-primary/90"
                    }`}
                    aria-label="Send message"
                  >
                    {isLoading ? (
                      <Spinner className="size-5" />
                    ) : (
                      <ArrowUp className="size-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:mt-7 mt-5 w-full">
          <QuickAction />
        </div>
      </div>
    </div>
  );
};

export default ChatStart;
