import ChatContent from "@/components/chatbot/ChatContent";
import Footer from "@/components/utility/footer/Footer";
import NavHeader from "@/components/utility/header/NavHeader";
import { baseUrl } from "@/helper/baseUrl";
import { getUserInfo } from "@/lib/auth/getUserInfo";
import { getChatHistory } from "@/lib/chatbot/getChatActivity";
import { getAllMedical } from "@/lib/medical/get-medical";
import { getAllPackages } from "@/lib/packages/get-packages";
import { getAllWellness } from "@/lib/wellness/get-wellness";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

import { v4 as uuidv4 } from "uuid";

export default async function Home() {
  const packages = await (await getAllPackages(1, 3)).data;
  const medical = (await getAllMedical(1, 3)).data;
  const wellness = (await getAllWellness(1, 3)).data;

  const cookie = await cookies();

  await fetch(`${baseUrl}/api/public-id`);

  const getPublicID = cookie.get("mhealth_public_id");
  const publicID = getPublicID?.value as string;

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token!;

  let userData;

  if (accessToken) {
    userData = await getUserInfo(accessToken);
  }

  const historyData = await getChatHistory(publicID);

  console.log(publicID);

  return (
    <>
      <ChatContent
        packages={packages}
        medical={medical}
        wellness={wellness}
        history={historyData.data}
        publicIDFetch={publicID}
        user={userData}
      />
    </>
  );
}
