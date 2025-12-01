"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUp } from "lucide-react";
import Link from "next/link";
import { Textarea } from "../ui/textarea";
import ChatWindow from "./ChatWindow";
import { chatGemini } from "@/lib/geminiAPI";
import { nanoid } from "nanoid";
import QuickAction, { quickLinks } from "../home/QuickAction";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

export interface Message {
  id: string;
  message: string;
  sender: "user" | "bot";
  timestamp: string;
  replyTo?: string | null;
  session_id?: string;
}

const ChatStart = ({
  chat,
  session,
  publicID,
  sessionID,
}: {
  chat: Message[];
  session?: any[];
  sessionID?: string;
  publicID: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const router = useRouter(); // Init router
  const [messages, setMessages] = useState<Message[]>(chat);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChat, setHasChat] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (session && chat.length > 0) {
      setMessages(chat);
      setHasChat(true);
    } else if (!session) {
      // Jika balik ke root/chat baru
      setMessages([]);
      setHasChat(false);
    }
  }, [chat, session]);

  useEffect(() => {
    if (chat.length > 0) {
      setMessages(chat);
      setHasChat(true);
    }
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
    if (!userMessage.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      message: userMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
      replyTo: replyTo ?? null,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setHasChat(true);
    setText("");

    try {
      // Siapkan format chat untuk API

      const formattedMessages = [...messages, userMsg].map((m) => ({
        sender: m.sender === "bot" ? "assistant" : "user",
        message: m.message,
      }));

      let data;

      // LOGIC PENTING: Cek apakah ini chat baru atau lanjutan
      if (!session) {
        // --- CHAT BARU ---
        data = await chatGemini({
          messages: formattedMessages,
          prompt: userMessage,
          public_id: publicID!,
          // Jangan kirim session_id, biarkan backend generate
        });

        // JIKA SUKSES & DAPAT SESSION ID BARU
        if (data.session_id) {
          // Redirect ke URL baru
          // Menggunakan replace agar user tidak bisa 'back' ke halaman kosong
          // Atau push jika ingin history browser terjaga
          router.push(`/c/${data.session_id}`, { scroll: false });

          // Kita tidak perlu update state manual di sini secara kompleks,
          // karena router.push akan memicu re-render ChatContent -> fetch data
          // Namun agar transisi smooth (sebelum fetch selesai), kita biarkan state messages saat ini
        }
      } else {
        // --- CHAT LANJUTAN ---
        data = await chatGemini({
          messages: formattedMessages,
          prompt: userMessage,
          public_id: publicID!,
          session_id: sessionID, // Gunakan ID dari URL/Props
        });
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        message:
          typeof data.message === "string"
            ? data.message
            : data.message?.content ||
              "Maaf, saya tidak dapat memproses pertanyaan Anda.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        message: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(text);
    }
  };

  if (hasChat) {
    return (
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="justify-center items-center lg:max-h-[calc(100vh-15vh)] lg:min-h-[calc(100vh-15vh)] max-h-[calc(100vh-25vh)] min-h-[calc(100vh-25vh)] lg:mt-0 mt-[8vh] flex">
      <div className="flex flex-col lg:items-center max-w-full">
        <div className="start_conversation mb-10 lg:text-center text-start">
          <h2 className="text-primary font-extrabold mb-2">
            Sedang nggak enak badan?
          </h2>
          <h3 className="text-primary">Tenang, aku di sini buat bantu</h3>
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
                placeholder="Ketik pertanyaanmu di sini..."
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
