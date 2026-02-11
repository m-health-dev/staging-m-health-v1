"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Eye,
  EyeClosed,
  Plus,
  ScanEye,
  SlidersHorizontal,
  Stethoscope,
  X,
} from "lucide-react";
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
import { ConsultScheduleType } from "@/types/consult.types";
import AvatarDoctor from "../utility/AvatarDoctor";
import Link from "next/link";
import LocalDateTime from "../utility/lang/LocaleDateTime";
import { v4 as uuidv4 } from "uuid";

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
  isStreaming?: boolean;
  actions?: {
    type: string;
    ids: any[];
  }[];
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
  consultSession?: any;
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
  consultSession,
}) => {
  const locale = useLocale();
  const [inputValue, setInputValue] = useState("");
  const [replyMessage, setReplyMessage] = useState<string | null>(null);
  const [dialogSignIn, setDialogSignIn] = useState(false);
  const [hasSignedIn, setHasSignedIn] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const [showNotice, setShowNotice] = useState(true);

  // const [consult, setConsult] = useState<ConsultScheduleType | null>(null);

  const [isLoadingBuy, setIsLoadingBuy] = useState(false);

  // const [isExpanded, setIsExpanded] = useState(false);
  // const [isRouting, setIsRouting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [inputValue]);

  const isExpanded = inputValue.length > 40 || inputValue.includes("\n");
  const isNotRedirect = type !== "share";
  const isShowInput = type === "preview" || type === "share";

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

  // Scroll to start of new message - hanya saat message baru, bukan saat content update
  useEffect(() => {
    if (messages.length === 0) return;
    if (typeof window === "undefined") return;

    const timer = setTimeout(() => {
      if (lastMessageRef.current) {
        // Dapatkan posisi element relatif terhadap viewport
        const elementRect = lastMessageRef.current.getBoundingClientRect();
        const elementTop = elementRect.top + window.scrollY;

        // Hitung offset 10vh dari atas viewport
        const offset = window.innerHeight * 0.1;

        // Scroll ke posisi element dikurangi offset agar muncul lebih kebawah
        window.scrollTo({
          top: elementTop - offset,
          behavior: "smooth",
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [messages.length]); // Hanya trigger saat jumlah message berubah, bukan content

  // Track scroll position for scroll to bottom button
  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 500;

      setShowScrollButton(!isNearBottom && messages.length > 0);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, [messages.length]);

  // Detect mobile keyboard using visualViewport API
  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;

    const viewport = window.visualViewport;

    const handleResize = () => {
      // Keyboard height = full window height - visual viewport height
      const currentKeyboardHeight = window.innerHeight - viewport.height;
      setKeyboardHeight(currentKeyboardHeight > 0 ? currentKeyboardHeight : 0);
    };

    viewport.addEventListener("resize", handleResize);
    viewport.addEventListener("scroll", handleResize);
    handleResize();

    return () => {
      viewport.removeEventListener("resize", handleResize);
      viewport.removeEventListener("scroll", handleResize);
    };
  }, []);

  // Scroll to input area and focus after AI finishes responding
  useEffect(() => {
    if (!isLoading && messages.length > 0 && !isShowInput) {
      const timer = setTimeout(() => {
        // Scroll to input container
        if (inputContainerRef.current) {
          inputContainerRef.current.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }

        // Focus textarea untuk memunculkan keyboard di mobile
        textareaRef.current?.focus();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isLoading, messages.length, isShowInput]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue, replyMessage ?? null);
      setInputValue("");
      setReplyMessage(null);

      // Keep textarea focused after sending message
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
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

        const newValue =
          textarea.value.slice(0, start) + e.key + textarea.value.slice(end);

        textarea.value = newValue;
        setInputValue(newValue); // Update React state agar tombol Send aktif

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

  const consult: ConsultScheduleType = consultSession;

  const payID = uuidv4();

  const handleBuy = async () => {
    setIsLoadingBuy(true);
    if (!consult) return;
    router.push(
      `/${locale}/pay/${payID}?product=${consult.chat_session}&type=consultation`,
    );
  };

  const dateNow = new Date();
  let consultExpiredAt = new Date();
  if (consult) {
    consultExpiredAt = new Date(consult.reservation_expires_at);
  }

  return (
    <div className="relative flex flex-col min-h-screen" ref={chatContainerRef}>
      {/* Scroll to Bottom Button */}

      <Dialog open={dialogSignIn}>
        <DialogContent
          className="bg-white rounded-2xl px-5 lg:min-w-4xl lg:max-w-4xl max-w-sm overflow-y-auto hide-scroll max-h-[90vh]"
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
                  : "You can continue the conversation",
              );
            }}
          />
        </DialogContent>
      </Dialog>
      <div className="flex-1 pb-4">
        <div className="w-full max-w-3xl mx-auto px-2 lg:px-6">
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
                {urgent && showNotice && (
                  <div className="w-full max-w-4xl mx-auto sticky top-24 z-50">
                    <div className="bg-green-50 text-green-600 border border-green-600 rounded-2xl p-4 flex lg:flex-row flex-col lg:items-center items-start lg:gap-4 gap-2">
                      <div className="w-6! h-6! bg-white rounded-full border border-green-600 text-green-600 flex justify-center items-center">
                        <Stethoscope className="size-3 w-6" />
                      </div>
                      <p className="lg:text-sm! text-xs!">
                        {locale === routing.defaultLocale
                          ? "Sebagai informasi, dalam percakapan ini AI menyarankan untuk berkonsultasi dengan dokter agar mendapatkan penanganan yang tepat."
                          : "For your information, in this conversation, AI recommends consulting a doctor for appropriate treatment."}
                      </p>
                      <div className="absolute top-4 right-4 lg:hidden block">
                        <button onClick={() => setShowNotice(false)}>
                          <X className="size-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {consult && (
                  <div>
                    <div className="bg-white p-4 rounded-2xl border">
                      <p className="text-primary mb-4">
                        {locale === routing.defaultLocale
                          ? "Anda memiliki sesi konsultasi untuk percakapan ini,"
                          : "You have consultation session for this chat,"}
                      </p>
                      <div className="mb-4">
                        <p className="text-sm! text-muted-foreground mb-1">
                          {locale === routing.defaultLocale
                            ? "Konsultasi dijadwalkan pada,"
                            : "Consultation Scheduled at,"}
                        </p>
                        <p className="font-semibold text-health">
                          <LocalDateTime date={consult.scheduled_datetime} />
                        </p>
                      </div>
                      {consult.payment_status === "success" &&
                      consult.doctor_id ? (
                        <div className="space-y-3">
                          {/* <div>
                            <p className="text-sm! text-muted-foreground mb-1">
                              {locale === routing.defaultLocale
                                ? "Dokter"
                                : "Doctor"}
                            </p>
                            <AvatarDoctor
                              doctor={consult.doctor_id}
                              locale={locale}
                              size="md"
                            />
                          </div> */}

                          <div>
                            <p className="text-sm! text-muted-foreground mb-1">
                              Meeting Link
                            </p>
                            <Link href={consult.meeting_link}>
                              <p className="text-primary underline">
                                {consult.meeting_link}
                              </p>
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-amber-50 border border-amber-500 px-3 py-1 rounded-full text-amber-500 inline-flex w-fit">
                          <p className="text-sm!">
                            {locale === routing.defaultLocale
                              ? "Menunggu penugasan dokter oleh sistem"
                              : "Waiting for doctor assignment by the system"}
                          </p>
                        </div>
                      )}

                      {consult.payment_status !== "success" &&
                        (dateNow < consultExpiredAt ? (
                          <>
                            <p className="mb-2">
                              {locale === routing.defaultLocale
                                ? "Konsultasi ini belum dibayar, jika ingin memulai konsultasi silahkan coba kembali pembayaran dengan menekan tombol di bawah ini."
                                : "This consultation is unpaid, if you want to start the consultation please retry payment by pressing the button below."}
                            </p>
                            <p>
                              {dateNow.toISOString()} /{" "}
                              {consultExpiredAt.toISOString()}
                            </p>
                            <div className="lg:w-fit w-full">
                              <Button
                                className="h-10 bg-health hover:bg-health rounded-full w-full disabled:opacity-70"
                                onClick={() => handleBuy()}
                                disabled={isLoading}
                              >
                                {isLoading && <Spinner />}
                                {isLoading
                                  ? locale === routing.defaultLocale
                                    ? "Memproses..."
                                    : "Processing..."
                                  : locale === routing.defaultLocale
                                    ? "Coba Lagi"
                                    : "Try Again"}
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="bg-amber-50 text-amber-500 px-3 py-1 rounded-full inline-flex w-fit border border-amber-500">
                              {locale === routing.defaultLocale
                                ? "Sesi pembayaran konsultasi telah kedaluwarsa"
                                : "Consultation payment session has expired"}
                            </p>
                            <p className="text-muted-foreground text-sm! border-l-primary border-l-4 px-3 py-2 bg-blue-50 mt-4">
                              {locale === routing.defaultLocale
                                ? "Silahkan buat sesi konsultasi baru dengan klik salah satu tombol konsultasi dengan dokter di salah satu percakapan ini untuk melanjutkan konsultasi dengan dokter."
                                : "Please create a new consultation session by clicking one of the consultation buttons with a doctor in one of these conversations to continue consulting with a doctor."}
                            </p>
                          </>
                        ))}
                    </div>
                  </div>
                )}
                {type === "preview" && (
                  <div className="bg-linear-to-b from-background via-background py-6">
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
                {messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    ref={index === messages.length - 1 ? lastMessageRef : null}
                  >
                    <ChatMessage
                      id={msg.id}
                      message={msg.message}
                      sender={msg.sender}
                      timestamp={msg.timestamp}
                      onReply={handleReply}
                      replyTo={msg.replyTo}
                      sessionId={sessionId}
                      urgent={msg.urgent}
                      isStreaming={msg.isStreaming}
                      actions={msg.actions}
                    />
                  </div>
                ))}
                <div ref={messagesEndRef} className="h-[20vh]" />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto sticky bottom-42 z-99">
        <button
          onClick={scrollToBottom}
          className={cn(
            " bg-white text-primary rounded-full p-2 transition-all duration-500  flex items-center gap-2 border border-primary -translate-y-20",
            showScrollButton
              ? "opacity-100 animate-in fade-in translate-y-0"
              : "opacity-0 animate-in fade-in translate-y-20",
          )}
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="size-5" />
        </button>
      </div>
      <div
        ref={inputContainerRef}
        className="sticky bg-linear-to-t from-background via-background to-transparent pt-10 z-20"
        style={{ bottom: keyboardHeight > 0 ? `${keyboardHeight}px` : 0 }}
      >
        <div className="w-full max-w-3xl mx-auto px-0 md:px-2 lg:px-6">
          <div className="md:py-3 py-0">
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
                  <div className="w-full md:rounded-3xl rounded-t-3xl border-x border-t border-primary bg-white shadow px-2 pt-2 pb-1">
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
                      className={`min-h-[56px] resize-none border-0 bg-transparent shadow-none px-4 py-3 text-gray-800 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-0 rounded-2xl hide-scroll transition-all duration-200 leading-relaxed ${
                        isExpanded ? "max-h-52" : "max-h-40"
                      }`}
                    />

                    <div className="flex items-center justify-end px-1 pb-1">
                      <div className="flex items-center gap-1">
                        <Button
                          onClick={handleSend}
                          disabled={isLoading || !inputValue.trim()}
                          size="icon"
                          className={`rounded-full ${
                            isLoading || !inputValue.trim()
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
              </>
            )}
            <p className="text-xs! text-muted-foreground mt-2 text-center md:block hidden">
              {locale === routing.defaultLocale
                ? "M-HEALTH AI dapat membuat kesalahan. Periksa info penting."
                : "M HEALTH AI can make mistakes. Check important information."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
