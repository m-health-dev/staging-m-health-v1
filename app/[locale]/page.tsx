import ChatContent from "@/components/chatbot/ChatContent";
import { getUserInfo } from "@/lib/auth/getUserInfo";
import {
  getChatHistory,
  getChatHistoryByUserID,
} from "@/lib/chatbot/getChatActivity";
import { getAllMedical } from "@/lib/medical/get-medical";
import { getAllPackages } from "@/lib/packages/get-packages";
import { getAllWellness } from "@/lib/wellness/get-wellness";
import { createClient } from "@/utils/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Home() {
  const cookieStore = await cookies();
  const publicID = cookieStore.get("mhealth_public_id")?.value;

  const supabase = await createClient();

  const t = await getTranslations("utility");

  const [
    {
      data: { session },
    },
    packagesResult,
    medicalResult,
    wellnessResult,
    locale,
  ] = await Promise.all([
    supabase.auth.getSession(),
    getAllPackages(1, 3),
    getAllMedical(1, 3),
    getAllWellness(1, 3),
    getLocale(),
  ]);

  const { data: user, error } = await supabase.auth.getUser();

  const userID = user.user?.id;

  const historyData =
    publicID && userID
      ? await getChatHistoryByUserID(userID, 1, 10)
      : { data: [], total: 0 };

  const userData = session?.access_token
    ? await getUserInfo(session.access_token)
    : undefined;

  return (
    <ChatContent
      packages={packagesResult.data}
      medical={medicalResult.data}
      wellness={wellnessResult.data}
      initialHistory={historyData.data || []}
      publicIDFetch={publicID}
      user={userData}
      locale={locale}
      labels={{
        delete: t("delete"),
        cancel: t("cancel"),
      }}
    />
  );
}
