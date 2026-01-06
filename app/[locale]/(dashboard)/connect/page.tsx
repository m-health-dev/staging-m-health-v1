import { getUserInfo } from "@/lib/auth/getUserInfo";
import { createClient } from "@/utils/supabase/server";
import CWDComponent from "./cwd-component";
import { cookies } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";

const CWDPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const supabase = await createClient();
  const params = await searchParams;
  const sessionParam = params.session;
  const sessionString = Array.isArray(sessionParam)
    ? sessionParam[0]
    : sessionParam;
  const chatSession =
    typeof sessionString === "string" && sessionString.trim()
      ? sessionString.trim()
      : undefined;

  let checkSession = false;

  if (chatSession) {
    const { data: sessionChat } = await supabase
      .from("chat_activity")
      .select("id")
      .eq("id", chatSession)
      .limit(1);

    checkSession = Array.isArray(sessionChat) && sessionChat.length > 0;
  }
  const { data, error: sessionError } = await supabase.auth.getSession();

  let userData = null;

  try {
    if (data?.session) {
      const accessToken = data.session.access_token;
      userData = await getUserInfo(accessToken);
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[CWDPage SSR ERROR]", err);
    }
  }

  // console.log(session);

  const cookie = await cookies();

  const getPublicID = cookie.get("mhealth_public_id");
  const publicID = getPublicID?.value as string;

  const { data: dateBooked, error: errorDateBooked } = await supabase
    .from("consult_schedule")
    .select("scheduled_datetime");

  const locale = await getLocale();
  const t = await getTranslations("consult");

  return (
    <CWDComponent
      accounts={userData}
      publicID={publicID}
      dateBooked={dateBooked}
      checkSession={checkSession}
      chatSession={chatSession}
      labels={{
        title: t("title"),
        desc: t("desc"),
      }}
      locale={locale}
    />
  );
};

export default CWDPage;
