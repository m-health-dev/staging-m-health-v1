import ChatContent from "@/components/chatbot/ChatContent";
import Footer from "@/components/utility/footer/Footer";
import NavHeader from "@/components/utility/header/NavHeader";
import { getChatHistory } from "@/lib/chatbot/getChatActivity";
import { getAllMedical, getLatest3Medical } from "@/lib/medical/getMedical";
import { getAllPackages, getLatest3Packages } from "@/lib/packages/getPackages";
import { getLatest3Wellness } from "@/lib/wellness/getWellness";
import { cookies } from "next/headers";

import { v4 as uuidv4 } from "uuid";

export default async function Home() {
  const { data: packages } = await getLatest3Packages();
  const { data: medical } = await getLatest3Medical();
  const { data: wellness } = await getLatest3Wellness();

  const cookie = await cookies();

  const getPublicID = cookie.get("mhealth_public_id");
  const publicID = getPublicID?.value as string;

  const historyData = await getChatHistory(publicID);

  console.log(publicID);

  return (
    <>
      <NavHeader />
      <ChatContent
        packages={packages}
        medical={medical}
        wellness={wellness}
        history={historyData.data}
        publicIDFetch={publicID}
      />
    </>
  );
}
