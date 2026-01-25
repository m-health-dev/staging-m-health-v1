"use client";

import React, {
  useState,
  ReactNode,
  ReactElement,
  Suspense,
  act,
  useRef,
  useEffect,
} from "react";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeSanitize from "rehype-sanitize";
import LocalDateTime from "../utility/lang/LocaleDateTime";
import { Check, ClipboardPlus, Copy, Undo2 } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import dynamic from "next/dynamic";
import { Skeleton } from "../ui/skeleton";
import { Spinner } from "../ui/spinner";
import { cn } from "@/lib/utils";
import LoadingChat from "../utility/loading-chat";
import VendorCard from "../vendor-hotel/vendor-card";
import VendorCardSlide from "../vendor-hotel/vendor-card-slide";
import MedicalCardSlide from "../medical/medical-card-slide";
import PackageCardSlide from "../package/package-card-slide";
import WellnessCardSlide from "../wellness/wellness-card-slide";
import HotelCardSlide from "../vendor-hotel/hotel-card-slide";
import DoctorCardSlide from "../doctor/doctor-card-slide";
import LazyActionItem from "./LazyActionItem";
import { get } from "node:http";
import InsuranceCardSlide from "../insurance/insurance-card-slide";
import Image from "next/image";

const ReactMarkdown = dynamic(() => import("react-markdown"), {
  ssr: false,
});

interface ChatMessageProps {
  message: string;
  id: string;
  sender: "user" | "bot";
  timestamp?: string;
  onReply?: (message: string) => void;
  replyTo?: {
    message?: string | null;
    sender?: string | null;
  };
  sessionId?: string;
  urgent?: boolean;
  isStreaming?: boolean;
  actions?: {
    type: string;
    ids: any[];
  }[];
}

