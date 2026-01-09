import React from "react";
import { notFound } from "next/navigation";
import { getWellnessByID } from "@/lib/wellness/get-wellness";
import { getChatSession } from "@/lib/chatbot/getChatActivity";
import ChatContent from "@/components/chatbot/ChatContent";
import { getLocale } from "next-intl/server";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { Studio1DeleteCopyFunction } from "@/components/package-wellness-medical/package-wellness-medical-delete-copy-function";
import { DeleteChatSession } from "@/lib/chatbot/delete-chat-activity";
import HeaderPreviewChat from "./headerPreviewChat";
import AvatarUser from "@/components/utility/AvatarUser";

const PreviewChatSessionPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { all, data: sessionChat } = await getChatSession(id);
  const locale = await getLocale();
  const urgent = sessionChat.urgent;

  console.log({ all });

  if (sessionChat.error) {
    notFound();
  }
  return (
    <div>
      <div className="sticky top-0 z-20 bg-linear-to-b from-background via-background to-transparent">
        <HeaderPreviewChat id={id} locale={locale} all={all} />
      </div>

      <ChatContent
        type="preview"
        sessionID={id}
        userID={all.data.user_id}
        session={sessionChat}
        locale={locale}
        urgent={urgent}
      />
    </div>
  );
};

export default PreviewChatSessionPage;
