import ChatContent from "@/components/chatbot/ChatContent";
import PrivateChat from "@/components/chatbot/private-chat";
import UnderConstruction from "@/components/utility/under-construction";
import { getUserInfo } from "@/lib/auth/getUserInfo";
import { GetChatStatus } from "@/lib/chatbot/chat-status";
import {
  getChatHistory,
  getChatHistoryByUserID,
  getChatSessionBySlug,
  getShareSlug,
} from "@/lib/chatbot/getChatActivity";
import { getAllMedical } from "@/lib/medical/get-medical";
import { getAllPackages } from "@/lib/packages/get-packages";
import { getAllWellness } from "@/lib/wellness/get-wellness";
import { createClient } from "@/utils/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type paramsType = Promise<{ slug: string }>;

export default async function ShareChatPage(props: { params: paramsType }) {
  const { slug } = await props.params;

  const [locale, cookieStore] = await Promise.all([getLocale(), cookies()]);

  const publicID = cookieStore.get("mhealth_public_id")?.value;

  const supabase = await createClient();

  // const { data: chat } = await supabase
  //   .from("chat_activity")
  //   .select("id, share_slug, status")
  //   .eq("share_slug", slug)
  //   .maybeSingle();

  const shareSlugData = slug;

  const { data: user } = await supabase.auth.getUser();

  const t = await getTranslations("utility");

  const [packagesRes, medical, wellness, sessionChat, shareSlug] =
    await Promise.all([
      getAllPackages(1, 3),
      getAllMedical(1, 3),
      getAllWellness(1, 3),
      getChatSessionBySlug(shareSlugData),
      getShareSlug(shareSlugData),
    ]);

  const checkUser = user.user;

  let userID;

  if (checkUser) {
    userID = user.user?.id;
  }

  if (!sessionChat.success && sessionChat.status === 404) {
    notFound();
  }

  // console.log(sessionChat.error);

  const historyData = checkUser
    ? await getChatHistoryByUserID(userID!, 1, 10)
    : publicID
    ? await getChatHistory(publicID, 1, 10)
    : { data: [], total: 0 };

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userData = session?.access_token
    ? await getUserInfo(session.access_token)
    : undefined;

  if (sessionChat.publicStatus !== "public") {
    return <PrivateChat />;
  }

  const urgent = sessionChat.urgent;
  // console.log("Urgent Status: ", urgent);

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
        sessionID={sessionChat.session}
        session={sessionChat.data}
        publicIDFetch={publicID}
        user={userData}
        locale={locale}
        urgent={urgent}
        status={sessionChat.publicStatus}
        shareSlug={shareSlug.data}
        type="share"
        labels={{
          delete: t("delete"),
          cancel: t("cancel"),
        }}
      />
    </>
  );
}
