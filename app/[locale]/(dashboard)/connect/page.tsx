import { getUserInfo } from "@/lib/auth/getUserInfo";
import { createClient } from "@/utils/supabase/server";
import CWDComponent from "./cwd-component";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

const CWDPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const supabase = await createClient();
  const session = (await searchParams).session;
  const chatSession = String(session);

  const { data: sessionChat } = await supabase
    .from("chat_activity")
    .select("id")
    .eq("id", chatSession);

  if (
    !sessionChat ||
    chatSession === undefined ||
    chatSession === null ||
    !session ||
    !chatSession
  ) {
    notFound();
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

  console.log(session);

  const cookie = await cookies();

  const getPublicID = cookie.get("mhealth_public_id");
  const publicID = getPublicID?.value as string;

  const { data: dateBooked, error: errorDateBooked } = await supabase
    .from("consult_schedule")
    .select("scheduled_datetime");

  return (
    <CWDComponent
      accounts={userData}
      publicID={publicID}
      dateBooked={dateBooked}
      chatSession={chatSession}
    />
  );
};

export default CWDPage;
