import LocalDateTime from "@/components/utility/lang/LocaleDateTime";
import { routing } from "@/i18n/routing";
import { getUserInfo } from "@/lib/auth/getUserInfo";
import { getChatHistoryByUserID } from "@/lib/chatbot/getChatActivity";
import { ChatHistory } from "@/types/chat.types";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { nanoid } from "nanoid";
import React from "react";
import Link from "next/link";
import ContainerWrap from "@/components/utility/ContainerWrap";

const ChatActivityDash = async () => {
  const supabase = await createClient();
  const locale = await getLocale();

  const user = (await supabase.auth.getUser()).data;
  const userID = user.user?.id;

  const history: any[] = (await getChatHistoryByUserID(userID!, 1, 10)).data
    .data;
  return (
    <div>
      <ContainerWrap>
        <div className="py-10">
          <h2 className="font-semibold text-primary">
            {locale === routing.defaultLocale
              ? "Riwayat Percakapan"
              : "Chat Activity"}
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
          {history.map((h, i) => {
            const id = nanoid();
            return (
              <div key={id} className="bg-white rounded-2xl border p-4">
                <Link href={`/${locale}/c/${h.id}`} target="_blank">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      {h.chat_activity_data.urgent && (
                        <p className="capitalize bg-red-50 border border-red-600 text-red-600 inline-flex px-3 py-1 rounded-full text-sm!">
                          Urgent
                        </p>
                      )}
                      {h.status === "public" ? (
                        <p className="capitalize bg-blue-50 border border-blue-600 text-blue-600 inline-flex px-3 py-1 rounded-full text-sm!">
                          {h.status}
                        </p>
                      ) : (
                        <p className="capitalize bg-amber-50 border border-amber-600 text-amber-600 inline-flex px-3 py-1 rounded-full text-sm!">
                          {h.status}
                        </p>
                      )}
                    </div>
                  </div>
                  <h5 className="text-primary font-semibold mb-4">{h.title}</h5>
                  <p className="text-sm! text-muted-foreground">
                    {locale === routing.defaultLocale
                      ? "Dibuat pada"
                      : "Created at"}
                  </p>
                  <p>
                    <LocalDateTime date={h.created_at} />
                  </p>
                  <p className="text-sm! text-muted-foreground mt-2">
                    {locale === routing.defaultLocale
                      ? "Terakhir Diperbarui pada"
                      : "Last Updated at"}
                  </p>
                  <p>
                    <LocalDateTime date={h.updated_at} />
                  </p>
                </Link>
              </div>
            );
          })}
        </div>
      </ContainerWrap>
    </div>
  );
};

export default ChatActivityDash;
