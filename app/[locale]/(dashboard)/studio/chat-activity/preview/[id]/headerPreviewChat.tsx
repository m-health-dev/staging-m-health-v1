"use client";

import { Studio1DeleteCopyFunction } from "@/components/package-wellness-medical/package-wellness-medical-delete-copy-function";
import ContainerWrap from "@/components/utility/ContainerWrap";
import { baseUrl } from "@/helper/baseUrl";
import { DeleteChatSession } from "@/lib/chatbot/delete-chat-activity";
import { useRouter } from "next/navigation";
import React from "react";

const HeaderPreviewChat = ({
  all,
  id,
  locale,
}: {
  all: any;
  id: string;
  locale: string;
}) => {
  const router = useRouter();
  return (
    <ContainerWrap>
      <div className="flex flex-row justify-between items-center sticky top-0 z-20 pt-6 pb-1">
        <div className="">
          <h5 className="text-primary font-semibold capitalize">
            {all.data.title}
          </h5>
        </div>
        <Studio1DeleteCopyFunction
          id={id}
          deleteAction={DeleteChatSession}
          name={all.title}
          locale={locale}
          resourceLabel="Chat Session"
          router={router}
          slug={`${baseUrl}/${locale}/c/${id}`}
        />
      </div>
    </ContainerWrap>
  );
};

export default HeaderPreviewChat;
