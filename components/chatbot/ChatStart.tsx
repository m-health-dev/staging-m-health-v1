"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUp } from "lucide-react";
import Link from "next/link";
import { Textarea } from "../ui/textarea";
import ChatWindow from "./ChatWindow";
import { chatDeepseek } from "@/lib/deepseekAI";
import { nanoid } from "nanoid";
import { quickLinks } from "../home/QuickAction";

interface Message {
  id: string;
  message: string;
  sender: "user" | "bot";
  timestamp: string;
  replyTo?: string | null;
}

const ChatStart = ({ chat }: { chat: Message[] }) => {
  const [messages, setMessages] = useState<Message[]>(chat);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChat, setHasChat] = useState(false);
  const [text, setText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    // Jika chat lama dimuat, gunakan id-nya
    const storedId = localStorage.getItem("mhealth_active_chat_id");
    if (storedId) setActiveChatId(storedId);
    else if (chat.length > 0) {
      const firstChatId = chat[0]?.id || nanoid();
      setActiveChatId(firstChatId);
      localStorage.setItem("mhealth_active_chat_id", firstChatId);
    }
  }, [chat]);

  useEffect(() => {
    if (chat.length > 0) {
      setMessages(chat);
      setHasChat(true);
    }
  }, [chat]);

  // 🟡 Opsional: reset chat jika ingin mulai percakapan baru
  const clearChatHistory = () => {
    localStorage.removeItem("mhealth_chat_history");
    setMessages([]);
    setHasChat(false);
  };

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
      // Buat history chat dengan format untuk API DeepSeek
      const chatHistory = [
        {
          role: "system",
          content:
            "You are M-Health AI, also known as Mei — a gentle, empathetic, and informative virtual health assistant. Respond naturally, politely, and with compassion. When possible, answer as a professional doctor would. If the user’s symptoms suggest an emergency, immediately advise them to call 08159880048 for urgent help.If the user’s concern requires medical expertise, doctor’s advice, or professional evaluation, include the keyword “consultation” at the end of your message. This keyword allows the system to display a button for users to connect directly with a doctor. Encourage the user to click that button when further consultation is necessary. Speak with a warm, feminine, and reassuring tone, as if you are a caring female health assistant.",
        },
        ...messages.map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.message,
        })),
        { role: "user", content: userMessage },
      ];

      const data = await chatDeepseek(chatHistory);

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

      // 🟢 Simpan ke localStorage
      const newMessages = [...messages, userMsg, botResponse];

      // Ambil semua chat yang sudah ada
      const existingChats =
        JSON.parse(localStorage.getItem("mhealth_chat_sessions") || "[]") || [];

      // Buat ID unik jika chat ini baru
      const chatId = activeChatId || nanoid();

      // Pastikan setiap kali chat baru dimulai, ID disimpan
      if (!activeChatId) {
        setActiveChatId(chatId);
        localStorage.setItem("mhealth_active_chat_id", chatId);
      }

      // Simpan ID aktif (agar saat reload tahu chat mana yang terakhir)
      localStorage.setItem("mhealth_active_chat_id", chatId || botResponse.id);

      // Buat objek riwayat chat baru
      const chatData = {
        id: chatId,
        title:
          newMessages[0]?.message ||
          "Percakapan Baru " + new Date().toLocaleString(),
        messages: newMessages,
        updatedAt: new Date().toISOString(),
      };

      // Cek apakah chat dengan ID ini sudah ada
      const existingIndex = existingChats.findIndex(
        (c: any) => c.id === chatId
      );

      if (existingIndex !== -1) {
        // Update chat lama
        existingChats[existingIndex] = chatData;
      } else {
        // Tambahkan chat baru
        existingChats.push(chatData);
      }

      // Simpan kembali ke localStorage
      localStorage.setItem(
        "mhealth_chat_sessions",
        JSON.stringify(existingChats)
      );
    } catch (error) {
      console.error("[v0] Error sending message:", error);
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
          <h2 className="text-primary font-bold mb-2">
            Sedang nggak enak badan?
          </h2>
          <h3 className="text-primary">Tenang, aku di sini buat bantu</h3>
        </div>

        <div className="flex max-w-2xl w-full overflow-x-auto lg:overflow-x-visible hide-scroll pb-2 gap-4 items-center justify-start lg:justify-center hide-scroll cursor-grab lg:mb-5">
          {quickLinks.map(({ id, href, label, icon }) => (
            <Link key={href} href={href} className="group shrink-0">
              <button className="cursor-pointer bg-white py-1.5 pl-2 pr-5 border rounded-full inline-flex gap-3 items-center shadow-sm group-hover:bg-primary transition-all duration-300">
                <div className="bg-background lg:w-10 w-9 lg:h-10 h-9 rounded-full flex items-center justify-center text-primary">
                  {icon}
                </div>
                <p className="text-primary font-medium group-hover:text-white transition-all duration-300 whitespace-nowrap">
                  {label}
                </p>
              </button>
            </Link>
          ))}
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
                className={`flex-1 resize-none border-0 shadow-none rounded-none bg-transparent text-primary placeholder:3xl:text-[18px]! placeholder:text-[17px]! 3xl:text-[18px]! text-[17px]! font-sans focus-visible:ring-0 focus:outline-none hide-scroll placeholder:text-primary/50  transition-all duration-300 wrap-anywhere ${
                  isExpanded
                    ? "max-h-52 px-2 py-2"
                    : "min-h-16 max-h-20 px-2 3xl:pt-4.5 lg:pt-5 pt-2 placeholder:pt-0.5"
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
