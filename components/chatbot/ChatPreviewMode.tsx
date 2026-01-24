"use client";

import type React from "react";
import { Stethoscope } from "lucide-react";
import { routing } from "@/i18n/routing";
import ChatStart from "./ChatStart";
import AvatarUser from "../utility/AvatarUser";
import ContainerWrap from "../utility/ContainerWrap";
import type { Account } from "@/types/account.types";
import type { Message } from "./ChatWindow";

interface ChatPreviewModeProps {
  urgent?: boolean;
  locale: string;
  userID?: string;
  selectedChat: Message[];
  session?: any[];
  sessionID?: string;
  publicID: string;
  user?: Account;
  onNewMessage?: () => void;
  consultSession?: any;
}

const ChatPreviewMode: React.FC<ChatPreviewModeProps> = ({
  urgent,
  locale,
  userID,
  selectedChat,
  session,
  sessionID,
  publicID,
  user,
  onNewMessage,
  consultSession,
}) => {
  return (
    <>
      {urgent && (
        <div className="w-full max-w-4xl mx-auto px-2 lg:px-6 sticky top-24 z-50">
          <div className="bg-green-50 text-green-600 border border-green-600 rounded-2xl p-4 flex flex-row items-center gap-4">
            <div className="w-6! h-6! bg-white rounded-full border border-green-600 text-green-600 flex justify-center items-center">
              <Stethoscope className="size-3 w-6" />
            </div>
            <p className="text-sm!">
              {locale === routing.defaultLocale
                ? "Sebagian informasi, dalam percakapan ini AI menyarankan untuk berkonsultasi dengan dokter agar mendapatkan penanganan yang tepat."
                : "For your information, in this conversation, AI recommends consulting a doctor for appropriate treatment."}
            </p>
          </div>
        </div>
      )}
      <ContainerWrap>
        {userID && (
          <div className="flex w-full flex-col bg-white p-3 border rounded-2xl mt-5">
            <p className="text-muted-foreground text-sm! mb-2">
              {locale === routing.defaultLocale
                ? "Dibuat oleh."
                : "Created by."}
            </p>
            <AvatarUser size="md" user={userID} locale={locale} />
          </div>
        )}
      </ContainerWrap>

      <ChatStart
        chat={selectedChat}
        type="preview"
        session={session}
        sessionID={sessionID}
        publicID={publicID}
        accounts={user}
        locale={locale}
        onNewMessage={onNewMessage}
      />
    </>
  );
};

export default ChatPreviewMode;
