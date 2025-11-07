"use client";

import React, { useState, ReactNode, ReactElement } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeSanitize from "rehype-sanitize";
import LocalDateTime from "../utility/LocaleDateTime";
import { Check, Copy, Undo2 } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface ChatMessageProps {
  message: string;
  sender: "user" | "bot";
  timestamp?: string;
  onReply?: (message: string) => void;
  replyTo?: string | null;
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
  sender,
  timestamp,
  onReply,
  replyTo,
}) => {
  const isUser = sender === "user";
  const [copied, setCopied] = useState(false);

  const phoneNumber = "08159880048";

  const hasConsultation = message.includes("consultation");
  let cleanMessage = message
    .replaceAll("consultation", "")
    .replaceAll("[", "")
    .replaceAll("]", "")
    .replaceAll("RESPON UNTUK DEVELOPER:", "")
    .replaceAll(`{ "consultaion" : true }`, ``)
    .trim();
  const hasPhone = message.includes(phoneNumber);

  const whatsappLink = `https://wa.me/${phoneNumber.replace("0", "62")}`;

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
    const text = String(message ?? "");

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-8 group`}
    >
      <div
        className={`relative p-5 rounded-2xl transition-all ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-none max-w-xs lg:max-w-md"
            : "bg-white text-foreground rounded-bl-none max-w-full"
        }`}
      >
        <div className="action_button absolute -top-4 right-2 bg-white inline-flex gap-3 p-2 rounded-full shadow-sm">
          <button
            onClick={() => onReply?.(cleanMessage)}
            className="text-muted-foreground pointer-events-auto cursor-pointer"
            title="Reply"
          >
            <Undo2 className="size-4" />
          </button>

          <button
            onClick={handleCopy}
            className=" text-muted-foreground pointer-events-auto cursor-pointer"
            title="Salin pesan"
          >
            {copied ? (
              <Check className="size-4 text-green-500" />
            ) : (
              <Copy className="size-4" />
            )}
          </button>
        </div>

        {replyTo && (
          <div
            className={`mb-3 p-3 rounded-xl text-sm!${
              isUser
                ? "border-white/70 bg-white/20 text-white/80"
                : "border-primary/50 bg-primary/5 text-foreground/80"
            }`}
          >
            <p className="text-xs! font-semibold mb-1 opacity-70 flex items-center gap-1">
              <Undo2 className="size-3" /> Membalas:
            </p>
            <p className="text-sm line-clamp-2">{replyTo}</p>
          </div>
        )}

        {/* Markdown Renderer */}
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeSanitize]}
          components={{
            h1: (props) => (
              <h1
                className="text-2xl! font-semibold mb-4 font-sans"
                {...props}
              />
            ),
            h2: (props) => (
              <h2
                className="text-xl! font-semibold mb-3 font-sans"
                {...props}
              />
            ),
            h3: (props) => (
              <h3
                className="text-lg! font-semibold mb-2 font-sans"
                {...props}
              />
            ),
            h4: (props) => (
              <h3
                className="text-[18px]! font-semibold mb-2 font-sans"
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
              <strong className="font-semibold text-primary" {...props} />
            ),
            em: (props) => <em className="italic text-primary/90" {...props} />,
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
            hr: (props) => <hr className="my-3 border-primary/30" {...props} />,
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

        {!isUser && hasConsultation && (
          <div className="mt-3 mb-5">
            <Link
              href={`/connect?status=emergency`}
              className="lg:w-fit w-full"
            >
              <Button
                variant="default"
                size={"lg"}
                className="rounded-full bg-health hover:bg-health/80 lg:w-fit w-full cursor-pointer pointer-events-auto"
              >
                Konsultasi dengan Dokter
              </Button>
            </Link>
          </div>
        )}
        {/* Timestamp */}
        {timestamp && (
          <p
            className={`text-xs! mt-1 ${
              isUser
                ? "text-primary-foreground/70 text-end"
                : "text-muted-foreground"
            }`}
          >
            <LocalDateTime date={timestamp} />
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
