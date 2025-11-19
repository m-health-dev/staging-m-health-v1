"use client";

import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import { ArrowUp, Plus, Undo2 } from "lucide-react";
import { Input } from "../ui/input";
import ContainerWrap from "../utility/ContainerWrap";
import { Textarea } from "../ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export interface Message {
  id: string;
  message: string;
  sender: "user" | "bot";
  timestamp: string;
  replyTo?: string | null;
}

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (message: string, replyTo?: string | null) => void; // ✅ izinkan 2 argumen
  isLoading?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  isLoading = false,
}) => {
  const [inputValue, setInputValue] = React.useState("");
  const [isHandleReply, setIsHandleReply] = React.useState(false);
  const [replyMessage, setReplyMessage] = React.useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [inputValue]);

  useEffect(() => {
    setIsExpanded(inputValue.length > 50);
  }, [inputValue]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
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

  return (
    <div className="overflow-y-auto flex flex-col items-center hide-scroll">
      <div className="flex flex-col min-h-[calc(100vh-15vh)] max-h-[calc(100vh-15vh)] w-full">
        {/* <div className="h-16 w-full bg-linear-to-b from-background fixed top-22 z-10"></div> */}
        <div className="container mx-auto lg:max-w-4xl w-full lg:px-6">
          {/* Messages Container */}
          <div className="flex-1 min-h-[calc(100vh-10vh)] max-h-[calc(100vh-10vh)] lg:px-10 lg:pt-[10vh] pt-[16vh]">
            <div>
              <p className="lg:text-sm! text-xs! text-muted-foreground/50 text-center mb-10">
                Kami menyimpan percakapan ini secara lokal di penyimpanan Anda.
                Anda dapat menggunakan <i>Health AI Assistant </i>
                ini untuk mencari tahu tentang permasalahan kesehatan anda
                secara gratis.
              </p>
            </div>
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">
                  Mulai percakapan baru...
                </p>
              </div>
            ) : (
              <div className="space-y-10">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
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
                <div ref={messagesEndRef} className={"pb-[40vh]"} />
              </div>
            )}
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
          <div className="relative w-full max-w-3xl h-auto bg-background py-3">
            {replyMessage && (
              <div className="bg-white/80 p-4 rounded-2xl mb-1 flex justify-between items-start shadow-sm border border-border">
                <div className="max-w-[85%]">
                  <p className="text-sm! font-bold text-primary mb-1 flex items-center gap-2">
                    <Undo2 className="size-4" /> Membalas pesan:
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
                      : "flex-row rounded-2xl px-4 py-2 max-h-16 items-center"
                  }`}
                >
                  <Textarea
                    ref={textareaRef}
                    placeholder="Ketik pertanyaanmu di sini..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={isLoading}
                    className={`flex-1 resize-none border-0 shadow-none rounded-none wrap-anywhere bg-transparent text-primary placeholder:3xl:text-[18px]! placeholder:text-[17px]! 3xl:text-[18px]! text-[17px]! font-sans focus-visible:ring-0 focus:outline-none hide-scroll placeholder:text-primary/50  transition-all duration-300 ${
                      isExpanded
                        ? "max-h-52 px-2 py-2"
                        : "min-h-16 max-h-20 px-1 3xl:py-5 py-5.5 placeholder:pt-0.5"
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
                    <ArrowUp className="size-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* <div>
              <Textarea
                placeholder="Jangan ragu untuk tanyakan apapun."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
                className="rounded-2xl hide-scroll overflow-y-auto resize-none bg-white pl-5 pr-18 min-h-16 max-h-28 py-5 border-0 focus-visible:ring-0 placeholder:font-sans placeholder:text-base font-sans! text-base! placeholder:text-primary/50 shadow-sm disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                className="absolute right-3 3xl:bottom-[2.7vh] bottom-[4.2vh] shadow-sm -translate-y-1/2 text-primary cursor-pointer bg-background rounded-full p-3 hover:opacity-70 disabled:opacity-50 transition-opacity"
              >
                <ArrowUp className="size-5" />
              </button>
            </div> */}
            <div>
              <p className="text-xs! text-muted-foreground mt-4 text-center">
                M-Health AI dapat membuat kesalahan. Periksa info penting.
              </p>
              <p className="text-xs! text-muted-foreground mt-0 text-center">
                Gemini 2.5 Flash in Charge
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
