import ChatContent from "@/components/chatbot/ChatContent";
import NavHeader from "@/components/utility/header/NavHeader";
import { getChatHistory, getChatSession } from "@/lib/chatbot/getChatActivity";
import { getLatest3Medical } from "@/lib/medical/getMedical";
import { getLatest3Packages } from "@/lib/packages/getPackages";
import { getLatest3Wellness } from "@/lib/wellness/getWellness";
import { CircleAlert, TriangleAlert } from "lucide-react";
import { cookies } from "next/headers";

type paramsType = Promise<{ slug: string }>;

export default async function SessionPage(props: { params: paramsType }) {
  const { slug } = await props.params;
  // Anda juga bisa melakukan fetch chat data di Server Side di sini (opsional tapi disarankan untuk SEO/Speed)
  // Tapi untuk sekarang kita pakai logic Client Side yang sudah ada di ChatContent
  const { data: packages } = await getLatest3Packages();
  const { data: medical } = await getLatest3Medical();
  const { data: wellness } = await getLatest3Wellness();
  const cookie = await cookies();
  const getPublicID = cookie.get("mhealth_public_id");
  const publicID = getPublicID?.value as string;

  const historyData = await getChatHistory(publicID);

  const sessionID = slug as string;

  const session = await getChatSession(sessionID);

  return (
    <>
      <NavHeader />
      {session.warning ? (
        <div className="flex justify-center items-center w-full min-h-[calc(100vh-12vh)]">
          <div className="bg-yellow-50 text-yellow-600 border border-yellow-600 p-4 rounded-2xl flex flex-col gap-2">
            <div className="bg-white rounded-full border border-yellow-600 h-8 w-8 flex justify-center items-center mt-1">
              <CircleAlert className="size-5" />
            </div>
            <div>
              <h5 className="font-bold">Gagal Memuat Data</h5>
              <p>{session.warning}</p>
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
          session={session.data} // Kirim ID dari URL
          publicIDFetch={publicID}
        />
      )}
    </>
  );
}
