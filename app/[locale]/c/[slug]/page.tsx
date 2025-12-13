import ChatContent from "@/components/chatbot/ChatContent";
import { getUserInfo } from "@/lib/auth/getUserInfo";
import { getChatHistory, getChatSession } from "@/lib/chatbot/getChatActivity";
import { getAllMedical } from "@/lib/medical/get-medical";
import { getAllPackages } from "@/lib/packages/get-packages";
import { getAllWellness } from "@/lib/wellness/get-wellness";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type paramsType = Promise<{ slug: string }>;

export default async function SessionPage(props: { params: paramsType }) {
  const { slug } = await props.params;

  const [locale, cookieStore] = await Promise.all([getLocale(), cookies()]);

  const publicID = cookieStore.get("mhealth_public_id")?.value;

  const sessionID = slug;

  const [packagesRes, medical, wellness, sessionChat, supabase] =
    await Promise.all([
      getAllPackages(1, 3),
      getAllMedical(1, 3),
      getAllWellness(1, 3),
      getChatSession(sessionID),
      createClient(),
    ]);

  if (sessionChat.error) {
    notFound();
  }

  const historyData = publicID
    ? await getChatHistory(publicID)
    : { data: [], total: 0 };

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userData = session?.access_token
    ? await getUserInfo(session.access_token)
    : undefined;

  return (
    <ChatContent
      packages={packagesRes.data}
      medical={medical.data}
      wellness={wellness.data}
      initialHistory={historyData.data || []}
      sessionID={sessionID}
      session={sessionChat.data}
      publicIDFetch={publicID}
      user={userData}
      locale={locale}
    />
  );
}
