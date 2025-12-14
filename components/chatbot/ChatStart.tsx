"use client";

import type React from "react";

import { useEffect, useRef, useState, useTransition } from "react";
import { ArrowUp } from "lucide-react";
import { Textarea } from "../ui/textarea";
import ChatWindow from "./ChatWindow";
import { chatGemini } from "@/lib/chatbot/geminiAPI";
import QuickAction from "../home/QuickAction";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import type { Account } from "@/types/account.types";
import type { Message } from "@/types/message.types"; // Assuming Message is declared in message.types

const ChatStart = ({
  chat,
  session,
  publicID,
  sessionID,
  accounts,
  onNewMessage, // Add callback to refresh history when new message is sent
}: {
  chat: Message[];
  session?: any[];
  sessionID?: string;
  publicID: string;
  accounts?: Account;
  onNewMessage?: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>(chat);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChat, setHasChat] = useState(chat.length > 0);
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);

  const locale = useLocale();

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

    try {
      const formattedMessages = [...messages, userMsg].map((m) => ({
        sender: m.sender === "bot" ? "assistant" : "user",
        message: m.message,
        replyTo: m.replyTo,
        urgent: m.urgent,
      }));

      const data = await chatGemini({
        messages: formattedMessages,
        prompt: userMessage,
        replyTo: {
          message: replyTo,
          sender: "user",
        },
        public_id: publicID,
        user_id: accounts?.id,
        session_id: sessionID,
      });

      if (!session && data.session_id) {
        setPendingSessionId(data.session_id);
        setIsLoading(true);

        startTransition(() => {
          router.replace(`/${locale}/c/${data.session_id}`, {
            scroll: false,
          });
          setIsLoading(true);
        });
        setIsLoading(false);

        return;
      }

      // 🟢 JIKA SESSION SUDAH ADA
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        message:
          typeof data.message === "string"
            ? data.message
            : data.message?.content ||
              "Maaf, saya tidak dapat memproses pertanyaan Anda.",
        sender: "bot",
        timestamp: new Date().toISOString(),
        urgent: data.urgent,
      };

      setMessages((prev) => [...prev, botResponse]);

      onNewMessage?.();
    } catch (error) {
      console.error("Error sending message:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          message: "Maaf, terjadi kesalahan. Silakan coba lagi.",
          sender: "bot",
          timestamp: new Date().toISOString(),
        },
      ]);
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
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        accounts={accounts}
        sessionId={sessionID}
        pendingSessionId={pendingSessionId}
      />
    );
  }

  return (
    <div className="justify-center items-center lg:max-h-[calc(100vh-15vh)] lg:min-h-[calc(100vh-15vh)] max-h-[calc(100vh-25vh)] min-h-[calc(100vh-25vh)] lg:mt-0 mt-[8vh] flex px-4">
      <div className="flex flex-col lg:items-center max-w-full">
        <div className="start_conversation mb-10 lg:text-center text-start">
          <h2 className="text-primary font-extrabold mb-2">
            {locale === routing.defaultLocale
              ? "Sedang nggak enak badan?"
              : "Are you feeling unwell?"}
          </h2>
          <h3 className="text-primary">
            {locale === routing.defaultLocale
              ? "Tenang aku disini buat bantu kamu"
              : "Don't worry, I'm here to help you."}
          </h3>
        </div>

        <div className="mb-2">
          <QuickAction />
        </div>

        <div className="input_conversation lg:w-3xl w-full lg:mt-0 mt-10">
          <div className="flex w-full justify-center">
            <div
              className={`flex w-full max-w-3xl bg-white border border-border shadow-sm transform-content ${
                isExpanded
                  ? "flex-col rounded-2xl px-2 pt-2 pb-2 items-end"
                  : "lg:flex-row flex-col lg:rounded-full px-2 py-2 lg:max-h-16 lg:min-h-16 min-h-32 rounded-2xl lg:items-center items-end"
              }`}
            >
              <Textarea
                ref={textareaRef}
                placeholder={
                  locale === routing.defaultLocale
                    ? "Sampaikan keluhanmu disini..."
                    : "Submit your health complaints here..."
                }
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className={`flex-1 resize-none border-0 shadow-none rounded-none wrap-anywhere bg-transparent text-primary placeholder:text-primary/50 focus-visible:ring-0 focus:outline-none hide-scroll transition-all duration-300 leading-relaxed ${
                  isExpanded
                    ? "max-h-52 py-2 text-base"
                    : "min-h-12 text-base py-3"
                }`}
              />
              <button
                onClick={() => handleSendMessage(text)}
                disabled={isLoading || !text.trim()}
                className={`ml-2 shrink-0 flex items-center justify-center rounded-full transition-all duration-300 ${
                  isLoading || !text.trim()
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary/90"
                } ${isExpanded ? "w-11 h-11" : "w-11 h-11"}`}
              >
                <ArrowUp className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatStart;
