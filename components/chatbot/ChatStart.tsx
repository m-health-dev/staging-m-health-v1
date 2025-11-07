"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUp } from "lucide-react";
import Link from "next/link";
import { Textarea } from "../ui/textarea";
import ChatWindow from "./ChatWindow";
import { chatDeepseek } from "@/lib/deepseekAI";

interface Message {
  id: string;
  message: string;
  sender: "user" | "bot";
  timestamp: string;
  replyTo?: string | null;
}

const ChatStart = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChat, setHasChat] = useState(false);
  const [text, setText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
            "Kamu adalah asisten kesehatan virtual yang empatik dan informatif. Jawab secara alami dan sopan. Jika bisa jawab selayaknya dokter. Jika menurutmu keluhan pengguna mengindikasikan kondisi darurat silahkan arahkan pengguna untuk menghubungi 08159880048. Jika untuk menjawab diperlukan saran dokter dan takut jika informasi yang kamu berikan salah ataupun diperlukan konsultasi dengan dokter, bantu aku tampilkan respon untuk developer 'consultation' agar developer dapat menampilkan tombol untuk berinteraksi dengan dokter, arahkan pengguna untuk klik tombol yang ditampilkan developer untuk berinteraksi dengan dokter. Jika kamu menyarankan untuk berinteraksi dengan dokter jangan lupa untuk menampilkan respon untuk developer 'consultation' agar developer dapat menampilkan tombol untuk berinteraksi dengan dokter. Namamu adalah M-Health AI atau Mei. Berikan jawaban selayaknya perempuan yang lemah lembut.",
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
    <div className="justify-center items-center max-h-[calc(100vh-15vh)] min-h-[calc(100vh-15vh)] flex">
      <div className="flex flex-col lg:items-center">
        <div className="start_conversation mb-16 lg:text-center text-start">
          <h2 className="text-primary font-bold mb-2">
            Sedang nggak enak badan?
          </h2>
          <h3 className="text-primary">Tenang, aku di sini buat bantu</h3>
        </div>

        <div className="quicklinks flex flex-wrap w-full items-center lg:justify-center md:space-y-0 space-y-3 md:space-x-3 space-x-0 mb-5 lg:scale-95">
          {[
            { href: "/medical", label: "Paket Medis" },
            { href: "/wellness", label: "Paket Kesehatan" },
            { href: "/events", label: "Acara Terbaru" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="group md:w-fit w-full">
              <button className="cursor-pointer bg-white py-1.5 pl-2 pr-3 rounded-full inline-flex lg:w-fit w-full gap-3 items-center shadow-sm group-hover:bg-primary transition-all duration-300">
                <div className="bg-background w-10 h-10 rounded-full flex items-center justify-center text-primary">
                  <ArrowRight className="-rotate-45 group-hover:rotate-0 transition-all duration-300" />
                </div>
                <p className="text-primary font-medium text-[18px] group-hover:text-white transition-all duration-300">
                  {label}
                </p>
              </button>
            </Link>
          ))}
        </div>

        <div className="input_conversation lg:w-3xl w-full lg:mt-0 mt-10">
          <div className="flex w-full justify-center">
            <div className="relative w-full max-w-3xl h-auto">
              <Textarea
                ref={textareaRef}
                placeholder="Jangan ragu untuk tanyakan apapun."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className={`hide-scroll overflow-y-auto resize-none bg-white px-5 py-5 min-h-16 max-h-40 border-0 focus-visible:ring-0 placeholder:font-sans placeholder:text-base! font-sans text-base! placeholder:text-primary/50 shadow-sm disabled:opacity-50 transition-all duration-300 ${
                  isExpanded ? "rounded-2xl" : "rounded-full"
                }`}
              />
              <button
                onClick={() => handleSendMessage(text)}
                disabled={isLoading || !text.trim()}
                className="absolute right-3 bottom-2.5 text-primary cursor-pointer bg-background rounded-full p-3 hover:opacity-70 disabled:opacity-50 transition-opacity"
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
