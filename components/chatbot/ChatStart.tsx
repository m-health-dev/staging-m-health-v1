"use client";

import type React from "react";

import { useEffect, useRef, useState, useTransition } from "react";
import { ArrowUp, ChevronDown, Plus, SlidersHorizontal } from "lucide-react";
import { Textarea } from "../ui/textarea";
import ChatWindow from "./ChatWindow";
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
  locale,
  consultSession,
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
  locale?: string;
  consultSession?: any;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<Message[]>(chat);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChat, setHasChat] = useState(chat.length > 0);
  const [text, setText] = useState("");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(
    sessionID ?? null,
  );

  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
    replyTo?: string | null,
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
      // const effectiveSessionId = sessionID ?? pendingSessionId ?? null;
      const effectiveSessionId = activeSessionId;

      const formattedMessages = [...messages, userMsg].map((m) => ({
        sender: m.sender === "bot" ? "assistant" : "user",
        message: m.message,
        replyTo: m.replyTo,
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
        session_id: effectiveSessionId,
        new_session: !effectiveSessionId,
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

      // const reader = response.body.getReader();
      // const decoder = new TextDecoder();
      // let fullMessage = "";
      // let actions: any[] = [];
      // let sessionId = "";
      // let isUrgent = false;
      // let buffer = "";

      // const processSSEEvent = (eventType: string, eventData: string) => {
      //   try {
      //     const data = JSON.parse(eventData);

      //     switch (eventType) {
      //       case "connected":
      //         console.log("Stream connected:", data);
      //         if (data.text) {
      //           fullMessage += data.text;
      //           setMessages((prev) =>
      //             prev.map((msg) =>
      //               msg.id === botMessageId
      //                 ? { ...msg, message: fullMessage, isStreaming: true }
      //                 : msg,
      //             ),
      //           );
      //         }
      //         break;

      //       case "chunk":
      //       case "": // default event type for text chunks
      //         if (data.text) {
      //           fullMessage += data.text;
      //           setMessages((prev) =>
      //             prev.map((msg) =>
      //               msg.id === botMessageId
      //                 ? { ...msg, message: fullMessage, isStreaming: true }
      //                 : msg,
      //             ),
      //           );
      //         }
      //         break;

      //       case "complete":
      //         sessionId = data.session_id || sessionId;
      //         isUrgent = data.urgent || false;
      //         // Use the complete reply if provided, otherwise keep accumulated
      //         if (data.reply) {
      //           fullMessage = data.reply;
      //         }

      //         if (data.actions) {
      //           actions = data.actions;
      //         }

      //         setMessages((prev) =>
      //           prev.map((msg) =>
      //             msg.id === botMessageId
      //               ? {
      //                   ...msg,
      //                   message: fullMessage,
      //                   urgent: isUrgent,
      //                   isStreaming: false,
      //                   actions: actions,
      //                 }
      //               : msg,
      //           ),
      //         );

      //         // Update URL silently when new session is created
      //         if (!sessionID && !pendingSessionId && sessionId) {
      //           const newUrl = `/${locale}/c/${sessionId}`;
      //           setPendingSessionId(sessionId);

      //           // Use window.history.replaceState for silent update
      //           window.history.replaceState(
      //             { ...window.history.state, as: newUrl, url: newUrl },
      //             "",
      //             newUrl,
      //           );

      //           // startTransition(() => {
      //           //   document.startViewTransition(() => {
      //           //     router.replace(`/${locale}/c/${sessionId}`);
      //           //   });
      //           // });

      //           // Dispatch custom event to notify URL change
      //           window.dispatchEvent(new Event("urlchange"));
      //         } else if (sessionId) {
      //           // Just update pendingSessionId if already have session
      //           setPendingSessionId(sessionId);
      //         }
      //         break;

      //       case "error":
      //         console.error("Stream error:", data);
      //         setMessages((prev) =>
      //           prev.map((msg) =>
      //             msg.id === botMessageId
      //               ? {
      //                   ...msg,
      //                   message: data.message || "Terjadi kesalahan.",
      //                   isStreaming: false,
      //                 }
      //               : msg,
      //           ),
      //         );
      //         break;

      //       default:
      //         // Handle unknown events or raw text
      //         if (data.text) {
      //           fullMessage += data.text;
      //           setMessages((prev) =>
      //             prev.map((msg) =>
      //               msg.id === botMessageId
      //                 ? { ...msg, message: fullMessage, isStreaming: true }
      //                 : msg,
      //             ),
      //           );
      //         }
      //     }
      //   } catch (e) {
      //     // If JSON parse fails, might be plain text
      //     console.warn("Failed to parse SSE data:", eventData, e);
      //   }
      // };
      // Parse SSE format properly
      // const parseSSEBuffer = (text: string): string => {
      //   // Split by double newline (SSE event separator)
      //   const parts = text.split(/\n\n/);

      //   // Keep the last incomplete part in buffer
      //   const incompletePart = parts.pop() || "";

      //   for (const part of parts) {
      //     if (!part.trim()) continue;

      //     const lines = part.split("\n");
      //     let currentEvent = ""; // default event type
      //     let currentData = "";

      //     for (const line of lines) {
      //       if (line.startsWith("event:")) {
      //         currentEvent = line.slice(6).trim();
      //       } else if (line.startsWith("data:")) {
      //         // Handle multi-line data by accumulating
      //         const dataContent = line.slice(5).trim();
      //         currentData += currentData ? "\n" + dataContent : dataContent;
      //       } else if (line.startsWith(":")) {
      //         // Comment line, ignore (often used for keep-alive)
      //         continue;
      //       }
      //     }

      //     if (currentData) {
      //       processSSEEvent(currentEvent, currentData);
      //     }
      //   }

      //   return incompletePart;
      // };

      // Read stream with proper buffer handling
      // while (true) {
      //   const { done, value } = await reader.read();

      //   if (value) {
      //     buffer += decoder.decode(value, { stream: true });
      //     buffer = parseSSEBuffer(buffer);
      //   }

      //   if (done) {
      //     // Process any remaining buffer after stream ends
      //     if (buffer.trim()) {
      //       // Flush decoder
      //       buffer += decoder.decode();
      //       parseSSEBuffer(buffer + "\n\n"); // Force parse remaining
      //     }
      //     break;
      //   }
      // }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let fullMessage = "";
      let actions: any[] = [];
      let sessionId = "";
      let isUrgent = false;

      let sseBuffer = "";

      let renderBuffer = "";
      let renderScheduled = false;
      let lastRenderTime = 0;

      const scheduleRender = () => {
        const now = performance.now();
        if (renderScheduled || now - lastRenderTime < 33) return;

        renderScheduled = true;
        lastRenderTime = now;

        requestAnimationFrame(() => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId
                ? { ...msg, message: fullMessage, isStreaming: true }
                : msg,
            ),
          );
          renderScheduled = false;
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        sseBuffer += decoder.decode(value, { stream: true });

        let lines = sseBuffer.split("\n");
        sseBuffer = lines.pop() || ""; // sisa incomplete line

        for (let line of lines) {
          line = line.trim();
          if (!line) continue;

          // only care about data lines
          if (!line.startsWith("data:")) continue;

          const jsonStr = line.replace(/^data:\s*/, "");

          try {
            const data = JSON.parse(jsonStr);

            // if (data.text) {
            //   fullMessage += data.text;
            //   await new Promise(requestAnimationFrame);

            //   setMessages((prev) =>
            //     prev.map((msg) =>
            //       msg.id === botMessageId
            //         ? { ...msg, message: fullMessage, isStreaming: true }
            //         : msg,
            //     ),
            //   );
            // }

            if (data.session_id && !activeSessionId) {
              const newId = data.session_id;

              setActiveSessionId(newId);

              const newUrl = `/${locale}/c/${newId}`;

              window.history.replaceState(
                { ...window.history.state, as: newUrl, url: newUrl },
                "",
                newUrl,
              );

              // startTransition(() => {
              //   router.replace(newUrl, { scroll: false });
              // });

              window.dispatchEvent(new Event("urlchange"));
            }

            if (data.text) {
              renderBuffer += data.text;
              fullMessage += renderBuffer;
              renderBuffer = "";
              await new Promise(requestAnimationFrame);

              scheduleRender();
            }

            // FINAL MESSAGE
            if (data.reply || data.session_id) {
              if (data.reply) fullMessage = data.reply;
              if (data.actions) actions = data.actions;
              if (data.session_id) sessionId = data.session_id;
              if (data.urgent) isUrgent = true;

              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botMessageId
                    ? {
                        ...msg,
                        message: fullMessage,
                        urgent: isUrgent,
                        isStreaming: false,
                        actions,
                      }
                    : msg,
                ),
              );
            }
          } catch (err) {
            console.warn("Bad JSON chunk:", jsonStr);
          }
        }
      }

      // Ensure final state is set correctly
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                message: fullMessage || msg.message,
                urgent: isUrgent,
                actions: actions,
                isStreaming: false,
              }
            : msg,
        ),
      );

      // Trigger history refresh for new session
      if (!sessionID && !pendingSessionId && sessionId) {
        setTimeout(() => onNewMessage?.(), 500);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                message:
                  locale === routing.defaultLocale
                    ? "Maaf, terjadi kesalahan. Silakan coba lagi."
                    : "Sorry, an error occurred. Please try again.",
                isStreaming: false,
              }
            : msg,
        ),
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

        const newValue =
          textarea.value.slice(0, start) + e.key + textarea.value.slice(end);

        textarea.value = newValue;
        setText(newValue); // Update React state agar tombol Send aktif

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
        consultSession={consultSession}
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
                ? `Halo, ${accounts.fullname ? (accounts.fullname.split(" ")[0].length >= 1 ? accounts.fullname.split(" ")[0] : accounts.fullname.split(" ")[1]) : accounts.google_fullname}! 👋`
                : `Hi, ${accounts.fullname ? (accounts.fullname.split(" ")[0].length >= 1 ? accounts.fullname.split(" ")[0] : accounts.fullname.split(" ")[1]) : accounts.google_fullname}! 👋`
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
