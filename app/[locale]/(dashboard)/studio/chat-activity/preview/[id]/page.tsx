import React from "react";
import { notFound } from "next/navigation";

import { getChatSession } from "@/lib/chatbot/getChatActivity";
import ChatContent from "@/components/chatbot/ChatContent";
import { getLocale } from "next-intl/server";

import HeaderPreviewChat from "./headerPreviewChat";

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
