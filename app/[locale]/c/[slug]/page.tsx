import ChatContent from "@/components/chatbot/ChatContent";
import PrivateChat from "@/components/chatbot/private-chat";
import UnderConstruction from "@/components/utility/under-construction";
import { routing } from "@/i18n/routing";
import { getUserInfo } from "@/lib/auth/getUserInfo";
import { GetChatStatus } from "@/lib/chatbot/chat-status";
import {
  getChatHistory,
  getChatHistoryByUserID,
  getChatSession,
  getShareSlug,
} from "@/lib/chatbot/getChatActivity";
import { getAllMedical } from "@/lib/medical/get-medical";
import { getAllPackages } from "@/lib/packages/get-packages";
import { getAllWellness } from "@/lib/wellness/get-wellness";
import { createClient } from "@/utils/supabase/server";
import { hi } from "date-fns/locale";
import type { Metadata, ResolvingMetadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { toast } from "sonner";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug;

  const locale = await getLocale();

  const { data, all } = await getChatSession(slug);
  console.log({ data, all });

  return {
    title: `${all.data.title}`,
    description: `M HEALTH Chat Session`,
    openGraph: {
      title: `${all.data.title}`,
      description: `M HEALTH Chat Session`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(
            all.data.title
          )}&description=${encodeURIComponent(
            "M HEALTH Chat Session"
          )}&path=${encodeURIComponent(`m-health.id/c/${slug}`)}`,
          width: 800,
          height: 450,
        },
      ],
    },
  };
}

export default async function SessionPage({ params }: Props) {
  const { slug } = await params;

  const [locale, cookieStore] = await Promise.all([getLocale(), cookies()]);

  const publicID = cookieStore.get("mhealth_public_id")?.value;

  const sessionID = slug;

  // console.log(sessionID);

  const t = await getTranslations("utility");

  const [packagesRes, medical, wellness, sessionChat, shareSlug, supabase] =
    await Promise.all([
      getAllPackages(1, 3),
      getAllMedical(1, 3),
      getAllWellness(1, 3),
      getChatSession(sessionID),
      getShareSlug(sessionID),
      createClient(),
    ]);

  const { data: user, error } = await supabase.auth.getUser();

  const checkUser = user.user;

  let userID;

  if (checkUser) {
    userID = user.user?.id;
  }

  const shareSlugData = shareSlug.shareSlug;

  if (sessionChat.error) {
    console.error(`${sessionChat.error}`);
    notFound();
  }

  const historyData = checkUser
    ? await getChatHistoryByUserID(userID!, 1, 10)
    : publicID
    ? await getChatHistory(publicID, 1, 10)
    : { data: [], total: 0 };
  // console.log("History: ", historyData);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  let userData = null;

  if (session?.access_token) {
    try {
      userData = await getUserInfo(session.access_token);
    } catch (e) {
      console.error("User info fetch failed:", e);
    }
  }

  const chatStatus = (await GetChatStatus(sessionID)).data;

  // console.log("Session Chat Data: ", sessionChat);

  console.log("Is Same User: ", userID === sessionChat.all.data.user_id);
  console.log(
    "Is Same Public ID: ",
    publicID === sessionChat.all.data.public_id
  );

  const isPublicMatch =
    Boolean(publicID) && publicID === sessionChat.all.data.public_id;

  const isUserMatch =
    Boolean(userID) && userID === sessionChat.all.data.user_id;

  if (!isPublicMatch && !isUserMatch) {
    return <PrivateChat />;
  }

  const urgent = sessionChat.urgent;

  console.log({
    checkUser,
    session,
    userID,
    userData,
    publicID,
    historyData,
    urgent,
  });

  return (
    <>
      <ChatContent
        packages={packagesRes.data}
        medical={medical.data}
        wellness={wellness.data}
        initialHistory={historyData.data.data || []}
        sessionID={sessionID}
        session={sessionChat.data}
        publicIDFetch={publicID}
        user={userData}
        locale={locale}
        urgent={urgent}
        status={chatStatus}
        shareSlug={shareSlugData}
        type="default"
        labels={{
          delete: t("delete"),
          cancel: t("cancel"),
        }}
      />
    </>
  );
}
