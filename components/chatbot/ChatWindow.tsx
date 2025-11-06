"use client";

import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import { ArrowUp } from "lucide-react";
import { Input } from "../ui/input";
import ContainerWrap from "../utility/ContainerWrap";
import { Textarea } from "../ui/textarea";

interface Message {
  id: string;
  message: string;
  sender: "user" | "bot";
  timestamp: string;
}

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  isSidebarOpen: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  isLoading = false,
  isSidebarOpen,
}) => {
  const [inputValue, setInputValue] = React.useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="overflow-y-auto relative flex flex-col items-center hide-scroll">
      <div className="flex flex-col min-h-[calc(100vh-15vh)] max-h-[calc(100vh-15vh)] w-full">
        {/* <div className="h-16 w-full bg-linear-to-b from-background fixed top-22 z-10"></div> */}
        <ContainerWrap size="md">
          {/* Messages Container */}
          <div className="flex-1 min-h-[calc(100vh-10vh)] max-h-[calc(100vh-10vh)] lg:px-10 pt-[8vh] space-y-10">
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
                  />
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3">
                      <div className="flex gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce delay-100" />
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="pb-20" />
              </div>
            )}
          </div>
        </ContainerWrap>
        {/* <div className="h-16 w-full bg-linear-to-t from-background fixed bottom-30 z-10"></div> */}
      </div>
      {/* Input Area */}
      <div className={`fixed bottom-0 bg-background w-full z-10 lg:px-10 px-3`}>
        <div
          className={`flex  w-full justify-center transition-all duration-300`}
        >
          <div className="relative w-full max-w-3xl h-auto bg-background py-3">
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
              className="absolute right-3 top-3/8 shadow-sm -translate-y-1/2 text-primary cursor-pointer bg-background rounded-full p-3 hover:opacity-70 disabled:opacity-50 transition-opacity"
            >
              <ArrowUp className="size-5" />
            </button>
            <div>
              <p className="text-xs! text-muted-foreground mt-4 text-center">
                M-Health AI dapat membuat kesalahan. Periksa info penting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
