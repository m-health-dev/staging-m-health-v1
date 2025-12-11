import ChatContent from "@/components/chatbot/ChatContent";
import { Button } from "@/components/ui/button";
import NavHeader from "@/components/utility/header/NavHeader";
import { routing } from "@/i18n/routing";
import { getUserInfo } from "@/lib/auth/getUserInfo";
import { getChatHistory, getChatSession } from "@/lib/chatbot/getChatActivity";
import { getAllMedical } from "@/lib/medical/get-medical";
import { getLatest3Medical } from "@/lib/medical/getMedical";
import { getAllPackages } from "@/lib/packages/get-packages";
import { getLatest3Packages } from "@/lib/packages/getPackages";
import { getAllWellness } from "@/lib/wellness/get-wellness";
import { getLatest3Wellness } from "@/lib/wellness/getWellness";
import { createClient } from "@/utils/supabase/server";
import { CircleAlert, MessageCircle, TriangleAlert } from "lucide-react";
import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

type paramsType = Promise<{ slug: string }>;

export default async function SessionPage(props: { params: paramsType }) {
  const { slug } = await props.params;

  const packages = await (await getAllPackages(1, 3)).data;
  const medical = (await getAllMedical(1, 3)).data;
  const wellness = (await getAllWellness(1, 3)).data;
  const cookie = await cookies();
  const getPublicID = cookie.get("mhealth_public_id");
  const publicID = getPublicID?.value as string;
  const locale = await getLocale();

  const historyData = await getChatHistory(publicID);

  const sessionID = slug as string;

  const sessionChat = await getChatSession(sessionID);

  // const checkSession = publicID === sessionChat.publicID;

  // console.log(checkSession);

  if (sessionChat.error) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token!;

  let userData;

  if (accessToken) {
    userData = await getUserInfo(accessToken);
  }

  return (
    <>
      {/* <NavHeader /> */}
      {sessionChat.error ? (
        <div className="flex justify-center items-center w-full min-h-screen">
          <div className="bg-white border border-primary p-4 rounded-2xl flex flex-col gap-2">
            {/* <div className="bg-white rounded-full border border-yellow-600 h-8 w-8 flex justify-center items-center mt-1">
              <CircleAlert className="size-5" />
            </div> */}
            <div>
              <h2 className="text-health font-bold mb-2">404</h2>
              <h5 className="font-bold text-primary">
                {locale === routing.defaultLocale
                  ? "Gagal Memuat Sesi Percakapan"
                  : "Failed to get chat session data"}
              </h5>
              <p className="text-muted-foreground">
                {" "}
                {locale === routing.defaultLocale
                  ? "Sesi percakapan ini telah dihapus atau diarsipkan."
                  : "This chat session has been deleted or archived."}
              </p>
              <Link href="/">
                <Button className="flex items-center lg:w-fit w-full rounded-full mt-3">
                  <MessageCircle />
                  {locale === routing.defaultLocale
                    ? "Mulai Percakapan Baru"
                    : "Start New Chat"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <ChatContent
          packages={packages}
          medical={medical}
          wellness={wellness}
          history={historyData.data}
          sessionID={sessionID}
          session={sessionChat.data} // Kirim ID dari URL
          publicIDFetch={publicID}
          user={userData}
        />
      )}
    </>
  );
}