function flattenListChildren(children: ReactNode): ReactNode {
  return React.Children.toArray(children).map((child) => {
    if (React.isValidElement(child)) {
      const element = child as ReactElement<{ children?: ReactNode }>;
      if (element.type === "p") {
        return element.props.children;
      }
    }
    return child;
  });
}
const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  id,
  sender,
  timestamp,
  onReply,
  replyTo,
  sessionId,
  urgent,
  isStreaming,
  actions,
}) => {
  const isUser = sender === "user";
  const [copied, setCopied] = useState(false);
  const locale = useLocale();

  const phoneNumber = "082310172457";

  const [chatID, setChatID] = useState("");

  useEffect(() => {
    // Fungsi untuk mengambil ID dari URL
    const updateChatID = () => {
      const pathParts = window.location.pathname.split("/");
      // Sesuaikan index-nya (biasanya index 3 untuk /[locale]/c/[id])
      setChatID(pathParts[3] || "");
    };

    // Jalankan saat pertama kali mount
    updateChatID();

    // Dengarkan event custom 'urlchange' yang dikirim dari ChatStart
    window.addEventListener("urlchange", updateChatID);

    // Dengarkan juga popstate (untuk tombol back/forward browser)
    window.addEventListener("popstate", updateChatID);

    return () => {
      window.removeEventListener("urlchange", updateChatID);
      window.removeEventListener("popstate", updateChatID);
    };
  }, []);

  let cleanMessage = message.trim();

  // const hasPhone = message.includes(phoneNumber);

  const whatsappLink = `https://wa.me/${phoneNumber.replace("0", "62")}`;

  // cleanMessage = cleanMessage.replace(
  //   /(^|\s)(consultation|konsultasi)(\s|$)/gi,
  //   " "
  // );

  cleanMessage = cleanMessage.replace(/[ \t]+/g, " ").trim();

  cleanMessage = cleanMessage.replaceAll(
    phoneNumber,
    `[${phoneNumber}](${whatsappLink})`,
  );

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  const handleCopy = async () => {
    const text = String(cleanMessage ?? "");

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      } catch (err) {
        console.warn("Clipboard API gagal, mencoba fallback...");
      }
    }

    // Fallback
    fallbackCopy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyNew = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      console.warn("Clipboard API tidak tersedia di lingkungan ini.");
      alert("Clipboard API tidak tersedia di browser Anda.");
      return;
    }

    try {
      await navigator.clipboard.writeText(String(message ?? ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin pesan:", err);
    }
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startX.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft.current = scrollRef.current?.scrollLeft || 0;
    scrollRef.current?.style.setProperty("cursor", "grabbing");
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current.offsetLeft || 0);
    const walk = (x - startX.current) * 2; // Kecepatan scroll
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    scrollRef.current?.style.removeProperty("cursor");
  };

  // Efek untuk mouse leave dan wheel
  useEffect(() => {
    const ref = scrollRef.current;
    if (!ref) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) {
        // Horizontal wheel
        e.preventDefault();
        ref.scrollBy({ left: e.deltaX * 2, behavior: "smooth" });
      }
    };

    ref.addEventListener("wheel", handleWheel, { passive: false });
    return () => ref.removeEventListener("wheel", handleWheel);
  }, []);

  // console.log("reply to message:", replyTo);

  return (
    <div
      // initial={{ opacity: 0, y: 10 }}
      // animate={{ opacity: 1, y: 0 }}
      // transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-8 group`}
      id={id}
    >
      <div>
        <div
          className={`relative rounded-2xl transition-all duration-300 text-wrap wrap-anywhere ${
            isUser
              ? "bg-primary text-primary-foreground rounded-br-none max-w-xs lg:max-w-md lg:px-5 px-3 lg:pt-5 pt-3 lg:pb-3 pb-0.5"
              : `${
                  message ? "bg-white" : "bg-transparent"
                } text-foreground rounded-bl-none max-w-full lg:px-5 px-3 lg:pt-5 pt-3 lg:pb-3 pb-0.5`
          }`}
        >
          {!replyTo?.message ? (
            <p className="hidden sr-only">No Message Replied</p>
          ) : (
            <div
              className={`mb-3 p-3 rounded-xl text-sm!${
                isUser
                  ? "border-white/70 bg-white/20 text-white/80"
                  : "border-primary/50 bg-primary/5 text-foreground/80"
              }`}
            >
              <p className="text-xs! font-bold mb-1 opacity-70 flex items-center gap-1">
                <Undo2 className="size-3" />{" "}
                {locale === routing.defaultLocale ? "Membalas" : "Reply To"}
              </p>
              <p className="text-sm line-clamp-2">{replyTo?.message}</p>
            </div>
          )}

          <div className="md:max-w-full max-w-[calc(100vw-12vw)]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              rehypePlugins={[rehypeSanitize]}
              components={{
                h1: (props) => (
                  <h1
                    className="text-2xl! font-bold mb-4 font-sans"
                    {...props}
                  />
                ),
                h2: (props) => (
                  <h2
                    className="text-xl! font-bold mb-3 font-sans"
                    {...props}
                  />
                ),
                h3: (props) => (
                  <h3
                    className="text-lg! font-bold mb-2 font-sans"
                    {...props}
                  />
                ),
                h4: (props) => (
                  <h3
                    className="text-[18px]! font-bold mb-2 font-sans"
                    {...props}
                  />
                ),
                p: ({ node, children, ...props }) => (
                  <p
                    className="text-base leading-relaxed mb-3 font-sans"
                    {...props}
                  >
                    {children}
                  </p>
                ),
                ul: (props) => (
                  <ul
                    className="list-disc list-inside space-y-1 mb-3 font-sans"
                    {...props}
                  />
                ),
                ol: (props) => (
                  <ol
                    className="list-decimal list-inside space-y-1 mb-3 font-sans"
                    {...props}
                  />
                ),
                li: ({ children, ...props }) => {
                  const flattened = flattenListChildren(children);
                  return (
                    <li
                      className="ml-4 text-base leading-relaxed font-sans"
                      {...props}
                    >
                      {flattened}
                    </li>
                  );
                },
                strong: (props) => (
                  <strong className="font-bold text-primary" {...props} />
                ),
                em: (props) => (
                  <em className="italic text-primary/90" {...props} />
                ),
                pre: (props) => (
                  <pre
                    className="bg-gray-100 p-4 rounded-2xl font-mono mb-4 overflow-x-auto"
                    {...props}
                  />
                ),
                code: (props) => (
                  <code
                    className="bg-gray-200 text-primary font-mono px-1.5 py-0.5 rounded"
                    {...props}
                  />
                ),
                blockquote: (props) => (
                  <blockquote
                    className="border-l-4 border-primary pl-3 italic text-primary/80 mb-3"
                    {...props}
                  />
                ),
                br: (props) => <br {...props} />,
                hr: (props) => (
                  <hr className="mb-5 border-primary/30" {...props} />
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-health underline underline-offset-2 decoration-2"
                  >
                    {children}
                  </a>
                ),

                table: (props) => (
                  // <div className="relative lg:w-full w-1/2 my-4">
                  <div
                    className="
                    relative 
                    my-4
        overflow-x-auto
        rounded-xl
        border border-primary/20
        bg-white
      "
                  >
                    <table
                      className="w-full min-w-[600px]  border-collapse text-sm table-fixed"
                      {...props}
                    />
                  </div>
                  // </div>
                ),

                thead: (props) => (
                  <thead
                    className="bg-primary/10 sticky top-0 z-10"
                    {...props}
                  />
                ),

                tbody: (props) => (
                  <tbody className="divide-y divide-primary/10" {...props} />
                ),

                tr: (props) => (
                  <tr
                    className="hover:bg-primary/5 transition-colors"
                    {...props}
                  />
                ),

                th: (props) => (
                  <th
                    className="
      px-4 py-3
      text-left text-xs lg:text-sm
      font-semibold text-primary
      border-b border-primary/20
      whitespace-nowrap
    "
                    {...props}
                  />
                ),

                td: ({ children, ...props }) => (
                  <td
                    className="
      px-4 py-2
      text-sm text-foreground
      align-top
      whitespace-normal
    "
                    {...props}
                  >
                    {children}
                  </td>
                ),
              }}
            >
              {cleanMessage}
            </ReactMarkdown>
          </div>

          {/* Streaming indicator - hanya muncul saat belum ada message */}
          {isStreaming && !isUser && !message.trim() && (
            <div className="mb-2">
              <LoadingChat />
            </div>
          )}

          {/* {actions && (
            <pre className="mb-5">{JSON.stringify(actions, null, 2)}</pre>
          )} */}
          {actions && (
            <div
              className={cn(
                "space-y-5 ",
                actions.map((a, i) =>
                  a.type === "consultation" ? "" : "mt-5 lg:mb-5 mb-3",
                ),
              )}
            >
              {actions?.map((action, actionIndex) => (
                <div key={actionIndex}>
                  {action.type === "packages" && action.ids.length > 0 && (
                    <LazyActionItem
                      index={actionIndex}
                      delay={200}
                      minHeight="250px"
                      rootMargin="50px"
                    >
                      <div>
                        <h4 className="font-semibold text-primary mb-5">
                          {locale === routing.defaultLocale
                            ? "Program Terkait"
                            : "Related Programs"}
                        </h4>
                        <div
                          key={actionIndex}
                          ref={scrollRef}
                          className={cn(
                            "flex flex-row overflow-x-auto cursor-grab active:cursor-grabbing gap-4 p-5 rounded-2xl select-none bg-linear-to-t from-transparent via-background to-background",
                          )}
                          onMouseDown={handleMouseDown}
                          onMouseMove={handleMouseMove}
                          onMouseUp={handleMouseUp}
                          onMouseLeave={handleMouseUp}
                        >
                          {action.ids.map((item: any, index: number) => (
                            <div
                              key={index}
                              className="lg:w-4/10 w-9/10 h-auto shrink-0"
                            >
                              <PackageCardSlide
                                key={index}
                                id={item}
                                locale={locale}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </LazyActionItem>
                  )}

                  {action.type === "medical" && action.ids.length > 0 && (
                    <LazyActionItem
                      index={actionIndex}
                      delay={200}
                      minHeight="250px"
                      rootMargin="50px"
                    >
                      <div>
                        <h4 className="font-semibold text-primary mb-5">
                          {locale === routing.defaultLocale
                            ? "Layanan Medis Terkait"
                            : "Related Medical Services"}
                        </h4>
                        <div
                          key={actionIndex}
                          ref={scrollRef}
                          className={cn(
                            "flex flex-row overflow-x-auto cursor-grab active:cursor-grabbing gap-4 p-5 rounded-2xl select-none bg-linear-to-t from-transparent via-background to-background",
                          )}
                          onMouseDown={handleMouseDown}
                          onMouseMove={handleMouseMove}
                          onMouseUp={handleMouseUp}
                          onMouseLeave={handleMouseUp}
                        >
                          {action.ids.map((item: any, index: number) => (
                            <div
                              key={index}
                              className="lg:w-4/10 w-9/10 h-auto shrink-0"
                            >
                              <MedicalCardSlide
                                key={index}
                                id={item}
                                locale={locale}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </LazyActionItem>
                  )}

                  {action.type === "wellness" && action.ids.length > 0 && (
                    <LazyActionItem
                      index={actionIndex}
                      delay={200}
                      minHeight="250px"
                      rootMargin="50px"
                    >
                      <div>
                        <h4 className="font-semibold text-primary mb-5">
                          {locale === routing.defaultLocale
                            ? "Paket Kebugaran Terkait"
                            : "Related Wellness Packages"}
                        </h4>
                        <div
                          key={actionIndex}
                          ref={scrollRef}
                          className={cn(
                            "flex flex-row overflow-x-auto cursor-grab active:cursor-grabbing gap-4 p-5 rounded-2xl select-none bg-linear-to-t from-transparent via-background to-background",
                          )}
                          onMouseDown={handleMouseDown}
                          onMouseMove={handleMouseMove}
                          onMouseUp={handleMouseUp}
                          onMouseLeave={handleMouseUp}
                        >
                          {action.ids.map((item: any, index: number) => (
                            <div
                              key={index}
                              className="lg:w-4/10 w-9/10 h-auto shrink-0"
                            >
                              <WellnessCardSlide
                                key={index}
                                id={item}
                                locale={locale}
                                index={index}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </LazyActionItem>
                  )}

                  {action.type === "vendors" && action.ids.length > 0 && (
                    <LazyActionItem
                      index={actionIndex}
                      delay={200}
                      minHeight="250px"
                      rootMargin="50px"
                    >
                      <div>
                        <h4 className="font-semibold text-primary mb-5">
                          {locale === routing.defaultLocale
                            ? "Rumah Sakit/ Penyedia Terkait"
                            : "Related Hospitals/ Providers"}
                        </h4>
                        <div
                          key={actionIndex}
                          ref={scrollRef}
                          className={cn(
                            "flex flex-row overflow-x-auto cursor-grab active:cursor-grabbing gap-4 p-5 rounded-2xl select-none bg-linear-to-t from-transparent via-background to-background",
                          )}
                          onMouseDown={handleMouseDown}
                          onMouseMove={handleMouseMove}
                          onMouseUp={handleMouseUp}
                          onMouseLeave={handleMouseUp}
                        >
                          {action.ids.map((item: any, index: number) => (
                            <div
                              key={index}
                              className="lg:w-3/6 w-5/6 h-auto shrink-0"
                            >
                              <VendorCardSlide
                                key={index}
                                id={item}
                                locale={locale}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </LazyActionItem>
                  )}

                  {action.type === "insurance" && action.ids.length > 0 && (
                    <LazyActionItem
                      index={actionIndex}
                      delay={200}
                      minHeight="250px"
                      rootMargin="50px"
                    >
                      <div>
                        <h4 className="font-semibold text-primary mb-5">
                          {locale === routing.defaultLocale
                            ? "Asuransi Terkait"
                            : "Related Insurance"}
                        </h4>
                        <div
                          key={actionIndex}
                          ref={scrollRef}
                          className={cn(
                            "flex flex-row overflow-x-auto cursor-grab active:cursor-grabbing gap-4 p-5 rounded-2xl select-none bg-linear-to-t from-transparent via-background to-background",
                          )}
                          onMouseDown={handleMouseDown}
                          onMouseMove={handleMouseMove}
                          onMouseUp={handleMouseUp}
                          onMouseLeave={handleMouseUp}
                        >
                          {action.ids.map((item: any, index: number) => (
                            <div
                              key={index}
                              className="lg:w-3/6 w-5/6 h-auto shrink-0"
                            >
                              <InsuranceCardSlide
                                key={index}
                                id={item}
                                locale={locale}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </LazyActionItem>
                  )}

                  {action.type === "hotels" && action.ids.length > 0 && (
                    <LazyActionItem
                      index={actionIndex}
                      delay={200}
                      minHeight="250px"
                      rootMargin="50px"
                    >
                      <div>
                        <h4 className="font-semibold text-primary mb-5">
                          {locale === routing.defaultLocale
                            ? "Hotel Terkait"
                            : "Related Hotels"}
                        </h4>
                        <div
                          key={actionIndex}
                          ref={scrollRef}
                          className={cn(
                            "flex flex-row overflow-x-auto cursor-grab active:cursor-grabbing gap-4 p-5 rounded-2xl select-none bg-linear-to-t from-transparent via-background to-background",
                          )}
                          onMouseDown={handleMouseDown}
                          onMouseMove={handleMouseMove}
                          onMouseUp={handleMouseUp}
                          onMouseLeave={handleMouseUp}
                        >
                          {action.ids.map((item: any, index: number) => (
                            <div
                              key={index}
                              className="lg:w-3/6 w-5/6 h-auto shrink-0"
                            >
                              <HotelCardSlide
                                key={index}
                                id={item}
                                locale={locale}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </LazyActionItem>
                  )}

                  {action.type === "doctors" && action.ids.length > 0 && (
                    <LazyActionItem
                      index={actionIndex}
                      delay={200}
                      minHeight="250px"
                      rootMargin="50px"
                    >
                      <div>
                        <h4 className="font-semibold text-primary mb-5">
                          {locale === routing.defaultLocale
                            ? "Dokter Terkait"
                            : "Related Doctors"}
                        </h4>
                        <div
                          key={actionIndex}
                          ref={scrollRef}
                          className={cn(
                            "flex flex-row overflow-x-auto cursor-grab active:cursor-grabbing gap-4 p-5 rounded-2xl select-none bg-linear-to-t from-transparent via-background to-background",
                          )}
                          onMouseDown={handleMouseDown}
                          onMouseMove={handleMouseMove}
                          onMouseUp={handleMouseUp}
                          onMouseLeave={handleMouseUp}
                        >
                          {action.ids.map((item: any, index: number) => (
                            <div
                              key={index}
                              className="lg:w-3/6 w-5/6 h-auto shrink-0"
                            >
                              <DoctorCardSlide
                                key={index}
                                id={item}
                                locale={locale}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </LazyActionItem>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* 
          {actions && actions
            actions.type === "vendors" &&
            actions.ids.length > 0 &&
            actions.ids.map((item: any, index: number) => (
              <VendorCardSlide key={index} id={item} locale={locale} />
            ))} */}

          {!isUser && urgent && (
            <div className="mt-3 mb-5 bg-white py-10 px-3 rounded-2xl border w-full">
              <Link
                href={`/${locale}/connect?session=${sessionId || chatID}`}
                className="flex items-center justify-center w-full gap-3 flex-col"
              >
                <p className="text-center max-w-md">
                  {locale === routing.defaultLocale
                    ? "Jika anda ingin berkonsultasi dengan dokter untuk penanganan lebih lanjut, silakan klik tombol di bawah ini."
                    : "If you want to consult a doctor for further treatment, please click the button below."}
                </p>

                <Button
                  variant="default"
                  size={"lg"}
                  className="rounded-full bg-health hover:bg-health/80 lg:w-fit w-full cursor-pointer pointer-events-auto"
                >
                  <ClipboardPlus />{" "}
                  {locale === routing.defaultLocale
                    ? "Konsultasi dengan Dokter"
                    : "Start Consultation with Doctor"}
                </Button>

                <p className="border lg:rounded-full rounded-2xl px-4 py-2 text-center mt-5">
                  {locale === routing.defaultLocale
                    ? "Konsultasi akan dilakukan secara daring menggunakan Google Meet"
                    : "Consultation will be conducted online using Google Meet"}
                  <Image
                    src="https://hoocfkzapbmnldwmedrq.supabase.co/storage/v1/object/public/m-health-public/static/google_meet_icon.png"
                    width={20}
                    height={20}
                    alt="Google Meet Icon"
                    className="inline-block ml-2"
                  />
                </p>
              </Link>
            </div>
          )}
          {/* Timestamp */}
          {/* {timestamp && (
            <p
              className={`text-xs! mt-1 ${
                isUser
                  ? "text-primary-foreground/70 text-end"
                  : "text-muted-foreground"
              }`}
            >
              <LocalDateTime date={timestamp} />
            </p>
          )} */}
        </div>
        <div
          className={cn(
            `flex mt-2 group transition-all duration-300`,
            isUser ? "justify-end" : "justify-start",
            !isStreaming ? "opacity-100" : "opacity-0",
          )}
        >
          <div
            className={`action_button  inline-flex gap-0.5 bg-white  px-2 py-1.5 shadow-sm ${
              isUser
                ? "rounded-b-full rounded-tl-full"
                : "rounded-b-full rounded-tr-full"
            }   `}
          >
            <button
              onClick={() => onReply?.(cleanMessage)}
              className="text-muted-foreground pointer-events-auto cursor-pointer hover:bg-white p-1 rounded-full"
              title="Reply"
            >
              <Undo2 className="size-4.5" />
            </button>

            <button
              onClick={handleCopy}
              className=" text-muted-foreground pointer-events-auto cursor-pointer hover:bg-white p-1 rounded-full"
              title="Salin pesan"
            >
              {copied ? (
                <Check className="size-4 text-green-500" />
              ) : (
                <Copy className="size-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
