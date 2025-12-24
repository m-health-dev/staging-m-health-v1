import ChatContent from "@/components/chatbot/ChatContent";
import { getUserInfo } from "@/lib/auth/getUserInfo";
import {
  getChatHistory,
  getChatHistoryByUserID,
} from "@/lib/chatbot/getChatActivity";
import { getAllMedical, getAllPublicMedical } from "@/lib/medical/get-medical";
import {
  getAllPackages,
  getAllPublicPackages,
} from "@/lib/packages/get-packages";
import {
  getAllPublicWellness,
  getAllWellness,
} from "@/lib/wellness/get-wellness";
import { createClient } from "@/utils/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

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
    getAllPublicPackages(1, 3),
    getAllPublicMedical(1, 3),
    getAllPublicWellness(1, 3),
    getLocale(),
  ]);

  const packages = Array.isArray(packagesResult?.data)
    ? packagesResult.data
    : [];

  const medical = Array.isArray(medicalResult?.data) ? medicalResult.data : [];

  const wellness = Array.isArray(wellnessResult?.data)
    ? wellnessResult.data
    : [];

  const { data: user, error } = await supabase.auth.getUser();

  const checkUser = user.user;

  let userID;

  if (checkUser) {
    userID = user.user?.id;
  }

  const historyData = checkUser
    ? await getChatHistoryByUserID(userID!, 1, 10)
    : publicID
    ? await getChatHistory(publicID, 1, 10)
    : { data: [], total: 0 };

  let userData = null;

  if (session?.access_token) {
    try {
      userData = await getUserInfo(session.access_token);
    } catch (e) {
      console.error("User info fetch failed:", e);
    }
  }

  console.log({ checkUser, session, userID, userData, publicID, historyData });

  return (
    <ChatContent
      packages={packages}
      medical={medical}
      wellness={wellness}
      initialHistory={historyData.data.data || []}
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
