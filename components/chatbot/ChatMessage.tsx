"use client";

import React, { useState, ReactNode, ReactElement, Suspense } from "react";
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
}) => {
  const isUser = sender === "user";
  const [copied, setCopied] = useState(false);
  const locale = useLocale();

  const phoneNumber = "082310172457";

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
    `[${phoneNumber}](${whatsappLink})`
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
          className={`relative rounded-2xl transition-all text-wrap wrap-anywhere ${
            isUser
              ? "bg-primary text-primary-foreground rounded-br-none max-w-xs lg:max-w-md px-3 pt-3 pb-1"
              : "bg-white text-foreground rounded-bl-none max-w-full px-3 pt-3 pb-1"
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

          {/* Markdown Renderer */}
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeSanitize]}
            components={{
              h1: (props) => (
                <h1 className="text-2xl! font-bold mb-4 font-sans" {...props} />
              ),
              h2: (props) => (
                <h2 className="text-xl! font-bold mb-3 font-sans" {...props} />
              ),
              h3: (props) => (
                <h3 className="text-lg! font-bold mb-2 font-sans" {...props} />
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
            }}
          >
            {cleanMessage}
          </ReactMarkdown>

          {!isUser && urgent && (
            <div className="mt-3 mb-5 bg-white py-10 px-3 rounded-2xl border w-full">
              <Link
                href={`/${locale}/connect?session=${sessionId}`}
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
          className={`flex ${
            isUser ? "justify-end" : "justify-start"
          } mt-2 group`}
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
